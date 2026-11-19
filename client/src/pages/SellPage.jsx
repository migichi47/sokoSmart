import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";

export default function SellPage({ listings, setListings, notify }) {
  const navigate = useNavigate();
  return (
    <section className="sell-page">
      <ProductForm
        listings={listings}
        setListings={setListings}
        notify={notify}
        onComplete={() => {
          navigate("/#market");
        }}
      />
    </section>
  );
}
