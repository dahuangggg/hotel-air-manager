import React, { useState } from "react";
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
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

const CustomerAcView: React.FC = () => {
  // 初始状态
  const [roomNumber, setRoomNumber] = useState("Room 101");
  const [currentTemperature, setCurrentTemperature] = useState(25);
  const [targetTemperature, setTargetTemperature] = useState(25);
  const [acStatus, setAcStatus] = useState("Off");
  const [acMode, setAcMode] = useState("Normal");

  // 增加温度
  const increaseTemperature = () => {
    if (acStatus === "On" && targetTemperature < 30) {
      setTargetTemperature(targetTemperature + 1);
    }
  };

  // 减少温度
  const decreaseTemperature = () => {
    if (acStatus === "On" && targetTemperature > 18) {
      setTargetTemperature(targetTemperature - 1);
    }
  };

  // 切换空调状态
  const toggleAcStatus = () => {
    setAcStatus(acStatus === "On" ? "Off" : "On");
  };

  // 切换空调模式
  const handleAcModeChange = (event: SelectChangeEvent<string>) => {
    setAcMode(event.target.value);
  };

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
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
                    color={acStatus === "On" ? "primary" : "error"}
                  >
                    {acStatus}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    模式
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={acMode}
                      onChange={handleAcModeChange}
                      displayEmpty
                      inputProps={{ "aria-label": "选择空调模式" }}
                    >
                      <MenuItem value="Normal">正常模式</MenuItem>
                      <MenuItem value="Energy Saving">节能模式</MenuItem>
                      <MenuItem value="Auto">自动模式</MenuItem>
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
                    {acStatus === "On" ? "关闭" : "打开"}
                  </Button>
                </ButtonGroup>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerAcView;
