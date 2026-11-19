import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import SellPage from "./pages/SellPage.jsx";
import { readListings } from "./data.js";

export default function App() {
  const [listings, setListings] = useState(readListings);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <div className="wrap">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage listings={listings} setListings={setListings} notify={setToast} />} />
        <Route path="/sell" element={<SellPage listings={listings} setListings={setListings} notify={setToast} />} />
        <Route path="*" element={<main className="not-found"><h1>Page not found</h1><Link className="btn" to="/">Back to marketplace</Link></main>} />
      </Routes>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
