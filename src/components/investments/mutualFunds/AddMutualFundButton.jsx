import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddMutualFundButton({ fund }) {
  const navigate = useNavigate();

  const handleAdd = () => {
    /*
     * Selected holding ka complete data
     * form page ko pass kar rahe hain.
     */
    console.log(
      "Opening Add Mutual Fund Form with:",
      fund
    );

    navigate(
      "/mutual-funds/add",
      {
        state: {
          fund,
        },
      }
    );
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="
        flex
        shrink-0
        items-center
        gap-1.5
        rounded-xl
        bg-purple-600
        px-3
        py-2
        text-xs
        font-extrabold
        text-white
        shadow-lg
        shadow-purple-600/20
        transition
        hover:bg-purple-500
        active:scale-95
      "
    >
      <Plus size={16} />

      Add
    </button>
  );
}

export default AddMutualFundButton;