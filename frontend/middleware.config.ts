export default {
  "manifest-route-rule": {
    override: true,
  },
  api: {
    target: process.env.API_BASE_URL || "http://localhost:3000",
    pathRewrite: {
      "^/api": "/api",
    },
  },
};
