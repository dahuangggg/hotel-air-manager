import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Breadcrumbs as MUIBreadcrumbs,
  Box,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ReceptionCheckIn from "../components/ReceptionCheckIn";
import ReceptionCheckOut from "../components/ReceptionCheckOut";
import ReceptionFeeDetail from "../components/ReceptionFeeDetail";

type ActiveComponent = "check-in" | "check-out" | "fee-detail";

const ReceptionView: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent | "">(
    "",
  );

  const renderComponent = () => {
    switch (activeComponent) {
      case "check-in":
        return <ReceptionCheckIn />;
      case "check-out":
        return <ReceptionCheckOut />;
      case "fee-detail":
        return <ReceptionFeeDetail />;
      default:
        return null;
    }
  };

  const handleBreadcrumbReceptionClick = () => {
    setActiveComponent("");
  };

  const breadcrumbs = (
    <MUIBreadcrumbs aria-label="breadcrumb">
      <RouterLink to="/" style={{ textDecoration: "none", color: "white" }}>
        Home
      </RouterLink>
      {activeComponent && (
        <Typography
          color="white"
          style={{ cursor: "pointer" }}
          onClick={handleBreadcrumbReceptionClick}
        >
          Reception
        </Typography>
      )}
      <Typography color="white">{activeComponent}</Typography>
    </MUIBreadcrumbs>
  );

  const handleButtonClick = (component: ActiveComponent) => {
    setActiveComponent(component);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            {activeComponent ? (
              breadcrumbs
            ) : (
              <Typography variant="h6">
                <RouterLink
                  to="/"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  首页
                </RouterLink>
              </Typography>
            )}
          </Box>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      {!activeComponent ? (
        <Grid container spacing={2} justifyContent="center" sx={{ my: 4 }}>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => handleButtonClick("check-in")}
            >
              Check In
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => handleButtonClick("check-out")}
            >
              Check Out
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => handleButtonClick("fee-detail")}
            >
              Fee Detail
            </Button>
          </Grid>
        </Grid>
      ) : (
        renderComponent()
      )}
    </Box>
  );
};

export default ReceptionView;
