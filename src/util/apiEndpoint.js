export const BASE_URL = "https://budgetbaba-api.onrender.com/api/v1.0";
export const CLOUDINARY_CLOUD_NAME = "dcadhcqkx";

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",

  // Categories
  GET_ALL_CATEGORIES: "/categories",
  ADD_CATEGORY: "/categories",
  UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,

  // Incomes
  GET_ALL_INCOMES: "/incomes",
  ADD_INCOME: "/incomes",
  DELETE_INCOME: (id) => `/incomes/${id}`,

  // Expenses
  GET_ALL_EXPENSES: "/expenses",
  ADD_EXPENSE: "/expenses",
  DELETE_EXPENSE: (id) => `/expenses/${id}`,

  // Cloudinary
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};
