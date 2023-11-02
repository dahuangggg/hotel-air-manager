// 测试完成!
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
import React, { useEffect, useState } from "react";
import { fetchAcInfos, getAcInfo, getAcInfos } from "../slices/authSlice";
import { useAppDispatch } from "../store";
import axios from "axios";
import { useSelector } from "react-redux";

const ReceptionView: React.FC = () => {
  const dispatch = useAppDispatch();
  //   const [acInfoData, setAcInfoData] = useState(null); // 这里存储从fetchAcInfo获取的数据
  const allAcInfos = useSelector(getAcInfos);

  useEffect(() => {
    // 这是一个假设。实际上，fetchAcInfo函数应该返回数据，但在给出的代码中它没有返回。
    // 因此，请根据实际情况修改这部分代码。
    const fetchData = async () => {
      dispatch(fetchAcInfos());
      //   setAcInfoData(data.data);
      //   console.log(data.data);
    };

    fetchData();
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        测试fetchAcInfos
      </Typography>
      <Box mt={3}>
        <Typography>
          acInfo: {allAcInfos ? JSON.stringify(allAcInfos) : "加载中..."}
        </Typography>
      </Box>
    </Container>
  );
};

export default ReceptionView;
