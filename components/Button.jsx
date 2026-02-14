export default function Button({ children, variant = "primary" }) {
  const styles = {
    primary: "bg-blue-600 text-white",
    secondary: "border border-slate-300 text-slate-700",
  };

  return (
    <button
      className={`px-6 py-3 rounded-lg text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
