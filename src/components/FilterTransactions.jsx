import React, { useState } from "react";
import * as Icons from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../util/axiosConfig";

export default function FilterTransactions() {
  const [filters, setFilters] = useState({
    type: "income",
    startDate: "",
    endDate: "",
    sortField: "date",
    sortOrder: "asc",
    keyword: "",
    icon: null,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const res = await api.post("/filter", {
        ...filters,
      });
      setTransactions(res.data);
      toast.success("Transactions loaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    if (!iconName) return null;
    const IconComp = Icons[iconName];
    return IconComp ? <IconComp className="w-6 h-6" /> : null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* -------- Filters -------- */}
      <div className="rounded-2xl shadow-md bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Transactions</h2>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />

          <select
            name="sortField"
            value={filters.sortField}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="name">Name</option>
          </select>

          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <input
            type="text"
            name="keyword"
            placeholder="Search..."
            value={filters.keyword}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={applyFilters}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Apply"}
          </button>
        </div>
      </div>

      {/* -------- Transactions Grid -------- */}
      <div>
        {transactions.length === 0 && !loading && (
          <p className="text-gray-600">
            Select the filters and click apply to filter the transactions.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 shadow-md p-4 rounded-lg mb-6 bg-white">
          {transactions.map((t) => {
            // ✅ Correct way to render emoji URL icon
            //    Ensure t.icon is a full URL like:
            //    "https://twemoji.maxcdn.com/v/14.0.2/72x72/1f9f0.png"
            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                    {t.icon == null ? (
                      <Icons.Layers2 className="w-6 h-6" />
                    ) : (
                      <img
                        src={t.icon}
                        alt="icon"
                        className="w-6 h-6 object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.date}</p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 text-lg font-semibold p-1 rounded ${
                    filters.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {filters.type === "income" ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={
                      filters.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {t.amount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
