import React from 'react';
import {useAppDispatch} from '../store';
import {Link, useNavigate} from 'react-router-dom';
import {AppBar, Toolbar, Typography, Button} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import {isLoggedin, logout} from '../slices/authSlice'; // 假设你有一个authSlice来处理登录状态

const NavigationBar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(isLoggedin); // 假设登录状态保存在 auth 的 Redux state 中

    const handleLogout = () => {
        navigate('/logout'); // 调用登出的 action
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        首页
                    </Link>
                </Typography>
                {isLoggedIn ? (
                    <Button color="inherit" onClick={handleLogout}>
                        登出
                    </Button>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        登录
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
