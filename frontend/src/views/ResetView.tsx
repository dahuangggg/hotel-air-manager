import axios from "axios";
import { toast } from "react-toastify";
import { Button, Paper } from "@mui/material";

const ResetView = () => {
  const reset = async () => {
    try {
      const response = await axios.get("/api/conditioners/reset/");
      // 如果返回的状态码是200，说明接口请求成功，否则的话抛出错误
      if (response.status === 200) {
        toast.success("重置成功");
      } else {
        toast.error("重置失败");
      }
    } catch (error) {
      console.log(error);
      toast.error("重置失败, 后端的问题");
    }
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
          点击重置按钮所有空调状态将被重置
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #ccc",
            margin: "10px 0",
          }}
        />
        <Button variant="outlined" onClick={reset} style={{ margin: "10px" }}>
          重置
        </Button>
      </Paper>
    </div>
  );
};

export default ResetView;
