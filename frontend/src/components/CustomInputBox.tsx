import React, { useEffect, useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "../store";
import { updateSettings } from "../slices/adminSlice";
import { toast } from "react-toastify";
import _ from "lodash";

type CustomInputBoxProps = {
  label: string; // 输入框标签
};

const CustomInputBox: React.FC<CustomInputBoxProps> = ({ label }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.admin.settings);
  const [speedFee, setSpeedFee] = useState("");

  // 设置初始值
  useEffect(() => {
    let initialFee;
    switch (label) {
      case "低风速费率":
        initialFee = settings.lowSpeedFee?.toString();
        break;
      case "中风速费率":
        initialFee = settings.midSpeedFee?.toString();
        break;
      case "高风速费率":
        initialFee = settings.highSpeedFee?.toString();
        break;
      default:
        initialFee = "";
    }
    setSpeedFee(initialFee || "");
  }, [settings, label]);

  // 使用useCallback和lodash的debounce来减少频繁调用dispatch
  const debouncedUpdate = useCallback(
    _.debounce((fee: number) => {
      // 根据label提交对应的更新
      switch (label) {
        case "低风速费率":
          dispatch(updateSettings({ lowSpeedFee: fee }));
          break;
        case "中风速费率":
          dispatch(updateSettings({ midSpeedFee: fee }));
          break;
        case "高风速费率":
          dispatch(updateSettings({ highSpeedFee: fee }));
          break;
        default:
          toast.error("未知的费率类型");
      }
      toast.info("费率已更新");
    }, 1000),
    [label, dispatch],
  );

  // 在组件卸载时取消debounce
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  // 更新输入值并调用debouncedUpdate
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSpeedFee(value);
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      debouncedUpdate(parsedValue);
    }
  };

  return (
    <TextField
      type="number"
      label={label}
      value={speedFee}
      onChange={handleChange}
      margin="normal"
      InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
    />
  );
};

export default CustomInputBox;
