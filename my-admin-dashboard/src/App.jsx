import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Employees from "./pages/Employees";
import ActivityLog from "./pages/ActivityLog";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main fade">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/activity" element={<ActivityLog />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;