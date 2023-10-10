import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import IndexView from "./views/IndexView";
import CustomerAcView from "./views/CustomerAcView";
import LoginView from "./views/LoginView";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexView />} />
        <Route path="/customer" element={<CustomerAcView />} />
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </Router>
  );
}