import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, TypedDispatch } from "../store";
import axios from "axios";
import { toast } from "react-toastify";
import { setBlockUI } from "./authSlice";
import { type } from "os";

export type roomNumber = {
  [key: string]: boolean;
};

export type detailType = {
  roomNumber: string;
  on_off_times: number;
  dispatch_times: number;
  detail_times: number;
  temperature_times: number;
  mode_times: number;
  request_time: number;
  total_cost: number;
};

// 另一个detailType
type detailType2 = {
  roomNumber: string;
  requestDuaration: number;
  startTime: string;
  endTime: string;
  serviceDuaration: number;
  speed: string;
  cost: number;
  fee: number;
};

type logType = {
  type: string;
  time: string;
  operator: string;
  object: string;
  remark: string;
};

type roomExpenseType = {
  labels: string;
  datasets: {
    label: string;
    cost: number;
  }[];
};

// 不考虑安全性,就用用户名当令牌算了
let initToken: string | null = null;
if (localStorage.getItem("token")) {
  initToken = localStorage.getItem("token");
}

const initialState = {
  token: initToken as string | null,
  // roomNumbers: [] as roomNumber[],
  roomNumbers: {} as roomNumber,
  detail: [] as detailType[],
  allLogs: [] as logType[],
  roomExpense: [] as roomExpenseType[],
  detail2: [] as detailType2[],
};

const receiptionSlice = createSlice({
  name: "receiption",
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
    setRoomNumbers(state, action: PayloadAction<roomNumber>) {
      state.roomNumbers = action.payload;
    },
    setDetail(state, action: PayloadAction<detailType[]>) {
      state.detail = action.payload;
    },
    setAllLogs(state, action: PayloadAction<logType[]>) {
      state.allLogs = action.payload;
    },
    setRoomExpense(state, action: PayloadAction<roomExpenseType[]>) {
      state.roomExpense = action.payload;
    },
    setDetail2(state, action: PayloadAction<detailType2[]>) {
      state.detail2 = action.payload;
    },
  },
});

export const {
  setToken,
  setRoomNumbers,
  setDetail,
  setAllLogs,
  setRoomExpense,
  setDetail2,
} = receiptionSlice.actions; // 添加了setRoomNumbers

export const getRoomNumbers = (state: RootState) => state.reception.roomNumbers;
export const getDetail = (state: RootState) => state.reception.detail;
export const getAllLogs = (state: RootState) => state.reception.allLogs;
export const getRoomExpense = (state: RootState) => state.reception.roomExpense;
export const getDetail2 = (state: RootState) => state.reception.detail2;

export const fetchRoomNumbers = () => async (dispatch: TypedDispatch) => {
  try {
    const url = "/api/conditioners/reception_get_room_number/";
    const { data } = await axios.get(url);
    const roomNumbers = data.room_numbers;
    dispatch(setRoomNumbers(roomNumbers));
  } catch (error) {
    console.log(error);
  }
};

// 为顾客办理登记
export const registerForCustomer =
  (roomNumber: string, password: string) => async (dispatch: TypedDispatch) => {
    try {
      const url = "/api/conditioners/reception_register_for_customer/";
      dispatch(setBlockUI(true)); // 设置阻塞
      await axios.post(url, { room_number: roomNumber, password: password });
      toast.success("登记成功");
      dispatch(fetchRoomNumbers());
      dispatch(setBlockUI(false));
    } catch (error) {
      dispatch(setBlockUI(false));
      console.log(error);
      toast.error("登记失败");
    }
  };

export const fetchDetail =
  (startTime: string, endTime: string) => async (dispatch: TypedDispatch) => {
    try {
      const url = "/api/logs/get_ac_info/";
      const { data } = await axios.post(url, {
        start_time: startTime,
        end_time: endTime,
      });
      dispatch(setDetail(data.detail));
    } catch (error) {
      console.log(error);
    }
  };

export const fetchAllLogs = () => async (dispatch: TypedDispatch) => {
  try {
    const url = "/api/logs/get_all_logs/";
    const { data } = await axios.get(url);
    dispatch(setAllLogs(data.log));
  } catch (error) {
    console.log(error);
  }
};

export const checkOutForCustomer =
  (roomNumber: string) => async (dispatch: TypedDispatch) => {
    try {
      const url = "/api/conditioners/reception_check_out_for_customer/";
      dispatch(setBlockUI(true)); // 设置阻塞
      await axios.post(url, { room_number: roomNumber });
      toast.success("退房成功");
      dispatch(fetchRoomNumbers());
      dispatch(setBlockUI(false));
    } catch (error) {
      dispatch(setBlockUI(false));
      console.log(error);
      toast.error("退房失败");
    }
  };

export const fetchRoomExpense = () => async (dispatch: TypedDispatch) => {
  try {
    const url = "/api/logs/get_room_expense/";
    const { data } = await axios.get(url);
    dispatch(setRoomExpense(data.roomExpense));
  } catch (error) {
    console.log(error);
  }
};

export const fetchDetail2 = () => async (dispatch: TypedDispatch) => {
  try {
    const url = "/api/logs/get_all_details/";
    const { data } = await axios.get(url);
    dispatch(setDetail2(data.detail));
  } catch (error) {
    console.log(error);
  }
};

export default receiptionSlice.reducer;
