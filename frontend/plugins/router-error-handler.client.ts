export default defineNuxtPlugin((nuxtApp) => {
  const isDev = process.env.NODE_ENV === "development";

  // Add navigation guard to differentiate between asset paths and route paths
  nuxtApp.hook("vue:error", (err: any, instance: any, info: string): void => {
    // Check if this is a Vue Router "No match found for location with path" error
    if (err?.message?.includes("No match found for location with path")) {
      const path = err.message.match(/path "([^"]+)"/)?.[1];

      // Check if this is an asset URL (image, font, etc)
      if (
        path &&
        (path.match(/\.(png|jpe?g|gif|svg|webp|ico|ttf|woff2?)$/i) ||
          path.includes("/images/") ||
          path.includes("/assets/") ||
          path.includes("/uploads/") ||
          path === "/default-avatar.png")
      ) {
        // Suppress Vue Router warnings for asset URLs - only log in development
        if (isDev) {
          console.log("Suppressing Vue Router warning for asset URL:", path);
        }

        // More reliable error prevention - use type checking for safety
        if (typeof err.preventDefault === "function") {
          err.preventDefault();
        }
      }
    }
  });
});
