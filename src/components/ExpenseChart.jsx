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

const ExpenseChart = ({ expenses = [] }) => {
  // Prepare data for the chart
  const data = expenses
    .map((exp) => ({
      date: moment(exp.date).format("DD MMM"),
      amount: Number(exp.amount),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // optional: sort by date

  if (data.length === 0)
    return <p className="text-gray-500">No expense data to display chart</p>;

  return (
    <div className="card p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Expense Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          {/* Gradient for the area under the line */}
          <defs>
            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
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
            fill="url(#redGradient)"
            baseValue="dataMin"
            isAnimationActive={true}
            animationDuration={1500}
          />

          {/* Red line on top */}
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#f87171"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
