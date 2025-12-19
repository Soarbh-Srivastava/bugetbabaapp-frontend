import { useState } from "react";
import { Download, Mail, Plus } from "lucide-react";
import TranscationInfoCard from "./TranscationInfoCard";
import Modal from "./Modal";
import EmojiPickerPopup from "./EmojiPickerPopup";
import moment from "moment";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import { toast } from "react-toastify";
import IncomeOverview from "./IncomeOverview";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const IncomeList = ({ incomes = [], setIncomes, categories = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    icon: "",
    categoryId: "",
    date: moment().format("YYYY-MM-DD"),
  });
  const [emailLoading, setEmailLoading] = useState(false);

  // Delete income via API
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
      setIncomes((prev) => prev.filter((item) => item.id !== id));
      toast.success("Income deleted successfully");
    } catch (error) {
      console.error("Failed to delete income:", error);
      toast.error(error.response?.data?.message || "Failed to delete income");
    }
  };
  const handleSendEmail = async () => {
    if (!incomes.length) {
      toast.warning("No income data to send");
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
      const payload = {
        type: "income",
        email,
        profileId,
      };
      const response = await axiosConfig.post("/reports/send", payload);
      toast.success(response.data.message || "Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setEmailLoading(false);
    }
  };

  // Add new income via API
  const handleAddIncome = async () => {
    if (!formData.name.trim()) {
      toast.warning("Please enter income name");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }
    if (!formData.categoryId) {
      toast.warning("Please select a category");
      return;
    }
    if (!formData.date) {
      toast.warning("Please select a date");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        amount: formData.amount,
        catergoryId: Number(formData.categoryId),
        icon: formData.icon || null,
        date: formData.date,
      };

      const response = await axiosConfig.post(
        API_ENDPOINTS.ADD_INCOME,
        payload
      );
      setIncomes((prev) => [response.data, ...prev]);
      setFormData({
        name: "",
        amount: "",
        icon: "",
        categoryId: "",
        date: moment().format("YYYY-MM-DD"),
      });
      setIsModalOpen(false);
      toast.success("Income added successfully");
    } catch (error) {
      console.error("Failed to add income:", error);
      toast.error(error.response?.data?.message || "Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  // Download Excel
  const handleDownloadExcel = () => {
    if (!incomes.length) {
      toast.warning("No income data available to download");
      return;
    }

    const data = incomes.map((i) => ({
      Name: i.name,
      Amount: i.amount,
      Category: i.category?.name || "N/A",
      Date: moment(i.date).format("YYYY-MM-DD"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, `incomes_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
    toast.success("Income Excel file downloaded");
  };

  return (
    <div className="card p-4 rounded-lg ">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          className="group flex items-center gap-1 px-3 py-1 rounded bg-green-100 hover:bg-green-200"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={15} />
          <span>Add Income</span>
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

      <IncomeOverview incomes={incomes} />

      {/* Income Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow-md p-4 rounded-lg mb-6">
        {incomes.length > 0 ? (
          incomes.map((i) => (
            <TranscationInfoCard
              key={i.id}
              title={i.name}
              icon={i.icon || i.category?.icon}
              date={moment(i.date).format("Do MMM YYYY")}
              amount={i.amount}
              type="income"
              onDelete={() => handleDelete(i.id)}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No income records found</p>
        )}
      </div>

      {/* Add Income Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Income"
      >
        <div className="flex flex-col gap-3">
          <EmojiPickerPopup
            icon={formData.icon}
            onSelect={(url) => setFormData({ ...formData, icon: url })}
          />

          <input
            type="text"
            placeholder="Income Name"
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

          <input
            type="date"
            className="border p-2 rounded"
            value={formData.date}
            max={moment().format("YYYY-MM-DD")}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

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
              onClick={handleAddIncome}
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

export default IncomeList;
