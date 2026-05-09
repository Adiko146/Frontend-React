import { useEffect, useState } from "react";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("logs")) || [];
    setLogs(data);
  }, []);

  // pagination
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = logs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  // reset
  const handleReset = () => {
    localStorage.removeItem("logs");
    setLogs([]);
    setCurrentPage(1);
  };

  return (
    <div>
    
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "10px"
    }}>
    <h2>Activity Log</h2>
        <button onClick={handleReset}>Reset Log</button>
    </div>

      {/* TABLE */}
      <table border="1" cellPadding="10" style={{ width: "100%", background: "white" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.length > 0 ? (
            currentLogs.map((log, index) => {
              const [date, action] = log.split(" - ");
              return (
                <tr key={index}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{date}</td>
                  <td>{action}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No logs
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span>
          {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;