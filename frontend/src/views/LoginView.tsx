import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { login } from "../slices/authSlice";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

type LocationState = {
  from: {
    pathname: string;
  };
};

export default function LoginView() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let redirectPath = "/app";
  if (location && location.state) {
    const { from } = location.state as LocationState;
    redirectPath = from.pathname;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch(login(email, password, redirectPath, navigate));
    toast.success("Login successful");
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography variant="h5" align="center">
          请登录
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={email === "" || password === ""}
          >
            登录
          </Button>
        </form>
      </div>
      <Box mt={8}></Box>
    </Container>
  );
}
