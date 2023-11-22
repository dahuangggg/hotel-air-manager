// 要求customer认证
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { getToken } from "../slices/authSlice";

type Props = {
  type: string;
};

export default function RequireAuth(props: Props) {
  const token = useSelector(getToken);
  let location = useLocation();

  if (props.type === "customer" && !token?.includes("房间")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (props.type === "manager" && token !== "管理员") {
    return <Navigate to="/adminLogin" state={{ from: location }} replace />;
  }

  if (props.type === "reception" && token !== "前台") {
    return <Navigate to="/receptionLogin" state={{ from: location }} replace />;
  }

  // 如果token正确，则渲染子路由
  return <Outlet />;
}
