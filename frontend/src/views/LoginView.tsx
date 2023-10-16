import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Paper,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { login, getRoomsName, fetchRoomsName } from "../slices/authSlice";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";

const LoginView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRoomsName());
  }, [dispatch]);

  const roomsName = useSelector(getRoomsName);

  const [name, setName] = useState(roomsName[0] || ""); // Default to the first room name
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(name, password, navigate));
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            登录
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="select-username-label">用户名</InputLabel>
              <Select
                labelId="select-username-label"
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="用户名"
              >
                {roomsName.map((room, index) => (
                  <MenuItem key={index} value={room}>
                    {room}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="密码"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              登录
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginView;
