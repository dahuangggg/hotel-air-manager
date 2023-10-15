import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, TypedDispatch } from "../store";
import { setAxiosAuthToken } from "./utils";
import { NavigateFunction } from "react-router-dom";

// 不考虑安全性,就用用户名当令牌算了
let initToken: string | null = null;
if (localStorage.getItem("token")) {
  initToken = localStorage.getItem("token");
  setAxiosAuthToken(initToken);
}

const initialState = {
  token: initToken as string | null,
  roomsName: [] as string[],
  blockUI: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      setAxiosAuthToken(action.payload);
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    setRoomsName(state, action: PayloadAction<string[]>) {
      state.roomsName = action.payload;
    },
    setBlockUI(state, action: PayloadAction<boolean>) {
      state.blockUI = action.payload;
    },
  },
});

export const { setToken, setRoomsName, setBlockUI } = authSlice.actions;

export const getToken = (state: RootState) => state.auth.token;
export const getRoomsName = (state: RootState) => state.auth.roomsName;
export const getBlockUI = (state: RootState) => state.auth.blockUI;

export const login =
  (name: string, password: string, navigate: NavigateFunction) =>
  async (dispatch: TypedDispatch) => {
    try {
      const url = "/api/acounts/login/";
      const { data } = await axios.post(url, { name, password });
      // console.log(data);
      dispatch(setToken(data.token));
      if (data.token === "管理员") {
        navigate("/manager");
      } else if (data.token === "前台") {
        navigate("/reception");
      } else if (data.token.includes("房间")) {
        navigate("/customer");
      } else {
        navigate("/login");
        console.log("未知错误,联系管理员吧");
      }
    } catch (error) {
      console.log(error);
    }
  };

export const logout =
  (navigate: NavigateFunction) => async (dispatch: TypedDispatch) => {
    dispatch(setToken(null));
    navigate("/");
  };

export const fetchRoomsName = () => async (dispatch: TypedDispatch) => {
  try {
    const url = "/api/acounts/get_rooms_name/";
    const { data } = await axios.get(url);
    const roomsName = data.rooms_name;
    dispatch(setRoomsName(roomsName));
  } catch (error) {
    console.log(error);
  }
};

export default authSlice.reducer;
