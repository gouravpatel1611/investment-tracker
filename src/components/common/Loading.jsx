function Loading({
  label = "Loading...",
}) {
  return (
    <div className="flex min-h-32 items-center justify-center text-sm font-semibold text-slate-500">
      {label}
    </div>
  );
}

export default Loading;