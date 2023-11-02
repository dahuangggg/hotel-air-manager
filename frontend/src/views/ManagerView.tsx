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
  CardContent
} from "@mui/material";
import { useAppDispatch } from "../store";
import { useSelector, useDispatch } from "react-redux";
import {fetchAcInfos, getAcInfo, getAcInfos} from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const AdminAcView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const allAcInfos = useSelector(getAcInfos);

  useEffect(() => {
    dispatch(fetchAcInfos());
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
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
                  <TableCell>状态</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allAcInfos.map((acInfo, index) => (
                  <TableRow key={index}>
                    <TableCell>{acInfo.roomNumber}</TableCell>
                    <TableCell>{acInfo.currentTemperature}°C</TableCell>
                    <TableCell>{acInfo.targetTemperature}°C</TableCell>
                    <TableCell>{acInfo.acStatus ? "开启" : "关闭"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          navigate(`/ac-control/${acInfo.roomNumber}`);
                        }}
                      >
                      控制
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
  );
};

export default AdminAcView;

