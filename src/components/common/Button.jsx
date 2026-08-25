function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800",

    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",

    ghost:
      "text-slate-600 hover:bg-slate-100",
  };

  return (
    <button
      className={`rounded-xl px-4 py-3 text-sm font-bold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;