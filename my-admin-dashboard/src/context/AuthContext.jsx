import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 👉 Берём роль из localStorage или ставим admin по умолчанию
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "admin";
  });

  // 👉 Сохраняем роль при изменении
  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👉 Хук для использования
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};