import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { isLoggedin } from "../../slices/authSlice";
import "./NavigationBar.css";

type Props = {
  breadcrumbs: JSX.Element | null;
};

const NavigationBar: React.FC<Props> = ({breadcrumbs}) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(isLoggedin);


  const handleLogout = () => {
    navigate("/logout");
  };

  const handleLogin = (event: SelectChangeEvent<string>) => {
  const selectedValue = event.target.value as string;
  if (selectedValue === 'customer') {
    navigate('/Login');
  }
  if (selectedValue === 'ac-manager') {
    navigate('/adminLogin');
  }
  if (selectedValue === 'room-manager') {
        navigate('/receptionLogin');
  }
};

  return (
      <>
        <AppBar
            position="fixed"
            color="default"
            elevation={1}
            sx={{
              color: "black",
              backgroundColor: "rgba(255, 255, 255, 0.6)", // 半透明白色背景
              backdropFilter: 'blur(5px)', // 添加背景模糊效果
            }}
        >
          <Toolbar>
            {breadcrumbs}
            <Box sx={{flexGrow: 0, marginRight: 40}}></Box>
            <Box sx={{flexGrow: 0, marginRight: 8}}>
              <Typography variant="h6" component="div">
                <img
                    src={"/BUPT.svg"}
                    alt={"BUPT"}
                    style={{height: 40, width: 40, marginRight: 8}}
                />
                <a className={"navbar-brand"} href={"/"}>
                  波普特酒店
                </a>
              </Typography>
            </Box>
            <Box sx={{flexGrow: 0, marginRight: 8}}>
              <Typography variant="h6" component="div">
                <Link
                    to="/"
                    className="nav-link"
                    style={{textDecoration: "none", color: "inherit"}}
                >
                  首页
                </Link>
              </Typography>
            </Box>
            <Box sx={{flexGrow: 0, marginRight: 8}}>
              <Typography variant="h6" component="div">
                <a
                    href="#culture"
                    className="nav-link"
                    style={{textDecoration: "none", color: "inherit"}}
                >
                  酒店文化
                </a>
              </Typography>
            </Box>
            {/*为了符合逻辑，应该导航栏应该没有跳转到不同角色的按钮。*/}
            {/*<Box sx={{ flexGrow: 0, marginRight: 8 }}>*/}
            {/*  <Typography variant="h6" component="div">*/}
            {/*    <Link*/}
            {/*      to="/customer"*/}
            {/*      className="nav-link"*/}
            {/*      style={{ textDecoration: "none", color: "inherit" }}*/}
            {/*    >*/}
            {/*      顾客*/}
            {/*    </Link>*/}
            {/*  </Typography>*/}
            {/*</Box>*/}
            {/*<Box sx={{ flexGrow: 0, marginRight: 8 }}>*/}
            {/*  <Typography variant="h6" component="div">*/}
            {/*    <Link*/}
            {/*      to="/ac-manager"*/}
            {/*      className="nav-link"*/}
            {/*      style={{ textDecoration: "none", color: "inherit" }}*/}
            {/*    >*/}
            {/*      管理*/}
            {/*    </Link>*/}
            {/*  </Typography>*/}
            {/*</Box>*/}
            {/*<Box sx={{ flexGrow: 0, marginRight: 8 }}>*/}
            {/*  <Typography variant="h6" component="div">*/}
            {/*    <Link*/}
            {/*      to="/reception"*/}
            {/*      className="nav-link"*/}
            {/*      style={{ textDecoration: "none", color: "inherit" }}*/}
            {/*    >*/}
            {/*      前台*/}
            {/*    </Link>*/}
            {/*  </Typography>*/}
            {/*</Box>*/}
            <Box sx={{flexGrow: 1}}/>
            {isLoggedIn ? (
                <Button variant="contained" color="primary" onClick={handleLogout}>
                  登出
                </Button>
            ) : (
                <Select
                    style={{color: "black"}}
                    displayEmpty
                    onChange={handleLogin}
                    renderValue={(selected) => {
                      if (selected) {
                        return selected === "customer"
                            ? "顾客"
                            : selected === "ac-manager"
                                ? "管理"
                                : selected === "room-manager"
                                    ? "前台"
                                    : "";
                      }
                      return "请先登录";
                    }}
                    inputProps={{"aria-label": "Without label"}}
                >
                  <MenuItem value="customer">
                      顾客
                  </MenuItem>
                  <MenuItem value="ac-manager">
                      管理
                  </MenuItem>
                  <MenuItem value="room-manager">
                      前台
                  </MenuItem>
                </Select>
            )}
            <Box sx={{flexGrow: 0, marginRight: 40}}></Box>
          </Toolbar>
        </AppBar>
      </>
  );
};

export default NavigationBar;
