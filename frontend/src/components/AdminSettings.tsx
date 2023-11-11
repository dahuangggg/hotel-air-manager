import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NavigationBar from "./NavigationBar/NavigationBar";
import { useSelector } from "react-redux";
import {
  fetchSettings,
  getSettings,
  updateSettings,
} from "../slices/adminSlice";
import { useAppDispatch } from "../store";
import CustomInputBox from "./CustomInputBox";

const AdminSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useSelector(getSettings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleStatusClick = () => {
    dispatch(updateSettings({ status: !settings.status }));
  };

  const handleModeChange = (event: SelectChangeEvent<string>) => {
    dispatch(updateSettings({ mode: event.target.value as string }));
  };

  const handleTemperatureChange = (type: "Upper" | "Lower", delta: number) => {
    dispatch(
      updateSettings({
        [`temperature${type}`]: settings[`temperature${type}`] + delta,
      }),
    );
  };

  return (
    // <Container maxWidth="md" sx={{ my: 4 }}>
      <>
      <NavigationBar />
        <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        你好,管理员
      </Typography>
      <Card elevation={4} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                状态:
                <IconButton
                  onClick={handleStatusClick}
                  color={settings.status ? "success" : "default"}
                  size="large"
                >
                  {settings.status ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="mode-select-label">工作模式</InputLabel>
                <Select
                  labelId="mode-select-label"
                  id="mode-select"
                  value={settings.mode}
                  label="工作模式"
                  onChange={handleModeChange}
                >
                  <MenuItem value="制冷">制冷</MenuItem>
                  <MenuItem value="制热">制热</MenuItem>
                  <MenuItem value="检修">检修</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                温度上限:
                <IconButton
                  onClick={() => handleTemperatureChange("Upper", 1)}
                  size="large"
                >
                  <AddIcon />
                </IconButton>
                {settings.temperatureUpper}
                <IconButton
                  onClick={() => handleTemperatureChange("Upper", -1)}
                  size="large"
                >
                  <RemoveIcon />
                </IconButton>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                温度下限:
                <IconButton
                  onClick={() => handleTemperatureChange("Lower", 1)}
                  size="large"
                >
                  <AddIcon />
                </IconButton>
                {settings.temperatureLower}
                <IconButton
                  onClick={() => handleTemperatureChange("Lower", -1)}
                  size="large"
                >
                  <RemoveIcon />
                </IconButton>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomInputBox label="低风速费率" />
              <CustomInputBox label="中风速费率" />
              <CustomInputBox label="高风速费率" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
        </>
  );
};

export default AdminSettings;
