import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import moment from "moment";

const IncomeOverview = ({ incomes = [] }) => {
  // Prepare data for chart
  const data = incomes
    .map((inc) => ({
      date: moment(inc.date).format("DD MMM"),
      amount: Number(inc.amount),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (data.length === 0)
    return <p className="text-gray-500">No income data to display chart</p>;

  return (
    <div className="card p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Income Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          {/* Gradient for the area under the line */}
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />

          {/* Gradient area */}
          <Area
            type="monotone"
            dataKey="amount"
            stroke="none"
            fill="url(#purpleGradient)"
            baseValue="dataMin" // fill down to x-axis
            isAnimationActive={true}
            animationDuration={1500}
          />

          {/* Purple line on top */}
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#a855f7"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeOverview;
