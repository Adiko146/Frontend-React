import { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { logAction } from "../utils/logAction";
import { useAuth } from "../context/AuthContext";

export default function Employees() {
    const [employees, setEmployees] = useState(() => {
    const data = localStorage.getItem("employees");
    return data ? JSON.parse(data) : [];});

  const { role } = useAuth();
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    status: "Active"
  });

  const [editingId, setEditingId] = useState(null);
  const { showNotification } = useNotification();

  // MODALS
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const data = localStorage.getItem("employees");
    if (data) setEmployees(JSON.parse(data));
  }, []);

  // SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  // SEARCH
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  // INPUT
  const handleChange = (e) => {
    if (role !== "admin") return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // OPEN ADD
  const openAddModal = () => {
    setForm({
      name: "",
      position: "",
      department: "",
      email: "",
      status: "Active"
    });
    setEditingId(null);
    setIsFormModalOpen(true);
  };

  // EDIT
  const handleEdit = (emp) => {
    if (role !== "admin") return;
    setForm(emp);
    setEditingId(emp.id);
    setIsFormModalOpen(true);
  };

  // SUBMIT
  const handleSubmit = () => {
  if (role !== "admin") return;
  const isEdit = editingId !== null;

  if (isEdit) {
    const oldEmployee = employees.find(e => e.id === editingId);

    const isChanged = JSON.stringify(oldEmployee) !== JSON.stringify({
      ...oldEmployee,
      ...form
    });

    const updated = employees.map(e =>
      e.id === editingId ? { ...e, ...form } : e
    );
    setEmployees(updated);

    if (isChanged) {
      showNotification("Employee updated");
      logAction(`Updated employee: ${form.name}`);
    } else {
      showNotification("No changes made");
    }

  } else {
    const newEmployee = {
      id: employees.length > 0
        ? Math.max(...employees.map(e => e.id)) + 1
        : 1,
      ...form
    };

    setEmployees([...employees, newEmployee]);

    showNotification("Employee added");
    logAction(`Added employee: ${form.name}`);
  }

  setIsFormModalOpen(false);
  setEditingId(null);
};

  // DELETE
  const handleDelete = (id) => {
  if (role !== "admin") return;

  const employee = employees.find(e => e.id === id);

  setEmployees(employees.filter(e => e.id !== id));

  showNotification("Employee deleted");
  logAction(`Deleted employee: ${employee?.name || "Unknown"}`);
};

  const openDeleteModal = (id) => {
  setDeletingId(id);
  setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
  const employee = employees.find(e => e.id === deletingId);

  setEmployees(employees.filter(e => e.id !== deletingId));

  showNotification("Employee deleted");
  logAction(`Deleted employee: ${employee?.name || "Unknown"}`);

  setIsDeleteModalOpen(false);
  setDeletingId(null);
};

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div>
      <h1>Employees</h1>

      <input
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {role === "admin" && (
      <button onClick={openAddModal}>+ Add Employee</button>
      )}
      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.position}</td>
              <td>{e.department}</td>
              <td>{e.email}</td>
              <td>{e.status}</td>
              <td>
                {role === "admin" && (
                <button onClick={() => handleEdit(e)}>Edit</button>
                )}
                {role === "admin" && (
                <button onClick={() => openDeleteModal(e.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {isDeleteModalOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <p>Delete employee?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}

      {isFormModalOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>{editingId ? "Edit Employee" : "Add Employee"}</h3>

            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

            <select name="status" value={form.status} onChange={handleChange}>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <button onClick={handleSubmit}>
              {editingId ? "Save" : "Add"}
            </button>

            <button onClick={() => setIsFormModalOpen(false)}>Cancel</button>
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
  padding: "20px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};