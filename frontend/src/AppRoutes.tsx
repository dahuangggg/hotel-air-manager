import { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import BlockUi from "react-block-ui";
import { getBlockUI } from "./slices/authSlice";
import RequireAuth from "./components/RequireAuth";

import IndexView from "./views/IndexView";
import CustomerAcView from "./views/CustomerAcView";
import LoginView from "./views/LoginView";
import MyComponent from "./views/ManagerView";
import LogoutView from "./views/LogoutView";

type Props = {
  children: ReactNode;
};

function App(props: Props) {
  const { children } = props;
  const blocking = useSelector(getBlockUI);
  return <BlockUi blocking={blocking}>{children}</BlockUi>;
}

export default function AppRoutes() {
  return (
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<IndexView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/logout" element={<LogoutView />} />

          {/* 认证的父路由 */}
          <Route path="/customer" element={<RequireAuth />}>
            <Route index element={<CustomerAcView />} />
          </Route>
          <Route path="/ac-manager" element={<RequireAuth />}>
            <Route index element={<MyComponent />} />
          </Route>
        </Routes>
      </App>
    </Router>
  );
}
