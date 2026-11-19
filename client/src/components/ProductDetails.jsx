import { useState } from "react";
import { CATEGORY_BACKGROUNDS, averageRating, saveListings } from "../data.js";
import Stars from "./Stars.jsx";

export default function ProductDetails({ listing, listings, setListings, onClose, notify }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const score = averageRating(listing);
  const phone = listing.phone.replace(/\D/g, "").replace(/^0/, "254");

  function submitReview(event) {
    event.preventDefault();
    if (!rating) {
      notify("Tap a star to choose your rating.");
      return;
    }
    const updated = listings.map((item) => item.id === listing.id
      ? { ...item, reviews: [...item.reviews, { name: name.trim().slice(0, 40) || "Buyer", score: rating, comment: comment.trim().slice(0, 300) || "No comment." }] }
      : item);
    try {
      saveListings(updated);
      setListings(updated);
      notify("Rating submitted. Thank you!");
      setRating(0);
      setName("");
      setComment("");
    } catch (error) {
      console.error("Could not save your rating:", error);
      notify("Your rating could not be saved in this browser.");
    }
  }

  return (
    <div className="modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sheet details" role="dialog" aria-modal="true" aria-labelledby="product-title">
        <div className="art detail-art" style={{ background: CATEGORY_BACKGROUNDS[listing.category] }}>
          {listing.image ? <img src={listing.image} alt={listing.type} /> : <span className="emoji">{listing.emoji}</span>}
        </div>
        <div className="sheet-content">
          <button className="close-button" type="button" onClick={onClose} aria-label="Close details">×</button>
          <h2 id="product-title">{listing.type}</h2>
          <div className="price">KSh {listing.price} <small>per {listing.unit}</small></div>
          <p>{listing.note}</p>
          <p className="meta">Seller: <b>{listing.seller}</b> in {listing.county} County<br />Available: {listing.quantity}</p>
          <p>{listing.reviews.length ? <><Stars value={score} /> {score.toFixed(1)} from {listing.reviews.length} buyer{listing.reviews.length === 1 ? "" : "s"}</> : "No ratings yet"}</p>
          <p className="contact-links">
            <a className="btn" href={`tel:+${phone}`}>Call seller</a>
            <a className="btn alt" href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I saw your ${listing.type} on ShambaSoko.`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </p>
          <h3>Rate this seller</h3>
          <form onSubmit={submitReview}>
            <div className="rate" aria-label="Choose a rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button className={`star${rating >= value ? " on" : ""}`} type="button" key={value} aria-label={`${value} stars`} aria-pressed={rating === value} onClick={() => setRating(value)}>★</button>
              ))}
            </div>
            <input className="review-input" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
            <textarea rows="2" placeholder="How was the produce and delivery?" value={comment} onChange={(event) => setComment(event.target.value)} />
            <p><button className="btn" type="submit">Submit rating</button></p>
          </form>
          <h3>Buyer reviews</h3>
          {listing.reviews.length
            ? [...listing.reviews].reverse().map((review, index) => (
              <div className="review" key={`${review.name}-${index}`}><Stars value={review.score} /> <b>{review.name}</b><br />{review.comment}</div>
            ))
            : <p className="meta">Be the first to rate this seller.</p>}
        </div>
      </section>
    </div>
  );
}
