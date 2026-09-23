function VortaxaMetric({
  label,
  value,
  valueClass = "text-slate-200",
}) {

  return (

    <div>

      <p
        className="
          text-[10px]
          font-medium
          text-slate-500
        "
      >
        {label}
      </p>


      <p
        className={`
          mt-0.5
          truncate
          text-xs
          font-bold
          ${valueClass}
        `}
      >
        {value}
      </p>

    </div>

  );

}


export default VortaxaMetric;