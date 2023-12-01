import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
import { getDetail } from "../slices/receptionSlice";

export default function RoomCostPieChart() {
  // 使用 useSelector 从 Redux 获取 details 数据
  const details = useSelector(getDetail);

  // 将 details 数据转换为 PieChart 所需的格式
  const data = details.map((detail, index) => ({
    id: index,
    value: detail.total_cost,
    label: detail.roomNumber,
  }));

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
        },
      ]}
      height={200}
    />
  );
}
