import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/cn";

export type AppImageProps = Omit<NextImageProps, "alt"> & {
  alt?: string;
  className?: string;
};

/**
 * Shared image wrapper — all project images go through this component
 * so sizing/quality defaults stay consistent and unmerged.
 */
export function AppImage({
  alt = "",
  className,
  quality = 100,
  ...props
}: AppImageProps) {
  return (
    <NextImage
      alt={alt}
      quality={quality}
      className={cn(className)}
      {...props}
    />
  );
}

type BackgroundImageProps = {
  src: string;
  alt?: string;
  className?: string;
  overlayClassName?: string;
  showOverlay?: boolean;
};

/** Full-bleed background image with optional dim overlay. */
export function BackgroundImage({
  src,
  alt = "",
  className,
  overlayClassName,
  showOverlay = true,
}: BackgroundImageProps) {
  return (
    <>
      <AppImage
        src={src}
        alt={alt}
        fill
        preload
        sizes="100vw"
        className={cn("object-cover object-center", className)}
        aria-hidden
      />
      {showOverlay ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,8,20,0.08)_0%,rgba(5,8,20,0.35)_65%,rgba(5,8,20,0.55)_100%)]",
            overlayClassName,
          )}
          aria-hidden
        />
      ) : null}
    </>
  );
}
