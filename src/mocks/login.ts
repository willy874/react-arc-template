import { http, HttpResponse } from 'msw';
import CryptoJS from 'crypto-js';

const PASSWORD = 'PASSWORD';
const REFRESH_PASSWORD = 'REFRESH_PASSWORD';

interface User {
  username: string;
  password: string;
}

const database = {
  users: new Map<User['username'], User>(),
  tokens: new Map<string, string>(),
  refresh: new Map<string, string>(),
};

const dbSeed = () => {
  const user = {
    username: 'admin',
    password: CryptoJS.SHA256('admin').toString(CryptoJS.enc.Hex),
  };
  database.users.set(user.username, user);
};

export default function loginMock() {
  dbSeed();
  return [
    http.get('/user', ({ request }) => {
      const token = request.headers.get('Authorization');
      if (!token) {
        return HttpResponse.error();
      }
      const username = database.tokens.get(token);
      if (!username) {
        return HttpResponse.error();
      }
      const user = database.users.get(username);
      if (!user) {
        return HttpResponse.error();
      }
      return HttpResponse.json(user);
    }),
    http.post('/refresh', async ({ request }) => {
      const { refreshToken } = (await request.json()) as {
        refreshToken: string;
      };
      if (!refreshToken) {
        return HttpResponse.error();
      }
      const username = database.refresh.get(refreshToken);
      if (!username) {
        return HttpResponse.error();
      }
      const jwtHeaders = JSON.stringify({});
      const jwtPayload = JSON.stringify({ username });
      const accessToken = CryptoJS.AES.encrypt(`${jwtHeaders}.${jwtPayload}`, PASSWORD).toString();
      const newRefreshToken = CryptoJS.AES.encrypt(username, REFRESH_PASSWORD).toString();
      database.tokens.set(accessToken, username);
      database.refresh.set(newRefreshToken, username);
      return HttpResponse.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    }),
    http.post('/login', async ({ request }) => {
      const { username, password } = (await request.json()) as User;
      const user = database.users.get(username);
      if (!user) {
        return HttpResponse.error();
      }
      const hasPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      if (user.password !== hasPassword) {
        return HttpResponse.error();
      }
      const jwtHeaders = JSON.stringify({});
      const jwtPayload = JSON.stringify({ username });
      const accessToken = CryptoJS.AES.encrypt(`${jwtHeaders}.${jwtPayload}`, PASSWORD).toString();
      const refreshToken = CryptoJS.AES.encrypt(username, REFRESH_PASSWORD).toString();
      database.tokens.set(accessToken, username);
      database.refresh.set(refreshToken, username);
      return HttpResponse.json({
        accessToken,
        refreshToken,
      });
    }),
  ];
}
