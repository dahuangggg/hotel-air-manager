import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import {
  checkOutForCustomer,
  fetchAllLogs,
  fetchDetail,
  fetchRoomNumbers,
  getAllLogs,
  getDetail,
  getRoomNumbers,
} from "../slices/receptionSlice";
import {
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { StepIconProps } from "@mui/material/StepIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { fetchAcInfos, getAcInfos } from "../slices/adminSlice";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <GroupAddIcon />,
    2: <ReceiptLongIcon />,
    3: <DoneAllIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ["选择房间号", "离店结账", "完成离店"];

const ReceptionCheckOut = () => {
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const roomNumber = useSelector(getRoomNumbers);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const allLogs = useSelector(getAllLogs);
  const acInfos = useSelector(getAcInfos);
  const columns = [
    { field: "type", headerName: "类型", width: 90 },
    { field: "time", headerName: "时间", width: 180 },
    { field: "operator", headerName: "操作人", width: 75 },
    // 隐藏""对象""列.
    { field: "object", headerName: "对象", width: 75, hide: true },
    { field: "remark", headerName: "Remark", width: 800 },
    // 按照需要定义其他列
  ];
  // 将 allLogs 转换成符合 DataGrid 需求的 rows 格式
  const rows = allLogs.map((log, index) => ({
    id: index + 1, // 假设 id 为索引加一
    type: log.type,
    time: log.time,
    operator: log.operator,
    object: log.object,
    remark: log.remark,
    // 可以根据需要添加其他属性
  }));

  useEffect(() => {
    if (activeStep === 0) {
      dispatch(fetchRoomNumbers());
    }
    dispatch(fetchAllLogs());
    dispatch(fetchDetail());
  }, [dispatch, activeStep]);

  const handleButtonClick = (room: string) => {
    setSelectedRoom(room);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleConfirmClick = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    dispatch(checkOutForCustomer(selectedRoom));
    dispatch(fetchAcInfos());
  };

  const handleExpandClick =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleBack = () => {
    setActiveStep(0);
    setSelectedRoom("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      {activeStep === 0 && (
        <Paper
          elevation={3}
          style={{ padding: "20px", width: "800px", textAlign: "center" }}
        >
          <div
            style={{
              color: "gray",
              textAlign: "left",
              marginBottom: "10px",
              fontSize: "25px",
            }}
          >
            请选择房间号, 灰色代表房间目前空闲
          </div>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #ccc",
              margin: "10px 0",
            }}
          />
          <Grid container spacing={2}>
            {Object.entries(roomNumber).map(([room, isClickable]) => (
              <Grid item key={room} xs={6}>
                <Button
                  variant="outlined"
                  onClick={() => handleButtonClick(room)}
                  disabled={isClickable ? true : false}
                  fullWidth
                  style={{ fontSize: "30px" }}
                >
                  {room}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      {activeStep === 1 && (
        <div>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleExpandClick("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                {selectedRoom} 共消费 {acInfos.find(detail => detail.roomNumber === selectedRoom) ? acInfos.find(detail => detail.roomNumber === selectedRoom)?.cost : 0} 元
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                展开以查看详细,点击EXPORT按钮以下载详单
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ height: 510, width: "100%" }}>
                <DataGrid
                  columns={columns}
                  rows={rows}
                  slots={{ toolbar: GridToolbar }}
                  initialState={{
                    ...rows,
                    filter: {
                      ...rows.filter,
                      filterModel: {
                        items: [
                          {
                            id: 1,
                            field: 'object',
                            value: selectedRoom,
                            operator: 'contains',
                          },
                        ],
                      },
                    },
                    columns: {
                      columnVisibilityModel: {
                        object: false,
                      },
                    },
                  }}
                />
              </div>
            </AccordionDetails>
            <Button
            variant="contained"
            // 间隔2,右对齐
            sx={{ mr: 2,mb: 1, mt:-1, float: "right" }}
            onClick={handleConfirmClick}
            style={{ fontSize: "15px" }}
          >
            确认离店
          </Button>
          </Accordion>
        </div>
      )}
      {activeStep === 2 && (
        <Paper
          elevation={3}
          style={{ padding: "20px", width: "500px", textAlign: "center" }}
        >
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: "10px",
              fontSize: "25px",
            }}
          >
            退房成功,空调状态以重置
          </div>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #ccc",
              margin: "10px 0",
            }}
          />
          <Button variant="outlined" onClick={handleBack}>
            返回
          </Button>
        </Paper>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1200px",
        }}
      >
        <Stack sx={{ width: "100%", minHeight: "100px" }} spacing={4}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<ColorlibConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </div>
    </div>
  );
};

export default ReceptionCheckOut;
