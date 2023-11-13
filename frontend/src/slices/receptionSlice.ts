import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, TypedDispatch } from "../store";
import axios from "axios";
import { toast } from "react-toastify";
import { setBlockUI } from "./authSlice";


type roomNumber = {
    [key: string]: boolean;
};

// 不考虑安全性,就用用户名当令牌算了
let initToken: string | null = null;
if (localStorage.getItem("token")) {
  initToken = localStorage.getItem("token");
}

const initialState = {
  token: initToken as string | null,
    roomNumbers:[] as roomNumber[],
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
    setRoomNumbers(state, action: PayloadAction<roomNumber[]>) {
        state.roomNumbers = action.payload;
        }
  },
});

export const { setToken,setRoomNumbers  } = receiptionSlice.actions; // 添加了setRoomNumbers

export const getRoomNumbers = (state: RootState) => state.reception.roomNumbers;


export const fetchRoomNumbers =
  () => async (dispatch: TypedDispatch) => {
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
            dispatch(setBlockUI(true));// 设置阻塞
            const { data } = await axios.post(url, { room_number: roomNumber, password: password });
            toast.success("登记成功");
            dispatch(setBlockUI(false));
        } catch (error) {
            console.log(error);
            toast.error("登记失败");
        }
    };

export default receiptionSlice.reducer;
