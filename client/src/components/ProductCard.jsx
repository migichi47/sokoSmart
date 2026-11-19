import { CATEGORY_BACKGROUNDS, averageRating } from "../data.js";
import Stars from "./Stars.jsx";

export default function ProductCard({ listing, onSelect }) {
  const rating = averageRating(listing);
  return (
    <button className="product-card" type="button" onClick={() => onSelect(listing)}>
      <div className="art" style={{ background: CATEGORY_BACKGROUNDS[listing.category] }}>
        {listing.image ? <img src={listing.image} alt={listing.type} /> : <span className="emoji">{listing.emoji}</span>}
        <span className="fresh">Fresh listing</span>
      </div>
      <div className="card-content">
        <h3>{listing.type}</h3>
        <div className="price">KSh {listing.price} <small>per {listing.unit}</small></div>
        {listing.reviews.length
          ? <div><Stars value={rating} /> <span className="meta">{rating.toFixed(1)} ({listing.reviews.length})</span></div>
          : <span className="meta">No ratings yet</span>}
        <div className="meta">{listing.seller}, {listing.county}</div>
      </div>
    </button>
  );
}
