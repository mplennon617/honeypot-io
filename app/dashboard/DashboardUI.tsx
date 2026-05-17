"use client";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

type DailyPoint = { date: string; count: number };
type SiteCount = { site: string; count: number };

interface Props {
  todayCount: number;
  dailyData: DailyPoint[];
  topSites: SiteCount[];
  sevenDayAvg: number;
  sevenDayHigh: number;
  sevenDayLow: number;
}

const DONUT_COLORS = ["#2D728F", "#3A8FAD", "#4AACCC", "#F49E4C", "#F5B87A"];

const card: React.CSSProperties = {
  border: "1.5px solid #e0e0e0",
  borderRadius: "14px",
  backgroundColor: "#fff",
  padding: "20px",
};

export default function DashboardUI({
  todayCount,
  dailyData,
  topSites,
  sevenDayAvg,
  sevenDayHigh,
  sevenDayLow,
}: Props) {
  const maxSiteCount = topSites[0]?.count || 1;

  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        padding: "28px 32px",
      }}
    >
      <h1
        style={{
          fontSize: "1.15rem",
          fontWeight: 600,
          marginBottom: "22px",
          textDecoration: "underline",
          color: "#111",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gridTemplateRows: "auto auto",
          gap: "16px",
          alignItems: "start",
        }}
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Visits Today */}
          <div style={{ ...card, textAlign: "center", padding: "28px 20px" }}>
            <div
              style={{
                fontSize: "5.5rem",
                fontWeight: 700,
                lineHeight: 1,
                color: "#111",
              }}
            >
              {todayCount}
            </div>
            <div style={{ fontSize: "1rem", color: "#555", marginTop: "10px" }}>
              Visits Today
            </div>
          </div>

          {/* Top Sites — table */}
          <div style={card}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "14px",
                color: "#333",
              }}
            >
              Today&apos;s Top Sites
            </div>
            {topSites.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
                No visits yet today
              </div>
            ) : (
              topSites.map((s, i) => (
                <div
                  key={s.site}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                    fontSize: "0.78rem",
                  }}
                >
                  <span style={{ minWidth: "18px", color: "#777" }}>
                    {i + 1}.
                  </span>
                  <span
                    style={{
                      minWidth: "70px",
                      maxWidth: "70px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#222",
                    }}
                  >
                    {s.site}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "10px",
                      backgroundColor: "#eee",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(s.count / maxSiteCount) * 100}%`,
                        height: "100%",
                        backgroundColor: "#2D728F",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      minWidth: "22px",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {s.count}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Top Sites — donut */}
          <div style={card}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "4px",
                color: "#333",
              }}
            >
              Today&apos;s Top Sites
            </div>
            {topSites.length === 0 ? (
              <div
                style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "8px" }}
              >
                No visits yet today
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={topSites}
                    dataKey="count"
                    nameKey="site"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {topSites.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: ValueType | undefined, name: NameType | undefined) => [
                      `${value ?? "undefined"} visits`,
                      name,
                    ]}
                    contentStyle={{ fontSize: "0.78rem" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Line chart */}
          <div style={{ ...card, paddingBottom: "12px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dailyData}
                margin={{ top: 8, right: 16, bottom: 0, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#888" }}
                  interval={Math.floor(dailyData.length / 4)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#888" }}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={{ fontSize: "0.78rem" }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2D728F"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 7-day stats */}
          <div style={{ ...card, padding: "28px 32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >
              {[
                { label: "7-Day Avg", value: sevenDayAvg },
                { label: "7-Day High", value: sevenDayHigh },
                { label: "7-Day Low", value: sevenDayLow },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "3.25rem",
                      fontWeight: 700,
                      color: "#111",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
