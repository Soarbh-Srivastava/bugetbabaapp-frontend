import { useEffect, useState } from "react";
import CategoryList from "../components/CategoryList";
import Dashboard from "../components/Dashboard";
import { Plus } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // 🔑 for update

  const fetchCategoryDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (response.status === 200) {
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  // ✅ Add new category
  const handleAddCategory = async (category) => {
    try {
      const response = await axiosConfig.post(
        API_ENDPOINTS.ADD_CATEGORY,
        category
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Category added successfully");
        setOpenCategoryModal(false);
        fetchCategoryDetails();
      }
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  // ✅ Update existing category
  const handleUpdateCategory = async (categoryId, updatedCategory) => {
    try {
      const response = await axiosConfig.put(
        API_ENDPOINTS.UPDATE_CATEGORY(categoryId), // call with ID
        updatedCategory
      );

      if (response.status === 200) {
        toast.success("Category updated successfully");
        setOpenCategoryModal(false);
        setSelectedCategory(null); // reset
        fetchCategoryDetails();
      }
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  // ✅ Decide add vs update
  const handleSubmit = (category) => {
    if (selectedCategory) {
      handleUpdateCategory(selectedCategory.id, category);
    } else {
      handleAddCategory(category);
    }
  };

  return (
    <Dashboard activeMenu="Category">
      <div className="my-5 mx-auto px-4 w-full">
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <div className="grid grid-cols-2 items-center mb-5 w-full gap-4">
          <h2 className="text-2xl font-semibold">All Categories</h2>
          <div className="justify-self-end">
            <button
              onClick={() => {
                setSelectedCategory(null); // new category
                setOpenCategoryModal(true);
              }}
              className="add-btn flex items-center gap-1 bg-green-100/30 text-green-600 font-bold hover:bg-green-100/50 px-3 py-1 rounded"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Category List */}
        <CategoryList
          categories={categoryData}
          loading={loading}
          onEdit={(cat) => {
            setSelectedCategory(cat); // open modal with existing data
            setOpenCategoryModal(true);
          }}
        />

        {/* Add/Update Category Modal */}
        <Modal
          isOpen={openCategoryModal}
          onClose={() => {
            setOpenCategoryModal(false);
            setSelectedCategory(null);
          }}
          title={selectedCategory ? "Update Category" : "Add Category"}
        >
          <AddCategoryForm
            initialData={selectedCategory} // pass data if editing
            onAddCategory={handleSubmit}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Category;
