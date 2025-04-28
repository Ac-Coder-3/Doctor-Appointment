const showToast = (message, type = "success") => {
  let bgColor;

  if (type === "success") bgColor = "#10b981";
  else if (type === "error") bgColor = "#ef4444";
  else if (type === "warning") bgColor = "#f59e0b";

  Toastify({
    text: message,
    duration: 1200,
    newWindow: true,
    stopOnFocus: true,
    gravity: "top",
    position: "center",
    backgroundColor: bgColor,
    style: {
      padding: "8px",
      borderRadius: "8px",
      color: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: "0.9rem",
      textTransform: "capitalize",
    },
  }).showToast();
};

export default showToast;
