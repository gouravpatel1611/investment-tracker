
import { useNavigate } from "react-router-dom";
import BondForm from "../../components/investments/bonds/BondForm";

export default function AddBond() {
  const navigate = useNavigate();

  const handleSubmit = async (bondData) => {
    try {
      console.log("Bond data received:", bondData);

      /*
        Firebase save yahan baad me add karenge.

        Example:

        await addBondTransaction(bondData);

        Save hone ke baad:
        navigate("/portfolio/bonds");
      */

      // Abhi testing ke liye
      alert("Bond data ready to save!");

      console.log(
        "Final Bond Data:",
        JSON.stringify(bondData, null, 2)
      );

      // Filhaal list page par nahi bhej rahe.
      // Firebase connect hone ke baad uncomment karenge.

      // navigate("/portfolio/bonds");
    } catch (error) {
      console.error("Error saving bond:", error);
    }
  };

  const handleCancel = () => {
    navigate("/portfolio/bonds");
  };

  return (
    <div className="min-h-full w-full bg-slate-950 px-3 py-5 sm:px-5 lg:px-6">
      <BondForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

