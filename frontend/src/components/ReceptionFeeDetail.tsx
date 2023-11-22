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
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import RoomExpenseChart from "./RoomExpenseChart";
import RoomCostPieChart from "./RoomCostPieChart";

const ReceptionFeeDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const details = useSelector(getDetail);
  const [selectedStartDateTime, setSelectedStartDateTime] =
    useState<Dayjs | null>(null);
  const [selectedEndDateTime, setSelectedEndDateTime] = useState<Dayjs | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchDetail("init", "init"));
    // 输出detail的值
    console.log(details);
  }, [dispatch]);

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
        <Box
          display="flex"
          justifyContent="space-between"
          marginLeft={2}
          marginBottom={1}
          marginTop={1}
        >
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
              color="primary"
              sx={{ marginTop: "20px" }}
              onClick={() => {
                if (
                  selectedStartDateTime === null ||
                  selectedEndDateTime === null
                ) {
                  toast.error("开始时间和结束时间不能为空");
                  return;
                } else if (selectedStartDateTime.isAfter(selectedEndDateTime)) {
                  toast.error("开始时间不能在结束时间之后");
                } else {
                  dispatch(
                    fetchDetail(
                      selectedStartDateTime?.format("YYYY-MM-DD HH:mm:ss"),
                      selectedEndDateTime?.format("YYYY-MM-DD HH:mm:ss"),
                    ),
                  );
                }
              }}
            >
              给我搜
            </Button>
            <Button
              variant="text"
              color="primary"
              sx={{ marginTop: "20px" }}
              onClick={() => {
                // 获取当前时间
                const currentDate = dayjs();
                setSelectedEndDateTime(currentDate);

                // 计算一周前的时间
                const oneWeekAgo = currentDate.subtract(1, "week");
                // 设置 selectedStartDateTime 为一周前的时间, 但是时分秒为 00:00:00
                setSelectedStartDateTime(oneWeekAgo.startOf("day"));
              }}
            >
              周报
            </Button>
            <Button
              variant="text"
              color="primary"
              sx={{ marginTop: "20px" }}
              onClick={() => {
                // 获取当前时间
                const currentDate = dayjs();
                setSelectedEndDateTime(currentDate);

                // 计算一天前的时间
                const oneDayAgo = currentDate.subtract(1, "day");

                // 设置 selectedStartDateTime 为一天前的时间, 但是时分秒为 00:00:00
                setSelectedStartDateTime(oneDayAgo.startOf("day"));
              }}
            >
              日报
            </Button>
          </Box>
        </Box>
        <Card elevation={3}>
          <CardContent>
            <TableContainer>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box marginTop={5}>
          <MonitorNumbers details={details} />
        </Box>
        <div style={{ height: "64px" }}></div>
        <div className="row">
          {/* <canvas height="320" width="705"> */}
          <RoomExpenseChart />
          {/* </canvas> */}
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
                  {/* <canvas height="320" width="324"></canvas> */}
                  <RoomCostPieChart />
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
