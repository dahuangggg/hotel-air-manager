import React, { useEffect } from "react";
import {
  Container,
  Typography,
  ButtonGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { useAppDispatch } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { fetchAcInfos, getAcInfos, updateAcInfo } from "../slices/adminSlice";
import { useNavigate, Link } from "react-router-dom";
// import { increaseTemperature, decreaseTemperature, toggleAcStatus, handleAcModeChange } from './CustomerAcView';
import NavigationBar from "./NavigationBar";
import { toast } from "react-toastify";

const AdminAcView: React.FC = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const allAcInfos = useSelector(getAcInfos);

  useEffect(() => {
    dispatch(fetchAcInfos());
  }, [dispatch]);

  // const getAcInfoByRoomNumber = (roomNumber: string) => {
  //   return allAcInfos.find((acInfo) => acInfo.roomNumber === roomNumber);
  // };

  const handleAcStatusToggle = (roomNumber: string) => {
    const oddAcInfo = allAcInfos.find((acInfo) => acInfo.roomNumber === roomNumber);
    if (!oddAcInfo){
      toast.error("未知错误"); //新的调试工具,翻译为“面包框”
      return;
    }
    dispatch(updateAcInfo(roomNumber, oddAcInfo.targetTemperature, !oddAcInfo.acStatus, oddAcInfo.acMode));
  };

  // const handleModeChange = (
  //   roomNumber: string,
  //   e: SelectChangeEvent<string>,
  // ) => {
  //   const acInfo = getAcInfoByRoomNumber(roomNumber);
  //   if (!acInfo) return; // 如果没有找到对应的信息，直接返回

  //   const newAcMode = e.target.value as string;
  //   dispatch(
  //     updateAcInfo(acInfo.targetTemperature, acInfo.acStatus, newAcMode),
  //   );
  // };

  // const handleTemperatureChange = async (roomNumber: string, delta: number) => {
  //   const acInfo = getAcInfoByRoomNumber(roomNumber);
  //   if (!acInfo) return; // 如果没有找到对应的信息，直接返回

  //   const newTargetTemperature = (acInfo.targetTemperature || 0) + delta;
  //   await dispatch(
  //     updateAcInfo(newTargetTemperature, acInfo.acStatus, acInfo.acMode),
  //   );
  // };

  return (
    <>
      <NavigationBar />
      <Container>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ paddingTop: "16px", paddingBottom: "16px" }}
        >
          管理员空调信息
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allAcInfos.map((acInfo) => (
                    <TableRow key={acInfo.roomNumber}>
                      <TableCell>{acInfo.roomNumber}</TableCell>
                      <TableCell>{acInfo.currentTemperature}°C</TableCell>
                      <TableCell>
                        <ButtonGroup
                          size="small"
                          aria-label="small outlined button group"
                        >
                          {/* <Button
                            onClick={() =>
                              handleTemperatureChange(acInfo.roomNumber, -1)
                            }
                          >
                            -
                          </Button> */}
                          <Button disabled>{acInfo.targetTemperature}°C</Button>
                          {/* <Button
                            onClick={() =>
                              handleTemperatureChange(acInfo.roomNumber, 1)
                            }
                          >
                            +
                          </Button> */}
                        </ButtonGroup>
                      </TableCell>
                      <TableCell>
                        {/* <Select
                          value={acInfo.acMode}
                          onChange={(e) =>
                            handleModeChange(acInfo.roomNumber, e)
                          }
                          displayEmpty
                          size="small"
                        >
                          <MenuItem value="低风速">低风速</MenuItem>
                          <MenuItem value="中风速">中风速</MenuItem>
                          <MenuItem value="高风速">高风速</MenuItem>
                        </Select> */}
                        {acInfo.acMode}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={acInfo.acStatus ? "primary" : "secondary"}
                          onClick={() =>
                            handleAcStatusToggle(acInfo.roomNumber)
                          }
                        >
                          {acInfo.acStatus ? "关闭" : "打开"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AdminAcView;
