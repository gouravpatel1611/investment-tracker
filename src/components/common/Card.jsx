function Card({
  children,
  className = "",
}) {
  return (
    <div className={`surface ${className}`}>
      {children}
    </div>
  );
}

export default Card;