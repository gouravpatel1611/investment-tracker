import PortfolioCard from "./PortfolioCard";

function PortfolioList({
  items = [],
}) {
  return (
    <div className="grid gap-3">

      {items.map((item) => (
        <PortfolioCard
          key={item.symbol}
          {...item}
        />
      ))}

    </div>
  );
}

export default PortfolioList;