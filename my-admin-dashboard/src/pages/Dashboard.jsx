import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

import { useAuth } from "../context/AuthContext";

const COLORS = [
  "#6366F1", // фиолетовый (primary)
  "#22C55E", // зеленый
  "#F59E0B", // оранжевый
  "#EF4444"  // красный
];

export default function Dashboard() {
  const { role, setRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);

useEffect(() => {
  const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];

  setProducts(storedProducts);
  setEmployees(storedEmployees);
}, []);

  // 🔥 Products by Category (reduce)
  const productsByCategory = Object.values(
    products.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || {
        name: product.category,
        value: 0
      };
      acc[product.category].value++;
      return acc;
    }, {})
  );

  // 🔥 Employees by Department (reduce)
  const employeesByDept = Object.values(
    employees.reduce((acc, emp) => {
      acc[emp.department] = acc[emp.department] || {
        name: emp.department,
        value: 0
      };
      acc[emp.department].value++;
      return acc;
    }, {})
  );

  // 🔥 Revenue
  const revenue = products.reduce(
    (sum, p) => sum + Number(p.price),
    0
  );

  return (
    <div style={container}>
      <h1>Dashboard</h1>
      <div style={roleContainer}>
  <span style={roleLabel}>Role:</span>

  <div style={roleSwitcher}>
    <button
  style={{
    ...roleButton,
    ...(role === "admin" ? activeRole : inactiveRole)
  }}
  onClick={() => setRole("admin")}
>
  Admin
</button>

    <button
  style={{
    ...roleButton,
    ...(role === "user" ? activeRole : inactiveRole)
  }}
  onClick={() => setRole("user")}
>
  User
</button>
  </div>
</div>
      {/* 📊 CARDS */}
      <div style={cardsContainer}>
        <Card title="Products" value={products.length} />
        <Card title="Employees" value={employees.length} />
        <Card title="Revenue" value={`$${revenue}`} />
      </div>

      {/* 📊 CHARTS */}
      <div style={chartsContainer}>
        
        {/* Pie Chart */}
        <div style={chartBox}>
          <h3 style={chartTitle}>Products by Category</h3>
          <PieChart width={450} height={320}>
            <Pie
              data={productsByCategory}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              innerRadius={60}
              paddingAngle={3}
              label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
            {productsByCategory.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
            ))}
            </Pie>
            <Tooltip
            formatter={(value, name) => [`${value} items`, name]}
            />
            </PieChart>
        </div>
        {/* Bar Chart */}
        <div style={chartBox}>
          <h3 style={chartTitle}>Employees by Department</h3>
          <BarChart width={400} height={300} data={employeesByDept}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
             <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>

      </div>
    </div>
  );
}

/* 🔹 Card компонент */
function Card({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p style={numberStyle}>{value}</p>
    </div>
  );
}

/* 🔹 Styles */
const cardsContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px"
};

const cardStyle = {
  background: "#f5f5f5",
  padding: "20px",
  borderRadius: "10px",
  width: "150px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  
};

const numberStyle = {
  fontSize: "24px",
  fontWeight: "bold"
};

const chartsContainer = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
  marginTop: "30px"
};

const chartBox = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center" // 🔥 центрирует
};

const chartTitle = {
  marginBottom: "10px"
};

const container = {
  background: "#f4f6f8",
  minHeight: "50vh",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px"
};

const roleContainer = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px"
};

const roleLabel = {
  fontWeight: "600",
  color: "#374151"
};

const roleSwitcher = {
  display: "flex",
  background: "#f3f4f6",
  borderRadius: "8px",
  padding: "4px"
};

const roleButton = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.2s"
};

const activeRole = {
  background: "#6366F1",
  color: "white"
};

const inactiveRole = {
  background: "#e5e7eb", // серый
  color: "#6b7280"       // тёмно-серый текст
};