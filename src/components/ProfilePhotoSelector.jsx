import { useRef, useState } from "react";
import { User, Plus, Trash2 } from "lucide-react"; // added Trash2

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewURL, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSelectClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div
        className="relative w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border shadow"
        onClick={handleSelectClick}
      >
        {previewURL ? (
          <img
            src={previewURL}
            alt="Profile Preview"
            className="w-28 h-28 rounded-full object-cover"
          />
        ) : (
          <User className="w-12 h-12 text-gray-500" />
        )}

        {/* + Icon overlay */}
        <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1 shadow">
          <Plus className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Trash icon instead of text */}
      {previewURL && (
        <button
          type="button"
          onClick={handleRemove}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
