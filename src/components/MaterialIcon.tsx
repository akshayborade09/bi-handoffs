"use client";

interface MaterialIconProps {
  name: string;
  className?: string;
  /** Default 20 */
  size?: number;
  /** Default 300 */
  weight?: number;
}

export function MaterialIcon({
  name,
  className = "",
  size = 20,
  weight = 300,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontWeight: weight,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
