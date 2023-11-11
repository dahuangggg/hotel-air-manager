// 登出视图
import React from "react";
import {useNavigate} from "react-router-dom";
import {Button, Paper, Grid, Typography} from "@mui/material";
import {useAppDispatch} from "../store";
import {logout} from "../slices/authSlice";
import NavigationBar from "../components/NavigationBar/NavigationBar";

// 登出视图,点击登出按钮,调用dispatch(logout(navigate))函数,该函数在authSlice.ts中定义
const LogoutView: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logout(navigate));
    };

    return (
        <>
            <NavigationBar/>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{height: "100vh"}}
            >
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Paper elevation={3} style={{padding: "20px"}}>
                        <Typography variant="h4" align="center" gutterBottom>
                            登出
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                            >
                                登出
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default LogoutView;
