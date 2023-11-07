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
} from "@mui/material";

import NavigationBar from "./NavigationBar";
import { SelectChangeEvent } from "@mui/material/Select";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { fetchAcInfo, getAcInfo, updateAcInfo } from "../slices/authSlice";

const CustomerAcView: React.FC = () => {
  const dispatch = useAppDispatch();
  const acInfo = useSelector(getAcInfo);

  const [roomNumber, setRoomNumber] = useState(acInfo?.roomNumber || "");
  const [currentTemperature, setCurrentTemperature] = useState(
    acInfo?.currentTemperature || 0,
  );
  const [targetTemperature, setTargetTemperature] = useState(
    acInfo?.targetTemperature || 0,
  );
  const [acStatus, setAcStatus] = useState(acInfo?.acStatus || false);
  const [acMode, setAcMode] = useState(acInfo?.acMode || "低风速");
  const [change, setchange] = useState(false);

  // 只用一次
  useEffect(() => {
    if (acInfo && !change) {
      setchange(true);
      setRoomNumber(acInfo.roomNumber);
      setCurrentTemperature(acInfo.currentTemperature);
      setTargetTemperature(acInfo.targetTemperature);
      setAcStatus(acInfo.acStatus);
      setAcMode(acInfo.acMode);
    }
  }, [acInfo, change]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchAcInfo());
    };
    fetchData();
  }, [dispatch]);

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
    dispatch(updateAcInfo(targetTemperature, acStatus, acMode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTemperature, acStatus, acMode]);

  // 增加温度
  const increaseTemperature = () => {
    if (acStatus && targetTemperature < 30) {
      setTargetTemperature(targetTemperature + 1);
    }
  };

  // 减少温度
  const decreaseTemperature = () => {
    if (acStatus && targetTemperature > 18) {
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
                      状态
                    </Typography>
                    <Typography
                      variant="h6"
                      color={acStatus ? "primary" : "error"}
                    >
                      {acStatus ? "开启" : "关闭"}
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CustomerAcView;
