/**
 * Section Skeleton Components
 * Reusable loading skeletons for landing page sections
 */
import React from "react";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";

// Base skeleton pulse animation
const SkeletonPulse = ({ className }) => {
  const { isDarkMode } = useThemeStore();
  return (
    <div
      className={cn(
        "animate-pulse rounded",
        isDarkMode ? "bg-slate-700" : "bg-gray-200",
        className,
      )}
    />
  );
};

// Card skeleton for news, events, scholarships
export const CardSkeleton = ({ count = 3, layout = "grid" }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        layout === "grid"
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4",
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "p-6 rounded-xl border",
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200",
          )}
        >
          {/* Icon */}
          <SkeletonPulse className="w-12 h-12 rounded-xl mb-4" />
          {/* Category badge */}
          <SkeletonPulse className="w-20 h-5 mb-3" />
          {/* Title */}
          <SkeletonPulse className="w-full h-6 mb-2" />
          {/* Description line 1 */}
          <SkeletonPulse className="w-full h-4 mb-2" />
          {/* Description line 2 */}
          <SkeletonPulse className="w-3/4 h-4 mb-4" />
          {/* Meta info */}
          <div className="flex gap-4">
            <SkeletonPulse className="w-24 h-4" />
            <SkeletonPulse className="w-16 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Stats/metrics skeleton
export const StatsSkeleton = ({ count = 4, inline = false }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        inline
          ? "flex flex-wrap justify-center gap-8"
          : "grid grid-cols-2 md:grid-cols-4 gap-4",
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "p-4 rounded-xl text-center",
            isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
          )}
        >
          {/* Icon */}
          <SkeletonPulse className="w-10 h-10 rounded-lg mx-auto mb-3" />
          {/* Value */}
          <SkeletonPulse className="w-16 h-8 mx-auto mb-2" />
          {/* Label */}
          <SkeletonPulse className="w-24 h-4 mx-auto" />
        </div>
      ))}
    </div>
  );
};

// Gallery image grid skeleton
export const GallerySkeleton = ({ count = 8 }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "aspect-square rounded-xl overflow-hidden",
            isDarkMode ? "bg-slate-800" : "bg-gray-100",
          )}
        >
          <SkeletonPulse className="w-full h-full" />
        </div>
      ))}
    </div>
  );
};

// List skeleton for sidebar lists, news lists
export const ListSkeleton = ({ count = 5 }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "flex items-center gap-4 p-3 rounded-lg",
            isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
          )}
        >
          {/* Icon/Avatar */}
          <SkeletonPulse className="w-10 h-10 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {/* Title */}
            <SkeletonPulse className="w-3/4 h-4 mb-2" />
            {/* Subtitle */}
            <SkeletonPulse className="w-1/2 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Faculty card skeleton
export const FacultyCardSkeleton = ({ count = 8 }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "p-6 rounded-xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-200",
          )}
        >
          {/* Icon */}
          <SkeletonPulse className="w-14 h-14 rounded-xl mb-4" />
          {/* Faculty name */}
          <SkeletonPulse className="w-3/4 h-6 mb-3" />
          {/* Description */}
          <SkeletonPulse className="w-full h-4 mb-2" />
          <SkeletonPulse className="w-2/3 h-4 mb-4" />
          {/* Stats */}
          <div className="flex justify-between pt-4 border-t border-current/10">
            <div className="text-center">
              <SkeletonPulse className="w-10 h-6 mx-auto mb-1" />
              <SkeletonPulse className="w-16 h-3 mx-auto" />
            </div>
            <div className="text-center">
              <SkeletonPulse className="w-12 h-6 mx-auto mb-1" />
              <SkeletonPulse className="w-16 h-3 mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hero stats skeleton (inline)
export const HeroStatsSkeleton = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="grid grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="text-center p-4">
          <SkeletonPulse className="w-12 h-12 rounded-xl mx-auto mb-3" />
          <SkeletonPulse className="w-16 h-8 mx-auto mb-2" />
          <SkeletonPulse className="w-24 h-4 mx-auto" />
        </div>
      ))}
    </div>
  );
};

// Section wrapper with skeleton
export const SectionSkeleton = ({
  variant = "card",
  count = 3,
  title = true,
  ...props
}) => {
  const { isDarkMode } = useThemeStore();

  const SkeletonComponent =
    {
      card: CardSkeleton,
      stats: StatsSkeleton,
      gallery: GallerySkeleton,
      list: ListSkeleton,
      faculty: FacultyCardSkeleton,
    }[variant] || CardSkeleton;

  return (
    <div className="py-8 md:py-16">
      {title && (
        <div className="text-center mb-8">
          <SkeletonPulse className="w-32 h-4 mx-auto mb-3" />
          <SkeletonPulse className="w-64 h-8 mx-auto mb-2" />
          <SkeletonPulse className="w-96 max-w-full h-4 mx-auto" />
        </div>
      )}
      <SkeletonComponent count={count} {...props} />
    </div>
  );
};

export default SectionSkeleton;
