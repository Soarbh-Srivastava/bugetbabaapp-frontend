import { useState } from "react";
import Picker from "emoji-picker-react";
import twemoji from "twemoji";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData) => {
    // Convert emoji character to Twemoji URL
    const parsed = twemoji.parse(emojiData.emoji);
    const match = parsed.match(/src="(.*?)"/);
    const url = match ? match[1] : null;

    if (url) {
      onSelect(url); // Send URL to parent
      setIsOpen(false); // close picker after selection
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 mb-4 relative">
      {/* Icon Display / Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
      >
        {/* If icon is a URL, show image; otherwise fallback */}
        {icon ? (
          <img src={icon} alt="emoji" className="w-6 h-6" />
        ) : (
          <span className="text-2xl">🎯</span>
        )}
        <span>{icon ? "Change Icon" : "Pick Icon"}</span>
      </button>

      {/* Emoji Picker Popup */}
      {isOpen && (
        <div className="absolute z-50 mt-2">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
