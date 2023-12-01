import React, { useState } from "react";
import { Typography, Breadcrumbs as MUIBreadcrumbs, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ReceptionCheckIn from "../components/ReceptionCheckIn";
import ReceptionCheckOut from "../components/ReceptionCheckOut";
import ReceptionFeeDetail from "../components/ReceptionFeeDetail";
import NavigationBar from "../components/NavigationBar/NavigationBar";

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
      <RouterLink to="/" style={{ textDecoration: "none", color: "black" }}>
        Home
      </RouterLink>
      {activeComponent && (
        <Typography
          color="black"
          style={{ cursor: "pointer" }}
          onClick={handleBreadcrumbReceptionClick}
        >
          Reception
        </Typography>
      )}
      <Typography color="black">{activeComponent}</Typography>
    </MUIBreadcrumbs>
  );

  const handleButtonClick = (component: ActiveComponent) => {
    setActiveComponent(component);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <NavigationBar breadcrumbs={breadcrumbs} />

      {!activeComponent ? (
        <div>
          <div className="container">
            <div className="pricing-header p-5 px-5 mx-5 pb-md-4 text-center">
              <h1 className="display-4 fw-normal mt-5">前台管理系统</h1>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="row row-cols-1 row-cols-md-3 mb-3 mt-5 text-center">
                <div className="col-md-3 offset-md-1">
                  <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                      <h4 className="my-0 fw-normal">入住登记</h4>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled mt-3 mb-4">
                        <li>
                          <h5>选择房间</h5>
                        </li>
                        <li>
                          <h5>房间选择</h5>
                        </li>
                        <li>
                          <h5>入住日期</h5>
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="w-100 btn btn-lg btn-outline-primary"
                        onClick={(e) => {
                          handleButtonClick("check-in");
                        }}
                      >
                        前往
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 offset-md-1">
                  <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                      <h4 className="my-0 fw-normal">离店结账</h4>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled mt-3 mb-4">
                        <li>
                          <h5>费用结算</h5>
                        </li>

                        <li>
                          <h5>收据打印</h5>
                        </li>
                        <li>
                          <h5>空调重置</h5>
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="w-100 btn btn-lg btn-outline-primary"
                        onClick={(e) => {
                          handleButtonClick("check-out");
                        }}
                      >
                        前往
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 offset-md-1">
                  <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                      <h4 className="my-0 fw-normal">查看报表</h4>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled mt-3 mb-4">
                        <li>
                          <h5>入住统计</h5>
                        </li>
                        <li>
                          <h5>收入统计</h5>
                        </li>
                        <li>
                          <h5>下载报表</h5>
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="w-100 btn btn-lg btn-outline-primary"
                        onClick={(e) => {
                          handleButtonClick("fee-detail");
                        }}
                      >
                        前往
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        renderComponent()
      )}
    </Box>
  );
};

export default ReceptionView;
