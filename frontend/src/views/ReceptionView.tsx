import React, {useEffect} from "react";
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
import {useAppDispatch} from "../store";
import {useSelector} from "react-redux";
import {fetchAcInfos, getAcInfos} from "../slices/adminSlice";
import {useNavigate} from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";

const ReceptionAcView: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const allAcInfos = useSelector(getAcInfos);

    useEffect(() => {
        dispatch(fetchAcInfos());
    }, [dispatch]);

    return (
        <>
            <NavigationBar/>
            <div style={{height: "64px"}}></div>
            <Container>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    style={{paddingTop: "16px", paddingBottom: "16px"}}
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
                                        <TableCell>当前温度</TableCell>
                                        <TableCell>目标温度</TableCell>
                                        <TableCell>风速</TableCell>
                                        <TableCell>状态</TableCell>
                                        <TableCell>详情</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allAcInfos.map((acInfo) => (
                                        <TableRow key={acInfo.roomNumber}>
                                            <TableCell>{acInfo.roomNumber}</TableCell>
                                            <TableCell>{acInfo.currentTemperature}°C</TableCell>
                                            <TableCell>
                            <span
                                style={{
                                    color: acInfo.targetTemperature === acInfo.currentTemperature ? 'black' :
                                        acInfo.targetTemperature > acInfo.currentTemperature ? 'red' :
                                            'blue', // 默认颜色
                                }}
                            >
                              {acInfo.targetTemperature}°C
                            </span>
                                            </TableCell>
                                            <TableCell>
                            <span
                                style={{
                                    color: acInfo.acMode === '高风速' ? 'red' :
                                        acInfo.acMode === '中风速' ? 'orange' :
                                            acInfo.acMode === '低风速' ? 'green' :
                                                'black', // 默认颜色
                                }}
                            >
                              {acInfo.acMode}
                            </span>
                                            </TableCell>
                                            <TableCell>
                            <span
                                style={{
                                    color: acInfo.acStatus ? 'blue' : 'gray',
                                }}
                            >
                              {acInfo.acStatus ? "已开启" : "已关闭"}
                            </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    onClick={() => {
                                                      navigate(`/reception`);
                                                    }}
                                                >
                                                  查看
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

              <div style={{height: "64px"}}></div>
                <div className="row">
                    <div className="col-lg-7 col-xl-8">
                        <div className="card shadow mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="text-primary fw-bold m-0">用量报表</h6>
                                <div className="dropdown no-arrow">
                                    <button className="btn btn-link btn-sm dropdown-toggle"
                                            aria-expanded="false"
                                            data-bs-toggle="dropdown"
                                            type="button">
                                        <i className="fas fa-ellipsis-v text-gray-400"></i>
                                    </button>
                                    <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                                        <p className="text-center dropdown-header">操作</p>
                                        <a className="dropdown-item" href="/reception"> 刷新</a>
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
                                        type="button">
                                        <i className="fas fa-ellipsis-v text-gray-400"></i>
                                    </button>
                                    <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                                        <p className="text-center dropdown-header">操作</p>
                                        <a className="dropdown-item" href="/reception"> 刷新</a>
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

export default ReceptionAcView;