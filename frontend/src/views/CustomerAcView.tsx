import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  Divider,
  Box,
  FormControl,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import NavigationBar from "../components/NavigationBar";
import { SelectChangeEvent } from "@mui/material/Select";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { fetchAcInfo, getAcInfo, updateAcInfo } from "../slices/authSlice";
import { fetchSettings, getSettings } from "../slices/adminSlice";
import { set } from "lodash";

const CustomerAcView: React.FC = () => {
  const dispatch = useAppDispatch();
  const acInfo = useSelector(getAcInfo);
  const settings = useSelector(getSettings);

  const [roomNumber, setRoomNumber] = useState(acInfo?.roomNumber || "");
  const [currentTemperature, setCurrentTemperature] = useState(
    acInfo?.currentTemperature || 0,
  );
  const [targetTemperature, setTargetTemperature] = useState(
    acInfo?.targetTemperature || 0,
  );
  const [acStatus, setAcStatus] = useState(acInfo?.acStatus || false);
  const [acMode, setAcMode] = useState(acInfo?.acMode || "低风速");
  const cost = acInfo?.cost || 0;

  // 只用一次
  useEffect(() => {
    if (acInfo) {
      setRoomNumber(acInfo.roomNumber);
      setCurrentTemperature(acInfo.currentTemperature);
      setTargetTemperature(acInfo.targetTemperature);
      setAcStatus(acInfo.acStatus);
      setAcMode(acInfo.acMode);
    }
  }, [acInfo]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchAcInfo());
      dispatch(fetchSettings());
    };
    fetchData();
  }, [dispatch]);

  // 定时器,每5秒执行一次
  useEffect(() => {
    // 创建一个定时器
    const timerId = setInterval(() => {
      dispatch(fetchAcInfo());
    }, 5000);

    // 返回一个清理函数，用于在组件卸载时清除定时器
    return () => clearInterval(timerId);
  }, []); // 空依赖数组，effect 只在组件挂载时执行一次

  useEffect(() => {
    if (targetTemperature === 0 || currentTemperature === 0) {
      return;
    }
    if (
      acInfo.targetTemperature === targetTemperature &&
      acInfo.acStatus === acStatus &&
      acInfo.acMode === acMode
    ) {
      return;
    }
    const acI = {
      targetTemperature: targetTemperature,
      acStatus: acStatus,
      acMode: acMode,
    };
    dispatch(updateAcInfo(acI));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTemperature, acStatus, acMode]);

  // 增加温度
  const increaseTemperature = () => {
    if (acStatus && targetTemperature < settings.temperatureUpper) {
      setTargetTemperature(targetTemperature + 1);
    }
  };

  // 减少温度
  const decreaseTemperature = () => {
    if (acStatus && targetTemperature > settings.temperatureLower) {
      setTargetTemperature(targetTemperature - 1);
    }
  };

  // 切换空调状态
  const toggleAcStatus = () => {
    setAcStatus(!acStatus);
  };

  // 切换空调模式
  const handleAcModeChange = (event: SelectChangeEvent<string>) => {
    setAcMode(event.target.value);
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{ paddingTop: "16px", paddingBottom: "16px" }}
            >
              空调操控系统
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {roomNumber}
                  <span style={{ float: "right" }}>{acInfo.queueStatus}</span>
                </Typography>
                <Divider style={{ margin: "10px 0" }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      当前温度
                    </Typography>
                    <Typography variant="h4">{currentTemperature}°C</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      设置温度
                    </Typography>
                    <Typography variant="h4">{targetTemperature}°C</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      当前费率
                    </Typography>
                    <Typography variant="h4">
                      {acMode === "低风速" && settings.lowSpeedFee}
                      {acMode === "中风速" && settings.midSpeedFee}
                      {acMode === "高风速" && settings.highSpeedFee} RMB/°C
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      已产生费用
                    </Typography>
                    <Typography variant="h4">{cost.toFixed(2)}°C</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      状态
                    </Typography>
                    <Typography
                      variant="h6"
                      color={acStatus ? "primary" : "error"}
                    >
                      <ButtonGroup
                        color="primary"
                        aria-label="outlined primary button group"
                        variant="outlined"
                        style={{ margin: "10px 0" }}
                      >
                        <Button onClick={toggleAcStatus}>
                          {acStatus ? "关闭" : "打开"}
                        </Button>
                      </ButtonGroup>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      风速
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={acMode}
                        onChange={handleAcModeChange}
                        displayEmpty
                        inputProps={{ "aria-label": "选择空调模式" }}
                        sx={{ maxWidth: "200px" }}
                      >
                        <MenuItem value="低风速">低风速</MenuItem>
                        <MenuItem value="中风速">中风速</MenuItem>
                        <MenuItem value="高风速">高风速</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Divider style={{ margin: "20px 0" }} />
                <Box display="flex" flexDirection="column" alignItems="center">
                  <ButtonGroup
                    color="primary"
                    aria-label="outlined primary button group"
                    variant="outlined"
                    style={{ margin: "10px 0" }}
                  >
                    <Button onClick={decreaseTemperature}>-</Button>
                    <Button onClick={increaseTemperature}>+</Button>
                  </ButtonGroup>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={settings?.status === false}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            mt: 2,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 深色半透明背景
            color: "#fff", // 白色文本
            padding: "20px", // 内边距
            borderRadius: "10px", // 圆角边框
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)", // 轻微的阴影效果
            fontWeight: "medium", // 字体权重
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px", // 元素间距
            maxWidth: "400px", // 最大宽度
            margin: "auto", // 水平居中
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: 60, // emoji字体大小
            }}
          >
            🚫
          </Box>
          主空调不可用
        </Typography>
      </Backdrop>
    </>
  );
};

export default CustomerAcView;
