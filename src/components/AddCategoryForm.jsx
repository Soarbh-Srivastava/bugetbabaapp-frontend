import { useState, useEffect } from "react";
import Input from "./Input";
import EmojiPickerPopup from "./EmojiPickerPopup";

const AddCategoryForm = ({ initialData, onAddCategory }) => {
  const [category, setCategory] = useState({
    name: "",
    type: "income",
    icon: "",
  });

  useEffect(() => {
    if (initialData) {
      setCategory({
        name: initialData.name || "",
        type: initialData.type || "income",
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const categoryTypeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const handleChange = (key, value) => {
    setCategory({ ...category, [key]: value });
  };

  const handleSubmit = () => {
    if (!category.name.trim()) {
      alert("Please enter a category name");
      return;
    }
    onAddCategory(category); // parent decides add/update
  };

  return (
    <div className="p-4 space-y-4">
      <EmojiPickerPopup
        icon={category.icon}
        onSelect={(selectIcon) => handleChange("icon", selectIcon)}
      />

      {/* Category Name Input */}
      <Input
        value={category.name}
        onChange={(e) => handleChange("name", e.target.value)}
        label="Category Name"
        placeholder="e.g., Freelance, Salary, Bonus"
        type="text"
      />

      {/* Category Type Select */}
      <Input
        label="Category Type"
        value={category.type}
        onChange={(e) => handleChange("type", e.target.value)}
        isSelect={true}
        options={categoryTypeOptions}
      />

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="add-btn-fill bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {initialData ? "Update Category" : "Add Category"}
        </button>
      </div>
    </div>
  );
};

export default AddCategoryForm;
