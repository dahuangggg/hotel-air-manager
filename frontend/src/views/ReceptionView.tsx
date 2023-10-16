// 测试完成!
import React, { useEffect, useState } from "react";
import { fetchAcInfo, getAcInfo } from "../slices/authSlice";
import { Container, Typography, Box } from "@mui/material";
import { useAppDispatch } from "../store";
import axios from "axios";
import { useSelector } from "react-redux";

const ReceptionView: React.FC = () => {
  const dispatch = useAppDispatch();
  //   const [acInfoData, setAcInfoData] = useState(null); // 这里存储从fetchAcInfo获取的数据
  const acInfo = useSelector(getAcInfo);

  useEffect(() => {
    // 这是一个假设。实际上，fetchAcInfo函数应该返回数据，但在给出的代码中它没有返回。
    // 因此，请根据实际情况修改这部分代码。
    const fetchData = async () => {
      dispatch(fetchAcInfo());
      //   setAcInfoData(data.data);
      //   console.log(data.data);
    };

    fetchData();
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        测试fetchAcInfo
      </Typography>
      <Box mt={3}>
        <Typography>
          acInfo: {acInfo ? JSON.stringify(acInfo) : "加载中..."}
        </Typography>
      </Box>
    </Container>
  );
};

export default ReceptionView;
