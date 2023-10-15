// 要求customer认证
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { getToken } from "../slices/authSlice";

export default function RequireAuth() {
  const token = useSelector(getToken);
  let location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } 
  // else if (token.includes("房间")) {
  //   return <Navigate to="/customer" state={{ from: location }} replace />;
  // } else if (token === "管理员") {
  //   return <Navigate to="/ac-manager" state={{ from: location }} replace />;
  // } else if (token === "前台") {
  //   return <Navigate to="/hotel-manager" state={{ from: location }} replace />;
  // }

  // 如果token存在，则渲染子路由
  return <Outlet />;
}
