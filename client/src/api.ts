import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000";

export const uploadEEG = (file: File, onProgress?: (p: number) => void) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_BASE}/predict`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    },
  });
};

// ✅ Build correct WS URL (handles http/ws and https/wss)
export const WS_URL = API_BASE.replace(/^http/, "ws") + "/ws/stream";


