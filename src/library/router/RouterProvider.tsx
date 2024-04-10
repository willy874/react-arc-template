import { Router } from '@/core/context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, RouterProvider as Provider, createBrowserRouter, useLocation } from 'react-router-dom';
import type { Location, RouteObject } from 'react-router-dom';

interface RouterGuardProps {
  onChange: (location: Location, prev: Location) => void;
}

function RouterGuard({ onChange }: RouterGuardProps) {
  const location = useLocation();
  const prevRef = useRef(location);
  useEffect(() => {
    onChange(location, prevRef.current);
    prevRef.current = location;
  }, [location, onChange]);
  return <Outlet />;
}

export interface RouterProviderProps {
  router: Router<RouteObject>;
  onChange?: RouterGuardProps['onChange'];
}

export default function RouterProvider({ router, onChange = () => {} }: RouterProviderProps) {
  const onChangeRef = useRef(onChange);
  const [onChangeFn] = useState(() => (location: Location<any>, prev: Location<any>) => {
    onChangeRef.current(location, prev);
  });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const reactRouter = useMemo(() => {
    const routes = router.getRoutes();
    return createBrowserRouter([
      {
        path: '/',
        element: <RouterGuard onChange={onChangeFn} />,
        children: routes,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Provider router={reactRouter} />;
}
