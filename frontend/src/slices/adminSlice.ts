import { AcInfoType } from "./authSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, TypedDispatch } from "../store";
import axios from "axios";
import { setBlockUI } from "./authSlice";

// 不考虑安全性,就用用户名当令牌算了
let initToken: string | null = null;
if (localStorage.getItem("token")) {
  initToken = localStorage.getItem("token");
  delete axios.defaults.headers.common["Authorization"];
}

export type SettingsType = {
  status: boolean;
  temperatureUpper: number;
  temperatureLower: number;
  mode: string;
  lowSpeedFee: number;
  midSpeedFee: number;
  highSpeedFee: number;
};

const initialState = {
  token: initToken as string | null,
  acInfos: [
    {
      roomNumber: "",
      currentTemperature: 0,
      targetTemperature: 0,
      acStatus: false,
      acMode: "",
    },
  ] as AcInfoType[],
  settings: {
    status: false,
    temperatureUpper: 30,
    temperatureLower: 16,
    mode: "制冷",
    lowSpeedFee: 0.5,
    midSpeedFee: 1.0,
    highSpeedFee: 2.0,
  } as SettingsType,
};

const adminSlice = createSlice({
  name: "admin",
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
    setAcInfos(state, action: PayloadAction<AcInfoType[]>) {
      state.acInfos = action.payload;
    },
    setSettings(state, action: PayloadAction<SettingsType>) {
      state.settings = action.payload;
    },
  },
});

export const { setToken, setAcInfos, setSettings } = adminSlice.actions;

export const getAcInfos = (state: RootState) => state.admin.acInfos;
export const getSettings = (state: RootState) => state.admin.settings;

export const fetchAcInfos = () => async (dispatch: TypedDispatch) => {
  try {
    dispatch(setBlockUI(true));

    const url = "/api/conditioners/get_all_ac_info/";
    const token = localStorage.getItem("token");
    const { data } = await axios.post(url, { token });
    const acInfos = data.acs_info;
    dispatch(setAcInfos(acInfos));

    dispatch(setBlockUI(false));
  } catch (error) {
    console.log(error);
  }
};

export const updateAcInfo =
  (
    roomNumber: string,
    targetTemperature: number,
    acStatus: boolean,
    acMode: string,
  ) =>
  async (dispatch: TypedDispatch) => {
    try {
      dispatch(setBlockUI(true));

      const url = "/api/conditioners/admin_update_ac_info/";
      //   const token = localStorage.getItem("token");

      const { data } = await axios.post(url, {
        roomNumber: roomNumber,
        targetTemperature: targetTemperature,
        acStatus: acStatus,
        acMode: acMode,
      });
      dispatch(fetchAcInfos());

      dispatch(setBlockUI(false));
    } catch (error) {
      console.log(error);
    }
  };

export const fetchSettings = () => async (dispatch: TypedDispatch) => {
  try {
    dispatch(setBlockUI(true));
    const url = "/api/setup/settingInfo";
    const { data } = await axios.get(url);
    dispatch(setSettings(data));
    dispatch(setBlockUI(false));
  } catch (error) {
    console.log(error);
  }
};

export const updateSettings =
  (settings: Partial<SettingsType>) => async (dispatch: TypedDispatch) => {
    try {
      const url = "/api/setup/settingInfo";
      const { data } = await axios.post(url, settings);
      dispatch(setSettings(data));
    } catch (error) {
      console.log(error);
    }
  };

export default adminSlice.reducer;
