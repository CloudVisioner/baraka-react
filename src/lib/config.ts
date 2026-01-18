const apiUrl = process.env.REACT_APP_API_URL;
export const serverApi: string = apiUrl || "http://localhost:3003";

export const Messages = {
    error1: "Something went wrong!",
    error2: "Please login first",
    error3: "Please fulfill all inputs!",
    error4: "Message is empty",
    error5: "Only images with jpeg, jpg, png format allowed!",
}

/**
 * Normalizes image path according to backend data flow
 * 
 * Backend Flow:
 * 1. Files uploaded to: ./uploads/{folder}/{uuid}.{ext}
 * 2. Database stores: "uploads/{folder}/{uuid}.{ext}" (relative path, no leading slash)
 * 3. Static middleware: app.use("/uploads", express.static("./uploads"))
 * 4. Frontend constructs: http://localhost:3003/uploads/{folder}/{uuid}.{ext}
 * 
 * Handles multiple formats:
 * - Full URLs (http://... or https://...) → return as-is
 * - Database format: "uploads/members/uuid.jpg" → "/uploads/members/uuid.jpg" → full URL
 * - Already normalized: "/uploads/products/uuid.jpg" → full URL
 * - Absolute paths (backward compat): "/Users/.../uploads/folder/file.jpg" → extract /uploads/ part
 * 
 * @param imagePath - Image path from database (standard: "uploads/{folder}/{uuid}.{ext}")
 * @param fallbackImage - Optional fallback image if path is invalid
 * @returns Full URL ready for <img src> tag
 */
export const normalizeImagePath = (imagePath: string | undefined | null, fallbackImage?: string): string => {
  // Return fallback if imagePath is empty/undefined/null
  if (!imagePath) {
    return fallbackImage || "/img/noimage-list.svg";
  }

  // If it's already a full URL (http:// or https://), return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  let normalizedPath = imagePath;

  // Handle absolute file system paths (backward compatibility)
  // Extract /uploads/... part from absolute paths like /Users/.../uploads/folder/file.jpg
  if (imagePath.includes("/uploads/")) {
    const uploadsIndex = imagePath.indexOf("/uploads/");
    normalizedPath = imagePath.substring(uploadsIndex);
  } else if (imagePath.includes("uploads\\")) {
    // Windows backslash paths
    const uploadsIndex = imagePath.indexOf("uploads\\");
    normalizedPath = "/uploads/" + imagePath.substring(uploadsIndex + 8).replace(/\\/g, "/");
  } else {
    // Standard database format: "uploads/{folder}/{file}" (no leading slash)
    // Convert to: "/uploads/{folder}/{file}"
    if (!normalizedPath.startsWith("/uploads/")) {
      normalizedPath = normalizedPath.startsWith("/") 
        ? `/uploads${normalizedPath}`
        : `/uploads/${normalizedPath}`;
    }
  }

  // Clean serverApi (remove trailing slash if present)
  const cleanServerApi = serverApi.endsWith("/") ? serverApi.slice(0, -1) : serverApi;
  
  // Construct full URL: http://localhost:3003/uploads/{folder}/{file}
  return `${cleanServerApi}${normalizedPath}`;
};