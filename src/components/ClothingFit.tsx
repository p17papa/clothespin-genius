import { CSSProperties, TouchEvent } from "react";

interface ClothingFitProps {
  src: string;
  alt: string;
  /** Positioning classes for the bounding box (absolute position + size) */
  className?: string;
  style?: CSSProperties;
  dimmed?: boolean;
  onTouchStart?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
}

/**
 * Renders a clothing photo scaled to fit inside its bounding box on the body.
 * The box has a fixed size (a region of the avatar), and the image is scaled
 * down to fit entirely inside it while keeping its original proportions —
 * never stretched, never overflowing onto other body parts.
 */
const ClothingFit = ({
  src,
  alt,
  className = "",
  style,
  dimmed = false,
  onTouchStart,
  onTouchEnd,
}: ClothingFitProps) => {
  return (
    <div
      className={`absolute flex items-center justify-center transition-opacity ${
        dimmed ? "opacity-80" : "opacity-100"
      } ${className}`}
      style={style}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-lg pointer-events-none"
        draggable={false}
      />
    </div>
  );
};

export default ClothingFit;
