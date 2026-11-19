export default function Stars({ value }) {
  const rounded = Math.round(value);
  return (
    <span className="stars" aria-label={`${value.toFixed(1)} out of 5`}>
      {"★".repeat(rounded)}
      <span className="empty-stars">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}
