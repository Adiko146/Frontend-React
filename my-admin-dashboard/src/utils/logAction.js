export const logAction = (text) => {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.unshift(`${new Date().toLocaleString()} - ${text}`);
  localStorage.setItem("logs", JSON.stringify(logs));
};