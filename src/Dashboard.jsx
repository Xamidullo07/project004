import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const sampleData = [
  { name: "A", value: 30 },
  { name: "B", value: 80 },
  { name: "C", value: 45 },
  { name: "D", value: 60 },
  { name: "E", value: 20 },
];

export default function Dashboard() {
  const [blocks, setBlocks] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addBlock = (type) => {
    const id = Date.now();
    setBlocks((prev) => [
      ...prev,
      { id, type, x: (prev.length * 2) % 12, y: Infinity, w: 3, h: 3 },
    ]);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <div className="dashboard-container">
      <div className="toolbar">
        <button onClick={() => addBlock("image")}>Add Image</button>
        <button onClick={() => addBlock("bar-chart")}>Add Bar Chart</button>
        <button onClick={() => addBlock("line-chart")}>Add Line Chart</button>
        <button onClick={() => addBlock("pie-chart")}>Add Pie Chart</button>
      </div>
      <GridLayout
        className="dashboard"
        layout={blocks.map(({ id, x, y, w, h }) => ({
          i: id.toString(),
          x,
          y,
          w,
          h,
        }))}
        cols={width > 1024 ? 12 : width > 768 ? 8 : 4}
        rowHeight={50}
        width={width - 20}
        onLayoutChange={(newLayout) => {
          setBlocks((prev) =>
            newLayout.map(({ i, x, y, w, h }) => ({
              ...prev.find((b) => b.id.toString() === i),
              x,
              y,
              w,
              h,
            }))
          );
        }}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            className="block"
            data-grid={{ x: block.x, y: block.y, w: block.w, h: block.h }}
          >
            <div className="block-content">
              {block.type === "image" && (
                <img
                  src="/placeholder.jpg"
                  alt="placeholder"
                  className="responsive-image"
                />
              )}
              {block.type === "bar-chart" && (
                <BarChart
                  width={block.w * 50}
                  height={block.h * 40}
                  data={sampleData}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              )}
              {block.type === "line-chart" && (
                <LineChart
                  width={block.w * 50}
                  height={block.h * 40}
                  data={sampleData}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ff7300" />
                </LineChart>
              )}
              {block.type === "pie-chart" && (
                <PieChart width={block.w * 50} height={block.h * 40}>
                  <Pie
                    data={sampleData}
                    dataKey="value"
                    nameKey="name"
                    fill="#8884d8"
                    label
                  />
                </PieChart>
              )}
              <button
                className="remove-btn"
                onClick={() => removeBlock(block.id)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </GridLayout>
      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100vh;
          background: #121212;
          color: #fff;
          overflow: hidden;
        }
        .toolbar {
          display: flex;
          gap: 10px;
          padding: 10px;
          background: #222;
          width: 100%;
          justify-content: center;
        }
        .toolbar button {
          padding: 8px 12px;
          background: #4f46e5;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .toolbar button:hover {
          background: #3b36c0;
        }
        .dashboard {
          width: 100%;
          max-width: 1200px;
          padding: 10px;
          background: #1e1e1e;
        }
        .block {
          background: #1e1e1e;
          border: 1px solid #444;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
        }
        .block-content {
          width: 100%;
          height: 100%;
          text-align: center;
          position: relative;
        }
        .remove-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: red;
          color: white;
          border: none;
          cursor: pointer;
          padding: 5px;
          font-size: 12px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
