const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pixii.selectease.in";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.error || data?.message || `Request failed with ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const baseApi = {
  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  get(endpoint) {
    return request(endpoint, {
      method: "GET",
    });
  },
};

export const apiEndpoints = {
  analyze: "/api/analyze/",
  taskStatus: (taskId) => `/api/task-status/${taskId}/`,
  history: "/api/history/",
  analysis: (taskId) => `/api/analysis/${taskId}/`,
  downloadPdf: (taskId) => `/api/analysis/${taskId}/download-pdf/`,
};

