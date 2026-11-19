import { useState } from "react";
import { COUNTIES, TYPES, saveListings } from "../data.js";

const UNITS = ["kg", "bunch", "bird", "tray (30 eggs)", "crate", "sack", "piece"];

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("The selected file is not a valid image."));
      image.onload = () => {
        const scale = Math.min(1, 640 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Image preview is unavailable in this browser."));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ listings, setListings, notify, onComplete }) {
  const [form, setForm] = useState({ type: "0", seller: "", phone: "", county: COUNTIES[0], quantity: "", price: "", unit: UNITS[0], note: "" });
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      setImage(await resizeImage(file));
    } catch (uploadError) {
      console.error("Could not process the selected photo:", uploadError);
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    const price = Number(form.price);
    if (!form.seller.trim() || form.phone.replace(/\D/g, "").length < 9 || !Number.isFinite(price) || price <= 0) {
      setError("Add your name, a valid phone number and a price greater than zero.");
      return;
    }
    const [type, emoji, category] = TYPES[Number(form.type)];
    const listing = {
      id: Date.now(),
      type, emoji, category, county: form.county, seller: form.seller.trim(),
      phone: form.phone.trim(), price, unit: form.unit,
      quantity: form.quantity.trim() || "Ask seller",
      note: form.note.trim() || "Fresh from the farm.",
      reviews: [], image, createdAt: Date.now(),
    };
    const updated = [listing, ...listings];
    try {
      saveListings(updated);
      setListings(updated);
      notify("Published. Buyers can now see your listing.");
      onComplete();
    } catch (saveError) {
      console.error("Could not save the listing:", saveError);
      setError("The listing could not be saved. Check your browser storage and try again.");
    }
  }

  return (
    <form className="listing-form" onSubmit={submit}>
      <h1>List your product</h1>
      <label htmlFor="product-type">What are you selling?</label>
      <select id="product-type" value={form.type} onChange={(event) => update("type", event.target.value)}>
        {TYPES.map(([name, emoji, category], index) => <option value={index} key={name}>{emoji} {name} ({category})</option>)}
      </select>
      <div className="form-row">
        <div><label htmlFor="seller-name">Your name or farm</label><input id="seller-name" placeholder="e.g. Wanjiru Greens" value={form.seller} onChange={(event) => update("seller", event.target.value)} /></div>
        <div><label htmlFor="seller-phone">Phone (M-Pesa number)</label><input id="seller-phone" inputMode="tel" placeholder="0712 345 678" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></div>
      </div>
      <div className="form-row">
        <div><label htmlFor="county">County</label><select id="county" value={form.county} onChange={(event) => update("county", event.target.value)}>{COUNTIES.map((county) => <option key={county}>{county}</option>)}</select></div>
        <div><label htmlFor="quantity">Quantity available</label><input id="quantity" placeholder="e.g. 200 kg or 50 birds" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} /></div>
      </div>
      <div className="form-row">
        <div><label htmlFor="price">Price (KSh)</label><input id="price" type="number" min="1" inputMode="numeric" value={form.price} onChange={(event) => update("price", event.target.value)} /></div>
        <div><label htmlFor="unit">Per</label><select id="unit" value={form.unit} onChange={(event) => update("unit", event.target.value)}>{UNITS.map((unit) => <option key={unit}>{unit}</option>)}</select></div>
      </div>
      <label className="photo-upload" htmlFor="photo">📷 Tap to take or choose a photo<input id="photo" type="file" accept="image/*" onChange={onImageChange} />{image && <img src={image} alt="Product preview" />}</label>
      <label htmlFor="note">Short note (optional)</label>
      <textarea id="note" rows="3" placeholder="Harvested this morning, free-range, organic…" value={form.note} onChange={(event) => update("note", event.target.value)} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><button className="btn" type="submit" disabled={busy}>{busy ? "Preparing photo…" : "Publish listing"}</button></div>
    </form>
  );
}
