
import { useState, useEffect } from "react";
import { useFilterProducts } from "../hooks/useFilterProducts";
import { useNotification } from "../context/NotificationContext";
import { logAction } from "../utils/logAction";
import { exportToCSV } from "../utils/exportCSV";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState(() => {
    const data = localStorage.getItem("products");
    return data
      ? JSON.parse(data)
      : [
          { id: 1, name: "Phone", category: "Electronics", price: 500, stock: 10, description: "Smartphone" },
          { id: 2, name: "Laptop", category: "Electronics", price: 1000, stock: 5, description: "Gaming laptop" },
          { id: 3, name: "Table", category: "Furniture", price: 200, stock: 8, description: "Wood table" },
          { id: 4, name: "Chair", category: "Furniture", price: 100, stock: 15, description: "Office chair" },
          { id: 5, name: "Monitor", category: "Electronics", price: 300, stock: 7, description: "24 inch monitor" }
        ];
  });

  const generateId = (items) => {
  const ids = items.map(i => i.id).sort((a, b) => a - b);

  for (let i = 1; i <= ids.length; i++) {
    if (ids[i - 1] !== i) return i;
  }

  return ids.length + 1;
  };

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const { showNotification } = useNotification();
  const { role } = useAuth();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    stock: ""
  });

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: ""
  });

  
  const [editingId, setEditingId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FILTER + SEARCH
  const filteredProducts = useFilterProducts(products, filters).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // reset page on filter/search
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search]);

  // SORT
  const sortByName = () => {
    setProducts([...products].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const sortByPrice = () => {
    setProducts([...products].sort((a, b) => a.price - b.price));
  };

  // FILTER CHANGE
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

const resetFilters = () => {
  setFilters({
    category: "",
    minPrice: "",
    maxPrice: "",
    stock: ""
  });

  setSearch("");
  setCurrentPage(1);

  console.log("RESET", {
    category: "",
    minPrice: "",
    maxPrice: "",
    stock: ""
  });
};

  // FORM INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: ""
    });
    setEditingId(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
    setIsFormModalOpen(true);
  };

  // SUBMIT
  
 const handleSubmit = () => {
  const isEdit = editingId !== null;

  const formattedForm = {
    ...form,
    price: Number(form.price),
    stock: Number(form.stock)
  };

  if (isEdit) {
    const oldProduct = products.find(p => p.id === editingId);

    const isChanged = JSON.stringify(oldProduct) !== JSON.stringify({
      ...oldProduct,
      ...formattedForm
    });

    const updated = products.map(p =>
      p.id === editingId ? { ...p, ...formattedForm } : p
    );
    setProducts(updated);

    if (isChanged) {
      showNotification("Product updated");
      logAction(`Updated product: ${formattedForm.name}`);
    } else {
      showNotification("No changes made");
    }

  } else {
    const newProduct = {
      id: generateId(products),
      ...form
    };

    setProducts([...products, newProduct]);

    showNotification("Product added");
    logAction(`Added product: ${formattedForm.name}`);
  }

  setIsFormModalOpen(false);
  setEditingId(null);
};

  // DELETE
  const handleDelete = (id) => {
  const product = products.find(p => p.id === id);

  setProducts(products.filter(p => p.id !== id));

  showNotification("Product deleted");
  logAction(`Deleted product: ${product?.name || "Unknown"}`);
};

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (role !== "admin") {
    showNotification("No access");
    return;
    }
    handleDelete(selectedId);
    setIsDeleteModalOpen(false);
  };

  // PAGINATION
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <h1>Products</h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => exportToCSV(products)}>
      Export CSV
      </button>

      {/* FILTERS */}
      <div style={filterContainer}>
        <select name="category" style={inputStyle} value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
        </select>

        <input style={inputStyle} name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} />
        <input style={inputStyle} name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />
        <input style={inputStyle} name="stock" placeholder="Min Stock" value={filters.stock} onChange={handleFilterChange} />

        <button style={buttonStyle} onClick={resetFilters}>Reset Filters</button>
      </div>

      <button onClick={sortByName}>Sort by Name</button>
      <button onClick={sortByPrice}>Sort by Price</button>
      {role === "admin" && (
      <button onClick={openAddModal}>+ Add Product</button>
      )}
      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  {role === "admin" && (
                  <button onClick={() => openDeleteModal(p.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <p>Are you sure you want to delete?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {isFormModalOpen && (
  <div style={modalOverlay}>
    <div style={modalBox}>
      <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <select
        name="category"
        style={inputStyle}
        value={form.category}
        onChange={handleChange}
      >
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Clothing">Clothing</option>
        <option value="Food">Food</option>
      </select>

      <input
        name="stock"
        placeholder="Stock (quantity)"
        value={form.stock}
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price ($)"
        value={form.price}
        onChange={handleChange}
      />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <button style={buttonStyle} onClick={handleSubmit}>
        {editingId ? "Save" : "Add"}
      </button>

      <button
        style={{ ...buttonStyle, background: "#868e96" }}
        onClick={() => setIsFormModalOpen(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
  );
}

// STYLES
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "300px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const filterContainer = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
  flexWrap: "wrap"
};

const inputStyle = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#3b5bdb",
  color: "white",
  cursor: "pointer"
};
