function SectionHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex items-end justify-between gap-4">

      <div>

        <h2 className="font-bold">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}

export default SectionHeader;