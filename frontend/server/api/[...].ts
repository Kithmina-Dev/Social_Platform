// API proxy to backend
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const target = config.public.apiBaseUrl;

  // Get the path without the /api prefix
  const path = event.path.replace(/^\/api/, "");

  // Create the target URL
  const url = `${target}${path}`;

  // Forward request to the backend
  return await proxyRequest(event, url);
});
