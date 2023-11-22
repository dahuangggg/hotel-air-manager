import React, { ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Grid } from "@mui/material";
import { useAppDispatch } from "../store";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { login } from "../slices/authSlice";

const ReceptionLoginView = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const inputRefs = useRef<Array<HTMLInputElement | null>>([
        null,
        null,
        null,
        null,
      ]);
    const [password, setPassword] = React.useState(["", "", "", ""]);

    const handlePasswordChange = (index: number, value: string) => {
        const newPassword = [...password];
        newPassword[index] = value;
        setPassword(newPassword);

        if (newPassword.every((val) => val !== "")) {
            // dispatch(registerForCustomer(selectedRoom, newPassword.join("")));
            // toast.success(`房间号:${selectedRoom}, 密码:${newPassword.join("")}`);
            // setActiveStep((prevActiveStep) => prevActiveStep + 1);
            // toast.success(`密码:${newPassword.join("")}`);
            dispatch(login("前台", newPassword.join(""), navigate));
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

    return (
        <div>
            <NavigationBar breadcrumbs={null} />
            <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          style={{ padding: "20px", width: "400px", textAlign: "center" }}
        >
          <div style={{ fontSize: "16px", marginBottom: "10px" }}>
            请输入前台密码
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
        </Paper>
        </Grid>
        </Grid>
        </div>
    );
}

export default ReceptionLoginView;