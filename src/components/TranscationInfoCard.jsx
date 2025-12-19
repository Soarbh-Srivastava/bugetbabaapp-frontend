import {
  Trash2,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

const addThousandsSeparator = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const TranscationInfoCard = ({
  icon,
  title,
  date,
  amount,
  type,
  onDelete,
  hideDeleteBtn = false,
}) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60 cursor-pointer transition-colors duration-200">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <UtensilsCrossed className="text-purple-500" />
        )}
      </div>

      {/* Title & Date */}
      <div>
        <h6 className="font-semibold">{title}</h6>
        {date && <p className="text-sm text-gray-500">{date}</p>}
      </div>

      {/* Amount & Delete */}
      <div className="flex items-center gap-2 ml-auto">
        {!hideDeleteBtn && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering card click
              onDelete(); // logs id from parent
            }}
            className="text-gray-400 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        )}

        {amount && (
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="text-xs font-medium">
              {type === "income" ? "+" : "-"} ${addThousandsSeparator(amount)}
            </h6>
            {type === "income" ? (
              <TrendingUp size={15} />
            ) : (
              <TrendingDown size={15} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscationInfoCard;
