export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl.replace("/api", "");

  // Make baseUrl available to components
  return {
    provide: {
      getImageUrl: (path: string) => {
        if (!path) return null;

        // If it's already an absolute URL, return as is
        if (path.startsWith("http://") || path.startsWith("https://")) {
          return path;
        }

        if (path.startsWith("/uploads/")) {
          const fixedPath = path.replace("/uploads/uploads/", "/uploads/");
          return `${baseUrl}${fixedPath}`;
        }

        // For local static images from the public directory
        if (path.startsWith("/images/")) {
          return path;
        }

        // Default case
        return path;
      },
    },
  };
});
