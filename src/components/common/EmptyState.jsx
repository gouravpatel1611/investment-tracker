function EmptyState({
  title = "Nothing here yet",
  description = "Your data will appear here.",
}) {
  return (
    <div className="surface p-8 text-center">

      <p className="font-bold">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default EmptyState;