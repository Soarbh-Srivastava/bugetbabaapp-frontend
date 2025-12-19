import { useState } from "react";
import { Download, Mail, Plus } from "lucide-react";
import TranscationInfoCard from "./TranscationInfoCard";
import Modal from "./Modal";
import EmojiPickerPopup from "./EmojiPickerPopup";
import moment from "moment";
import axiosConfig from "../util/axiosConfig";
import { toast } from "react-toastify";
import ExpenseChart from "./ExpenseChart";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExpenseList = ({ expenses = [], setExpenses, categories = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    icon: "",
    categoryId: "",
    date: "",
  });

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      await axiosConfig.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  // Add expense
  const handleAddExpense = async () => {
    if (
      !formData.name.trim() ||
      !formData.amount ||
      !formData.categoryId ||
      !formData.date
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    setLoading(true);
    const payload = {
      name: formData.name,
      amount: formData.amount,
      catergoryId: Number(formData.categoryId),
      icon: formData.icon || null,
      date: formData.date,
    };

    try {
      const response = await axiosConfig.post("/expenses", payload);
      setExpenses((prev) => [response.data, ...prev]);
      setFormData({ name: "", amount: "", icon: "", categoryId: "", date: "" });
      setIsModalOpen(false);
      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // Download Excel
  const handleDownloadExcel = () => {
    if (!expenses.length) {
      toast.warning("No expense data available to download");
      return;
    }

    const data = expenses.map((e) => ({
      Name: e.name,
      Amount: e.amount,
      Category: e.category?.name || "N/A",
      Date: moment(e.date).format("YYYY-MM-DD"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, `expenses_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
    toast.success("Expense Excel file downloaded");
  };

  // Send Email
  const handleSendEmail = async () => {
    if (!expenses.length) {
      toast.warning("No expense data to send");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      toast.error("User not found in localStorage");
      return;
    }

    const profileId = userData.id;
    const email = userData.email;

    setEmailLoading(true);
    try {
      const payload = { type: "expense", email, profileId };
      const response = await axiosConfig.post("reports/send", payload);
      toast.success(response.data.message || "Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="card p-4 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          className="group flex items-center gap-1 px-3 py-1 rounded bg-red-100 hover:bg-red-200"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={15} />
          <span>Add Expense</span>
        </button>

        <div className="flex items-center justify-end gap-2">
          <button
            className="group flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            onClick={handleSendEmail}
            disabled={emailLoading}
          >
            <Mail className="text-base group-hover:text-purple-800" size={15} />
            <span className="group-hover:text-purple-800">
              {emailLoading ? "Sending..." : "Email"}
            </span>
          </button>
          <button
            className="group flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            onClick={handleDownloadExcel}
          >
            <Download
              className="text-base group-hover:text-purple-800"
              size={15}
            />
            <span className="group-hover:text-purple-800">Download</span>
          </button>
        </div>
      </div>

      <ExpenseChart expenses={expenses} />

      {/* Expense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow-md p-4 rounded-lg mb-6">
        {expenses.length > 0 ? (
          expenses.map((i) => (
            <TranscationInfoCard
              key={i.id}
              title={i.name}
              icon={i.icon || i.category?.icon}
              date={moment(i.date).format("Do MMM YYYY")}
              amount={i.amount}
              type="expense"
              onDelete={() => handleDelete(i.id)}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No expense records found
          </p>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
      >
        <div className="flex flex-col gap-3">
          <EmojiPickerPopup
            icon={formData.icon}
            onSelect={(url) => setFormData({ ...formData, icon: url })}
          />

          <input
            type="text"
            placeholder="Expense Name"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          <input
            type="date"
            placeholder="Select Date"
            className="border p-2 rounded"
            value={formData.date}
            max={moment().format("YYYY-MM-DD")}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddExpense}
              disabled={loading}
              className={`px-3 py-1 rounded text-white ${
                loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExpenseList;
