import React from "react";
import clsx from "clsx";

/**
 * Skeleton Component
 * Loading placeholders for various content types
 */
const Skeleton = ({
  variant = "text",
  width,
  height,
  count = 1,
  circle = false,
  className = "",
}) => {
  const baseStyles = "animate-pulse bg-gray-200 rounded";

  const variants = {
    text: "h-4 rounded",
    title: "h-6 rounded",
    avatar: "rounded-full",
    button: "h-10 rounded-xl",
    card: "h-32 rounded-xl",
    input: "h-12 rounded-xl",
  };

  const renderSkeleton = () => (
    <div
      className={clsx(
        baseStyles,
        circle ? "rounded-full" : variants[variant],
        className,
      )}
      style={{
        width: width || (circle ? height : "100%"),
        height: height || undefined,
      }}
    />
  );

  if (count === 1) return renderSkeleton();

  return (
    <div className="space-y-2">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseStyles,
              circle ? "rounded-full" : variants[variant],
              className,
            )}
            style={{
              width: width || (circle ? height : `${100 - index * 10}%`),
              height: height || undefined,
            }}
          />
        ))}
    </div>
  );
};

/**
 * Skeleton Components for specific use cases
 */
export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={clsx("space-y-2", className)}>
    {Array(lines)
      .fill(0)
      .map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
  </div>
);

export const SkeletonCard = ({ className = "" }) => (
  <div
    className={clsx(
      "bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100",
      className,
    )}
  >
    <div className="flex items-start justify-between mb-4">
      <Skeleton variant="avatar" width={48} height={48} />
      <Skeleton variant="text" width={60} />
    </div>
    <Skeleton variant="title" className="mb-2" width="40%" />
    <Skeleton variant="text" width="60%" />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = "" }) => (
  <div className={clsx("bg-white rounded-xl overflow-hidden", className)}>
    {/* Header */}
    <div
      className="grid gap-4 p-4 bg-gray-50 border-b"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array(columns)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} variant="text" height={16} />
        ))}
    </div>
    {/* Rows */}
    {Array(rows)
      .fill(0)
      .map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-4 border-b border-gray-100"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array(columns)
            .fill(0)
            .map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" height={16} />
            ))}
        </div>
      ))}
  </div>
);

export const SkeletonList = ({ items = 3, className = "" }) => (
  <div className={clsx("space-y-3", className)}>
    {Array(items)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <Skeleton variant="avatar" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="70%" className="mb-1" />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
        </div>
      ))}
  </div>
);

export default Skeleton;
