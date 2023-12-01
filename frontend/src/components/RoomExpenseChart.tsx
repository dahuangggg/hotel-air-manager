/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Papa from "papaparse";
import { useSelector } from "react-redux";
import { getRoomExpense } from "../slices/receptionSlice";
import { useAppDispatch } from "../store";
import { fetchRoomExpense } from "../slices/receptionSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const RoomExpenseChart: React.FC = () => {
  const roomExpense = useSelector(getRoomExpense);
  const dispatch = useAppDispatch();
  const [highlightedRoom, setHighlightedRoom] = useState<string>("房间101");

  useEffect(() => {
    dispatch(fetchRoomExpense());
  }, [dispatch]);

  // 生成一个包含所有日期的集合
  const getAllDates = () => {
    const dates = new Set<string>();
    roomExpense.forEach((room) =>
      room.datasets.forEach((data) => dates.add(data.label)),
    );
    return Array.from(dates).sort();
  };

  // 处理数据，补全缺失的日期并设置费用为0
  const processData = () => {
    const allDates = getAllDates();
    const datasets = roomExpense.map((room) => {
      const roomData: Record<string, number> = {}; // 明确类型为 Record<string, number>
      room.datasets.forEach((data) => {
        roomData[data.label] = data.cost;
      });

      const filledData = allDates.map((date) => ({
        x: date,
        y: roomData[date] ?? 0, // 如果没有数据，默认费用为0
      }));

      return {
        label: room.labels,
        data: filledData,
        borderColor: room.labels === highlightedRoom ? "red" : "blue",
        borderWidth: room.labels === highlightedRoom ? 3 : 1,
        tension: 0.1,
      };
    });

    return {
      labels: allDates,
      datasets,
    };
  };

  const [chartData, setChartData] = useState(processData());
  const csvLinkRef = useRef<HTMLAnchorElement>(null);

  // 当highlightedRoom或roomExpense变化时，更新图表数据
  useEffect(() => {
    setChartData(processData());
  }, [highlightedRoom, roomExpense]);

  // 导出为CSV
  const exportToCSV = () => {
    const csvData = roomExpense.map((room) => ({
      room: room.labels,
      data: room.datasets.map((d) => `${d.label}, ${d.cost}`).join("; "),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = URL.createObjectURL(blob);
    const link = csvLinkRef.current;

    if (link) {
      // 确保 link 不为 null
      link.href = csvURL;
      link.download = "rooms-data.csv";
      link.click();
    }
  };

  return (
    <div className="col-lg-7 col-xl-8">
      <div className="card shadow mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="text-primary fw-bold m-0">费用折线图</h6>
          <div className="dropdown no-arrow">
            <button
              className="btn btn-link btn-sm dropdown-toggle"
              aria-expanded="false"
              data-bs-toggle="dropdown"
              type="button"
            >
              <i className="fas fa-ellipsis-v text-gray-400"></i>
            </button>
            <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
              <p className="text-center dropdown-header">操作</p>
              <a className="dropdown-item" href="/reception">
                {" "}
                刷新
              </a>
              <a className="dropdown-item" href="#" onClick={exportToCSV}>
                Export to CSV
              </a>
              <a ref={csvLinkRef} href="#" style={{ display: "none" }} download>
                Download
              </a>{" "}
              {/* 隐藏的下载链接 */}
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="chart-area">
            <div>
              <Line data={chartData} />
              <div className="mb-3">
                <label htmlFor="roomSelect" className="form-label">
                  选择高亮的房间号:
                </label>
                <select
                  className="form-select"
                  id="roomSelect"
                  onChange={(e) => setHighlightedRoom(e.target.value)}
                  value={highlightedRoom}
                >
                  {roomExpense.map((room, i) => (
                    <option key={i} value={room.labels}>
                      {room.labels}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomExpenseChart;
