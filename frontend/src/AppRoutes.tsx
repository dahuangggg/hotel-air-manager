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
import ReceptionView from "./views/ReceptionView";
import AdminLoginView from "./views/AdminLoginView";
import ReceptionLoginView from "./views/ReceptionLogin";
import ResetView from "./views/ResetView";

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
          <Route path="/adminLogin" element={<AdminLoginView />} />
          <Route path="/receptionLogin" element={<ReceptionLoginView />} />
          <Route path="/reset" element={<ResetView />} />

          {/* 认证的父路由 */}
          <Route path="/customer" element={<RequireAuth type="customer" />}>
            <Route index element={<CustomerAcView />} />
          </Route>
          <Route path="/ac-manager" element={<RequireAuth type="manager" />}>
            <Route index element={<MyComponent />} />
          </Route>
          <Route path="/reception" element={<RequireAuth type="reception" />}>
            <Route index element={<ReceptionView />} />
          </Route>
        </Routes>
      </App>
    </Router>
  );
}
