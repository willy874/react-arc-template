import { modules } from '@/core/context';

const Layout = modules.Layout.Layout;
const Header = modules.Layout.Header;

export default function ArticleList() {
  return (
    <Layout>
      <Header />
      <h1>Article List</h1>
    </Layout>
  );
}
