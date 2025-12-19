import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import { toast, ToastContainer } from "react-toastify";
import IncomeList from "../components/IncomeList";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all incomes
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
      if (response.status === 200) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching incomes:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch income details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for income
  const fetchCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      const data = response.data;
      const incomeCategories = data.filter(
        (cat) => cat.type === "income" || cat.type === "incomes"
      );
      setCategories(incomeCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    fetchCategories();
  }, []);

  return (
    <Dashboard activeMenu="Income">
      <div className="my-5 mx-auto px-4">
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="grid grid-cols-1 gap-6">
          <IncomeList
            incomes={incomeData}
            setIncomes={setIncomeData} // <-- pass setIncomes for add/delete
            categories={categories} // <-- pass categories for modal
          />
        </div>
      </div>
    </Dashboard>
  );
};

export default Income;
