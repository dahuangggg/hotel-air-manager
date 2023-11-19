import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { fetchDetail, getDetail } from "../slices/receptionSlice";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import MonitorNumbers from "./MonitorNumbers";

const ReceptionFeeDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const details = useSelector(getDetail);
  const [selectedStartDateTime, setSelectedStartDateTime] = useState(null);
  const [selectedEndDateTime, setSelectedEndDateTime] = useState(null);

  useEffect(() => {
    dispatch(fetchDetail());
  }, [dispatch]);

  // const handleNowButtonClick = (setSelectedDateTime:React.Dispatch<React.SetStateAction<null>>) => {
  //   setSelectedDateTime(new Date()); // 设置当前时间
  // };

  return (
    <>
      <div style={{ height: "64px" }}></div>
      <Container>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ paddingTop: "25px", paddingBottom: "16px" }}
        >
          前台空调信息
        </Typography>
        <Card elevation={3}>
          <CardContent>
            <TableContainer>
              <Box display="flex" justifyContent="space-between">
                <Box marginRight={0}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        slotProps={{
                          actionBar: {
                            actions: ["today", "accept", "cancel"],
                          },
                        }}
                        label="开始时间"
                        value={selectedStartDateTime}
                        onChange={(newValue) => {
                          setSelectedStartDateTime(newValue);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      slotProps={{
                        actionBar: {
                          actions: ["today", "accept", "cancel"],
                        },
                      }}
                      label="结束时间"
                      value={selectedEndDateTime}
                      onChange={(newValue) => {
                        setSelectedEndDateTime(newValue);
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <Box>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      console.log(selectedStartDateTime);
                      console.log(selectedEndDateTime);
                    }}
                  >
                    给我搜
                  </Button>
                </Box>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>房间号</TableCell>
                    <TableCell>开关次数</TableCell>
                    <TableCell>调度次数</TableCell>
                    <TableCell>详单条数</TableCell>
                    <TableCell>调温次数</TableCell>
                    <TableCell>调风次数</TableCell>
                    <TableCell>请求时长</TableCell>
                    <TableCell>总费用</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((detail) => (
                    <TableRow key={detail.roomNumber}>
                      <TableCell>{detail.roomNumber}</TableCell>
                      <TableCell>{detail.on_off_times}</TableCell>
                      <TableCell>{detail.dispatch_times}</TableCell>
                      <TableCell>{detail.detail_times}</TableCell>
                      <TableCell>{detail.temperature_times}</TableCell>
                      <TableCell>{detail.mode_times}</TableCell>
                      <TableCell>{detail.request_time.toFixed(1)} s</TableCell>
                      <TableCell>{detail.total_cost}</TableCell>
                      {/* <TableCell>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => {
                            dispatch(fetchDetail());
                          }}
                        >
                          刷新
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box marginTop={5}>
          <MonitorNumbers
            // on_off_times={details.reduce((a, b) => a + b.on_off_times, 0)}
            // dispatch_times={details.reduce((a, b) => a + b.dispatch_times, 0)}
            // detail_times={details.reduce((a, b) => a + b.detail_times, 0)}
            // temperature_times={details.reduce(
            //   (a, b) => a + b.temperature_times,
            //   0,
            // )}
            // mode_times={details.reduce((a, b) => a + b.mode_times, 0)}
            // request_time={parseFloat(
            //   details.reduce((a, b) => a + b.request_time, 0).toFixed(1),
            // )}
            details={details}
          />
        </Box>
        <div style={{ height: "64px" }}></div>
        <div className="row">
          <div className="col-lg-7 col-xl-8">
            <div className="card shadow mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="text-primary fw-bold m-0">用量报表</h6>
                <div className="dropdown no-arrow">
                  <button
                    className="btn btn-link btn-sm dropdown-toggle"
                    aria-expanded="false"
                    data-bs-toggle="dropdown"
                    type="button"
                  >
                    <i className="fas fa-ellipsis-v text-gray-400"></i>
                  </button>
                  <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                    <p className="text-center dropdown-header">操作</p>
                    <a className="dropdown-item" href="/reception">
                      {" "}
                      刷新
                    </a>
                    {/*<div className="dropdown-divider"></div>*/}
                    {/*<a className="dropdown-item" href="#"> Something else here</a>*/}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-area">
                  <canvas height="320" width="705"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-xl-4">
            <div className="card shadow mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="text-primary fw-bold m-0">花费报表</h6>
                <div className="dropdown no-arrow">
                  <button
                    className="btn btn-link btn-sm dropdown-toggle"
                    aria-expanded="false"
                    data-bs-toggle="dropdown"
                    type="button"
                  >
                    <i className="fas fa-ellipsis-v text-gray-400"></i>
                  </button>
                  <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                    <p className="text-center dropdown-header">操作</p>
                    <a className="dropdown-item" href="/reception">
                      {" "}
                      刷新
                    </a>
                    {/*<div className="dropdown-divider"></div>*/}
                    {/*<a className="dropdown-item" href="#"> Something else here</a>*/}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-area">
                  <canvas height="320" width="324"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ReceptionFeeDetail;
