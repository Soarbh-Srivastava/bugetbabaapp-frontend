import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import { toast, ToastContainer } from "react-toastify";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart"; // import chart

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get("/expenses");
      if (response.status === 200) setExpenseData(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      if (location.pathname === "/expense") {
        toast.error(
          error.response?.data?.message || "Failed to fetch expenses"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      const expenseCategories = response.data.filter(
        (cat) => cat.type === "expense" || cat.type === "expenses"
      );
      setCategories(expenseCategories);

      if (expenseCategories.length === 0 && location.pathname === "/expense") {
        toast.warning("No expense categories found");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (location.pathname === "/expense") {
        toast.error(
          error.response?.data?.message || "Failed to fetch categories"
        );
      }
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchCategories();
  }, [location.pathname]);

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto px-4">
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="grid grid-cols-1 gap-6">
          <ExpenseList
            expenses={expenseData}
            setExpenses={setExpenseData}
            categories={categories}
          />
          {/* Chart added here */}
        </div>
      </div>
    </Dashboard>
  );
};

export default Expense;
