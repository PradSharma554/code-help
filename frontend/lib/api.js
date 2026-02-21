export const apiFetch = async (url, options = {}) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const finalUrl = `${baseUrl}${url}`;

  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const finalOptions = {
    ...options,
    credentials: "include",
    headers,
  };

  return fetch(finalUrl, finalOptions);
};
