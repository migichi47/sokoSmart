import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import ProductDetails from "../components/ProductDetails.jsx";
import { CATEGORIES, COUNTIES, averageRating } from "../data.js";

function Hero() {
  return (
    <section className="hero" id="top">
      <div>
        <h1>From the shamba straight to the buyer, across Kenya.</h1>
        <p>Farmers in all 47 counties list vegetables, poultry, eggs and more. Buyers find fresh produce near them, call the farmer, and rate what they bought.</p>
        <div className="hero-actions"><Link className="btn alt" to="/sell">List a product in 2 minutes</Link><a className="btn ghost" href="#market">Browse the market</a></div>
      </div>
      <div className="crate" aria-hidden="true">{["🍅", "🥬", "🐔", "🥕", "🥚", "🥑", "🧅", "🥔", "🌽"].map((item, index) => <span key={index}>{item}</span>)}</div>
    </section>
  );
}

function SellerBenefits() {
  return (
    <section className="sell">
      <h2>Farmers: your buyers are waiting.</h2>
      <div className="benefit-grid">
        <div><b>Upload in minutes</b>Pick the product, add a photo, set your price.</div>
        <div><b>Sell nationwide</b>Buyers from Turkana to Mombasa can find you.</div>
        <div><b>Build trust</b>Good ratings bring repeat customers.</div>
      </div>
      <p><Link className="btn alt" to="/sell">Start selling</Link></p>
    </section>
  );
}

export default function HomePage({ listings, setListings, notify }) {
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("");
  const [sort, setSort] = useState("rating");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const visibleListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return listings.filter((item) =>
      (category === "All" || item.category === category)
      && (!county || item.county === county)
      && (!query || `${item.type} ${item.seller} ${item.county} ${item.note}`.toLowerCase().includes(query)),
    ).sort((first, second) => sort === "price"
      ? first.price - second.price
      : sort === "newest"
        ? second.createdAt - first.createdAt
        : averageRating(second) - averageRating(first));
  }, [listings, search, county, sort, category]);

  function resetFilters() {
    setSearch("");
    setCounty("");
    setSort("rating");
    setCategory("All");
  }

  return (
    <>
      <Hero />
      <section id="market" className="market">
        <div className="filter-bar">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tomatoes, kienyeji, eggs…" aria-label="Search products" />
          <select value={county} onChange={(event) => setCounty(event.target.value)} aria-label="County"><option value="">All counties</option>{COUNTIES.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort listings"><option value="rating">Top rated</option><option value="price">Lowest price</option><option value="newest">Newest</option></select>
          <button className="btn" type="button" onClick={resetFilters}>Reset</button>
        </div>
        <div className="chips" aria-label="Product categories">
          {CATEGORIES.map((item) => <button className="chip" type="button" aria-pressed={category === item} key={item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <p className="meta listing-count">{visibleListings.length} listing{visibleListings.length === 1 ? "" : "s"}{county ? ` in ${county}` : " across Kenya"}</p>
        {visibleListings.length
          ? <div className="product-grid">{visibleListings.map((item) => <ProductCard key={item.id} listing={item} onSelect={setSelected} />)}</div>
          : <p className="empty-state">No listings match yet. Try another county, or be the first to <Link to="/sell">list this product</Link>.</p>}
      </section>
      <SellerBenefits />
      <footer>ShambaSoko connects farmers and buyers directly. Agree on price, delivery and payment (M-Pesa or cash) with the seller. Listings and ratings are saved in this browser for this demo.</footer>
      {selected && <ProductDetails key={selected.id} listing={listings.find((item) => item.id === selected.id) || selected} listings={listings} setListings={setListings} onClose={() => setSelected(null)} notify={notify} />}
    </>
  );
}
