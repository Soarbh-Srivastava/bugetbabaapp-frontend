// src/components/InputForm.jsx
const InputForm = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  className = "",
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77868d] focus:border-[#77868d] text-gray-900 placeholder-gray-400 ${className}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default InputForm;
