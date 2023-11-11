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
import { useSelector} from "react-redux";
import {
  fetchAcInfos,
  getAcInfos,
  getSettings,
  updateAcInfo,
  updateSettings,
} from "../slices/adminSlice";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { toast } from "react-toastify";
import AdminSettings from "../components/AdminSettings";

const ManagerAcView: React.FC = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const allAcInfos = useSelector(getAcInfos);
  const settings = useSelector(getSettings);

  useEffect(() => {
    dispatch(fetchAcInfos());
  }, [dispatch]);

  const handleAcStatusToggle = (roomNumber: string) => {
    const oddAcInfo = allAcInfos.find(
      (acInfo) => acInfo.roomNumber === roomNumber,
    );
    if (!oddAcInfo) {
      toast.error("未知错误"); //新的调试工具,翻译为“面包框”
      return;
    }
    dispatch(
      updateAcInfo(
        roomNumber,
        oddAcInfo.targetTemperature,
        !oddAcInfo.acStatus,
        oddAcInfo.acMode,
      ),
    );
  };

  const handStatusClick = () => {
    toast.info("状态已更新");
    dispatch(
      updateSettings({
        status: !settings.status,
        mode: settings.mode,
        temperatureUpper: settings.temperatureUpper,
        temperatureLower: settings.temperatureLower,
        lowSpeedFee: settings.lowSpeedFee,
        midSpeedFee: settings.midSpeedFee,
        highSpeedFee: settings.highSpeedFee,
      }),
    );
  };

  const handleModeChange = (
    roomNumber: string,
    e: SelectChangeEvent<string>,
  ) => {
    const acInfo = allAcInfos.find((acInfo) => acInfo.roomNumber === roomNumber);
    if (!acInfo) return; // 如果没有找到对应的信息，直接返回

    const newAcMode = e.target.value as string;
    dispatch(
      updateAcInfo(roomNumber, acInfo.targetTemperature, acInfo.acStatus, newAcMode),
    );
  }

    const handleTemperatureChange = async (roomNumber: string, delta: number) => {
        const acInfo = allAcInfos.find((acInfo) => acInfo.roomNumber === roomNumber);
        if (!acInfo) return; // 如果没有找到对应的信息，直接返回

        const newTargetTemperature = (acInfo.targetTemperature || 0) + delta;
        await dispatch(
        updateAcInfo(roomNumber, newTargetTemperature, acInfo.acStatus, acInfo.acMode),
        );
    };

  if (!settings.status) {
    return <AdminSettings />;
  }

  return (
    <>
      <NavigationBar />
      <div style={{ height: "64px" }} />
      <Container>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ paddingTop: "16px", paddingBottom: "16px" }}
        >
          管理员空调信息
          <Button variant="text" onClick={handStatusClick}>
            {settings.status ? "开启" : "关闭"}
          </Button>
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
                    <TableCell>队列状态</TableCell>
                    <TableCell>当前费用</TableCell>
                    <TableCell>累计费用</TableCell>
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
                          <Button
                            onClick={() =>
                              handleTemperatureChange(acInfo.roomNumber, -1)
                            }
                          >
                            -
                          </Button>
                          <Button variant="outlined">{acInfo.targetTemperature}°C</Button>
                          <Button
                            onClick={() =>
                              handleTemperatureChange(acInfo.roomNumber, 1)
                            }
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell>
                        <Select
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
                        </Select>
                      </TableCell>
                      <TableCell>{acInfo.queueStatus}</TableCell>
                      <TableCell>{acInfo.cost?.toFixed(2)}元</TableCell>
                      <TableCell>{(acInfo?.cost + acInfo?.totalCost).toFixed(2)}元</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={acInfo.acStatus ? "info" : "inherit"}
                          onClick={() =>
                            handleAcStatusToggle(acInfo.roomNumber)
                          }
                        >
                          {acInfo.acStatus ? "已开启" : "已关闭"}
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

export default ManagerAcView;
