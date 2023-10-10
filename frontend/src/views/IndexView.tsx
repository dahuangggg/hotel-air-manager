import React from 'react';
import { Button, Container, Grid, Typography, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#343541', // 修改按钮主颜色
    },
  },
});

const IndexView: React.FC = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <Container style={{ height: '100vh', backgroundColor: '#f0f0f0' }}> {/* 设置背景颜色 */}
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <Grid item>
            <Typography variant="h4" gutterBottom>
              欢迎来到我们的网站！
            </Typography>
          </Grid>
          <Grid item style={{ width: '80%', marginBottom: '20px', maxWidth: '300px' }}>
            <Link to="/customer" style={{ width: '100%' }}>
              <Button variant="contained" color="primary" style={{ width: '100%' }}>
                顾客
              </Button>
            </Link>
          </Grid>
          <Grid item style={{ width: '80%', marginBottom: '20px', maxWidth: '300px' }}>
            <Link to="/ac-manager" style={{ width: '100%' }}>
              <Button variant="contained" color="primary" style={{ width: '100%' }}>
                空调管理员
              </Button>
            </Link>
          </Grid>
          <Grid item style={{ width: '80%', maxWidth: '300px' }}>
            <Link to="/hotel-manager" style={{ width: '100%' }}>
              <Button variant="contained" color="primary" style={{ width: '100%' }}>
                酒店管理员
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default IndexView;
