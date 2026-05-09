export const exportToCSV = (data, filename = "data.csv") => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj =>
    Object.values(obj).join(",")
  );

  const csv = [headers, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};