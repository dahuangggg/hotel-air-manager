import React, { useEffect } from "react";
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
} from "@mui/material";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDetail, getDetail } from "../slices/receptionSlice";

const ReceptionFeeDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const details = useSelector(getDetail)

  useEffect(() => {
    dispatch(fetchDetail());
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
