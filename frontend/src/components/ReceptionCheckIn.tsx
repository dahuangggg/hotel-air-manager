import { ChangeEvent, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LockClockIcon from "@mui/icons-material/LockClock";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { Button, Grid, Paper } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { fetchRoomNumbers, getRoomNumbers, registerForCustomer } from "../slices/receptionSlice";
import { useAppDispatch } from "../store";

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
    2: <LockClockIcon />,
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

const steps = ["选择房间号", "修改密码", "登记完成"];

const ReceptionCheckIn = () => {
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const roomNumber = useSelector(getRoomNumbers);
  const [password, setPassword] = useState(["", "", "", ""]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    if (activeStep === 0)
    {
      dispatch(fetchRoomNumbers());
    }
  }, [dispatch ,activeStep]);

  const handlePasswordChange = (index: number, value: string) => {
    const newPassword = [...password];
    newPassword[index] = value;
    setPassword(newPassword);

    if (newPassword.every((val) => val !== "")) {
      dispatch(registerForCustomer(selectedRoom, newPassword.join("")));
      toast.success(`房间号:${selectedRoom}, 密码:${newPassword.join("")}`);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && index > 0 && password[index] === "") {
      const newPassword = [...password];
      newPassword[index - 1] = "";
      setPassword(newPassword);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBack = () => {
    setSelectedRoom("");
    setActiveStep(0);
    setPassword(["", "", "", ""]);
  };

  const handleButtonClick = (room: string) => {
    setSelectedRoom(room);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
            请选择房间号, 灰色代表房间不可用
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
                  disabled={!isClickable}
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
        <Paper
          elevation={3}
          style={{ padding: "20px", width: "400px", textAlign: "center" }}
        >
          <div style={{ fontSize: "16px", marginBottom: "10px" }}>
            为新客户设置空调密码
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={password[index]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handlePasswordChange(index, e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(index, e)
                }
                style={{
                  width: "30px",
                  height: "30px",
                  textAlign: "center",
                  marginRight: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                }}
                autoFocus={index === 0}
                ref={(input) => {
                  inputRefs.current[index] = input;
                }}
              />
            ))}
          </div>
          <Button variant="outlined" onClick={handleBack}>
            返回
          </Button>
        </Paper>
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
            登记入住成功
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

export default ReceptionCheckIn;
