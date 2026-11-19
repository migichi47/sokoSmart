import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="nav">
      <Link className="logo" to="/">🌱 SokoSmart</Link>
      <Link className="btn ghost" to="/sell">Sell your produce</Link>
    </nav>
  );
}
