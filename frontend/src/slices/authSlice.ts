import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, TypedDispatch } from "../store";
import { NavigateFunction } from "react-router-dom";
import _ from "lodash";

// 不考虑安全性,就用用户名当令牌算了
let initToken: string | null = null;
if (localStorage.getItem("token")) {
  initToken = localStorage.getItem("token");
}

export type AcInfoType = {
  roomNumber: string;
  currentTemperature: number;
  targetTemperature: number;
  acStatus: boolean;
  acMode: string;
  cost: number;
  totalCost: number;
  queueStatus: string;
};

const initialState = {
  token: initToken as string | null,
  roomsName: [] as string[],
  blockUI: false,
  acInfo: {
    roomNumber: "",
    currentTemperature: 0,
    targetTemperature: 0,
    acStatus: false,
    acMode: "",
  } as AcInfoType,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
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
    setAcInfo(state, action: PayloadAction<AcInfoType>) {
      state.acInfo = action.payload;
    },
  },
});

export const { setToken, setRoomsName, setBlockUI, setAcInfo } =
  authSlice.actions;

export const getToken = (state: RootState) => state.auth.token;
export const getRoomsName = (state: RootState) => state.auth.roomsName;
export const getBlockUI = (state: RootState) => state.auth.blockUI;
export const getAcInfo = (state: RootState) => state.auth.acInfo;
export const isLoggedin = (state: RootState) => !!state.auth.token;

export const login =
  (name: string, password: string, navigate: NavigateFunction) =>
  async (dispatch: TypedDispatch) => {
    try {
      const url = "/api/acounts/login/";
      const { data } = await axios.post(url, { name, password });
      dispatch(setToken(data.token));
      await dispatch(fetchAcInfo());
      if (data.token === "管理员") {
        navigate("/ac-manager");
      } else if (data.token === "前台") {
        navigate("/ac-reception");
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

export const fetchAcInfo =
  () => async (dispatch: TypedDispatch, getState: () => RootState) => {
    try {
      // dispatch(setBlockUI(true));

      const oldAcInfo = getState().auth.acInfo; // 获取旧的acInfo状态

      const url = "/api/conditioners/get_ac_info/";
      const token = localStorage.getItem("token");
      const { data } = await axios.post(url, { token });
      const newAcInfo = data;

      // 使用lodash的isEqual方法来进行深度比较
      if (!_.isEqual(oldAcInfo, newAcInfo)) {
        dispatch(setAcInfo(newAcInfo));
      }

      // dispatch(setBlockUI(false));
    } catch (error) {
      console.error(error);
    }
  };

export const updateAcInfo =
  (acInfo: Partial<AcInfoType>) => async (dispatch: TypedDispatch) => {
    try {
      dispatch(setBlockUI(true));

      const url = "/api/conditioners/update_ac_info/";
      const token = localStorage.getItem("token");

      const { data } = await axios.post(url, acInfo, { params: { token } });
      dispatch(setAcInfo(data));

      dispatch(setBlockUI(false));
    } catch (error) {
      console.log(error);
    }
  };

export default authSlice.reducer;
