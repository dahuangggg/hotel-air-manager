import React from "react";
// import { useSelector } from "react-redux";
import { setBlockUI } from "../slices/authSlice";
import { useAppDispatch } from "../store";

const MyComponent: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleButtonClick = () => {
    dispatch(setBlockUI(true));

    // 例如，模拟一个异步操作，2秒后完成
    setTimeout(() => {
      dispatch(setBlockUI(false));
    }, 2000);
  };

  return (
    <div>
      <p>Your main content goes here.</p>
      <button onClick={handleButtonClick}>Click me to block UI</button>
    </div>
  );
};

export default MyComponent;
