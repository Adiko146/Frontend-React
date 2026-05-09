import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin</h2>

      <nav>
        <NavLink to="/" end>🏠 Dashboard</NavLink>
        <NavLink to="/products">📦 Products</NavLink>
        <NavLink to="/employees">👨‍💼 Employees</NavLink>
        <NavLink to="/activity">📜 Activity Log</NavLink>
      </nav>
    </div>
  );Ы
}