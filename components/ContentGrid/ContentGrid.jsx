import React from "react";

const ContentGrid = ({
  items,
  columns = { default: 1, md: 2, lg: 3 },
  renderItem,
  className = "",
}) => {
  const gridClasses = `grid gap-6 ${
    columns.default ? `grid-cols-${columns.default}` : "grid-cols-1"
  } ${columns.md ? `md:grid-cols-${columns.md}` : ""} ${
    columns.lg ? `lg:grid-cols-${columns.lg}` : ""
  }`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {items.map((item, index) => (
        <div key={item.id || index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
};

export default ContentGrid;
