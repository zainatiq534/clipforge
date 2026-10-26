/**
 * Cloudinary video delivery URL with HQ transforms (sharp, high bitrate).
 * Inserts transforms after `/upload/` so Cloudinary re-encodes on the fly.
 */
export function cloudinaryHqVideo(
  src: string,
  opts?: { width?: number },
): string {
  const width = opts?.width ?? 1080;
  // Keep transforms simple — verified working on this Cloudinary account
  const transforms = `w_${width},c_limit,q_auto:best`;
  return src.replace("/video/upload/", `/video/upload/${transforms}/`);
}
