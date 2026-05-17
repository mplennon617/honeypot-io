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
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

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
const CARD = "border-[1.5px] border-[#e0e0e0] rounded-[14px] bg-white p-5";

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
    <div className="p-4 sm:px-8 sm:py-7 bg-[#f4f4f4] min-h-screen">
      <h1 className="text-[1.15rem] font-semibold mb-[22px] underline text-[#111]">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-4 items-start">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-4">

          {/* Visits Today */}
          <div className={`${CARD} text-center px-5 py-7`}>
            <div className="text-7xl sm:text-[5.5rem] font-bold leading-none text-[#111]">
              {todayCount}
            </div>
            <div className="text-base text-[#555] mt-2.5">Visits Today</div>
          </div>

          {/* Top Sites — table */}
          <div className={CARD}>
            <div className="text-[0.85rem] font-semibold mb-3.5 text-[#333]">
              Today&apos;s Top Sites
            </div>
            {topSites.length === 0 ? (
              <div className="text-xs text-[#aaa]">No visits yet today</div>
            ) : (
              topSites.map((s, i) => (
                <div
                  key={s.site}
                  className="flex items-center gap-2 mb-2 text-[0.78rem]"
                >
                  <span className="min-w-[18px] text-[#777]">{i + 1}.</span>
                  <span className="min-w-[70px] max-w-[70px] truncate text-[#222]">
                    {s.site}
                  </span>
                  <div className="flex-1 h-[10px] bg-[#eee] rounded-[3px] overflow-hidden">
                    <div
                      className="h-full bg-[#2D728F] rounded-[3px]"
                      style={{ width: `${(s.count / maxSiteCount) * 100}%` }}
                    />
                  </div>
                  <span className="min-w-[22px] text-right text-[#555]">
                    {s.count}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Top Sites — donut */}
          <div className={CARD}>
            <div className="text-[0.85rem] font-semibold mb-1 text-[#333]">
              Today&apos;s Top Sites
            </div>
            {topSites.length === 0 ? (
              <div className="text-[0.8rem] text-[#aaa] mt-2">
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
                    formatter={(
                      value: ValueType | undefined,
                      name: NameType | undefined
                    ) => [`${value ?? "?"} visits`, name]}
                    contentStyle={{ fontSize: "0.78rem" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">

          {/* Line chart */}
          <div className={`${CARD} pb-3`}>
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
          <div className={`${CARD} px-6 py-5`}>
            <div className="flex justify-around text-center">
              {[
                { label: "7-Day Avg", value: sevenDayAvg },
                { label: "7-Day High", value: sevenDayHigh },
                { label: "7-Day Low", value: sevenDayLow },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[0.9rem] text-[#555] mb-2.5">{label}</div>
                  <div className="text-5xl sm:text-[3.25rem] font-bold text-[#111] leading-none">
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
