import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Layers2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axiosConfig from "../util/axiosConfig"; // ✅ use shared instance

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosConfig.get("/dashboard"); // ✅ relative path
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-600">Loading dashboard…</div>;
  if (!data)
    return (
      <div className="p-6 text-red-600">Failed to load dashboard data.</div>
    );

  const currency = (num) => `₹${num.toLocaleString("en-IN")}`;

  const chartData = [
    { name: "Total Balance", value: data.totalBalance, color: "#6b21a8" },
    { name: "Total Expense", value: data.totalExpense, color: "#dc2626" },
    { name: "Total Income", value: data.totalIncome, color: "#16a34a" },
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* ---------- Top Summary Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<Wallet className="w-8 h-8 text-purple-600" />}
          title="Total Balance"
          value={currency(data.totalBalance)}
        />
        <SummaryCard
          icon={<TrendingUp className="w-8 h-8 text-green-600" />}
          title="Total Income"
          value={currency(data.totalIncome)}
        />
        <SummaryCard
          icon={<TrendingDown className="w-8 h-8 text-red-600" />}
          title="Total Expense"
          value={currency(data.totalExpense)}
        />
      </div>

      {/* ---------- Bottom Section ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <RecentList
            title="Recent Income"
            data={data.recent5Income}
            positive
          />
          <RecentList
            title="Recent Expense"
            data={data.recent5Expense}
            positive={false}
          />
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center mt-4 text-xl font-bold">
            {currency(data.totalBalance)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function RecentList({ title, data, positive }) {
  const currency = (num) => `₹${num.toLocaleString("en-IN")}`;
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="text-purple-600 flex items-center gap-1 text-sm">
          More <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt="icon"
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Layers2 className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500 text-sm">{item.date}</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 font-semibold ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {positive ? "+" : "-"}
              {currency(item.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
