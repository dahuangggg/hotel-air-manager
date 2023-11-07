// import React, { useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { useAppDispatch } from "../store";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchAcInfos, getAcInfo, getAcInfos } from "../slices/authSlice";
// import { useNavigate } from "react-router-dom";
// import NavigationBar from "./NavigationBar";

// const AdminAcView: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const allAcInfos = useSelector(getAcInfos);

//   useEffect(() => {
//     dispatch(fetchAcInfos());
//   }, [dispatch]);

//   return (
//     <>
//       <NavigationBar />
//       <Container>
//         <Typography
//           variant="h4"
//           align="center"
//           gutterBottom
//           style={{ paddingTop: "16px", paddingBottom: "16px" }}
//         >
//           管理员空调信息
//         </Typography>
//         <Card elevation={3}>
//           <CardContent>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>房间号</TableCell>
//                     <TableCell>当前温度</TableCell>
//                     <TableCell>目标温度</TableCell>
//                     <TableCell>风速</TableCell>
//                     <TableCell>状态</TableCell>
//                     <TableCell>详情</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {allAcInfos.map((acInfo, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{acInfo.roomNumber}</TableCell>
//                       <TableCell>{acInfo.currentTemperature}°C</TableCell>
//                       <TableCell>{acInfo.targetTemperature}°C</TableCell>
//                       <TableCell>{acInfo.acMode}</TableCell>
//                       <TableCell>{acInfo.acStatus ? "开启" : "关闭"}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           onClick={() => {
//                             navigate(`/ac-control/${acInfo.roomNumber}`);
//                           }}
//                         >
//                           查看
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CardContent>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default AdminAcView;

// //
// // // 测试完成!
// // import {
// //     Container,
// //     Typography,
// //     Button,
// //     Table,
// //     TableBody,
// //     TableCell,
// //     TableContainer,
// //     TableHead,
// //     TableRow,
// //     Card,
// //     CardContent,
// //     Box,
// // } from "@mui/material";
// // import React, { useEffect, useState } from "react";
// // import { fetchAcInfos, getAcInfo, getAcInfos } from "../slices/authSlice";
// // import { useAppDispatch } from "../store";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// //
// // const ReceptionView: React.FC = () => {
// //   const dispatch = useAppDispatch();
// //   //   const [acInfoData, setAcInfoData] = useState(null); // 这里存储从fetchAcInfo获取的数据
// //   const allAcInfos = useSelector(getAcInfos);
// //
// //   useEffect(() => {
// //     // 这是一个假设。实际上，fetchAcInfo函数应该返回数据，但在给出的代码中它没有返回。
// //     // 因此，请根据实际情况修改这部分代码。
// //     const fetchData = async () => {
// //       dispatch(fetchAcInfos());
// //       //   setAcInfoData(data.data);
// //       //   console.log(data.data);
// //     };
// //
// //     fetchData();
// //   }, [dispatch]);
// //
// //   return (
// //     <Container>
// //       <Typography variant="h4" align="center" gutterBottom>
// //         测试fetchAcInfos
// //       </Typography>
// //       <Box mt={3}>
// //         <Typography>
// //           acInfo: {allAcInfos ? JSON.stringify(allAcInfos) : "加载中..."}
// //         </Typography>
// //       </Box>
// //     </Container>
// //   );
// // };
// //
// // export default ReceptionView;

// 写一个简单的return
import React, { useEffect } from "react";

const ReceptionView: React.FC = () => {
  return <div>ReceptionView</div>;
};

export default ReceptionView;
