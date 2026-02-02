import React from "react";
import clsx from "clsx";

/**
 * Avatar Component
 * User avatar with image or fallback initials
 */
const Avatar = ({
  src,
  alt = "",
  name = "",
  size = "md",
  status,
  className = "",
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
    "2xl": "w-4 h-4",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Generate a consistent background color based on name
  const getColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-cyan-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={clsx("relative inline-flex", className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={clsx("rounded-full object-cover", sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            "rounded-full flex items-center justify-center font-semibold text-white",
            sizes[size],
            getColor(name),
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            statusSizes[size],
            statusColors[status],
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
