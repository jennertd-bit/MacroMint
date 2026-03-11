const elements = {
  title: document.getElementById("verify-title"),
  message: document.getElementById("verify-message"),
};

const DEFAULT_API_BASE = "https://macromint-api.onrender.com";

const normalizeApiPath = (path) => {
  if (path.startsWith("/api/")) {
    return `/v1/${path.slice(5)}`;
  }
  return path;
};

const apiFetch = async (path, options = {}) => {
  const base = (window.MACROMINT_API || DEFAULT_API_BASE).replace(/\/$/, "");
  const normalizedPath = normalizeApiPath(path);
  const response = await fetch(`${base}${normalizedPath}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData?.error) errorMessage = errorData.error;
    } catch (error) {
      // Ignore JSON parse errors.
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const init = async () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) {
    elements.title.textContent = "Missing token";
    elements.message.textContent = "The verification link is missing a token.";
    return;
  }

  try {
    await apiFetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
    elements.title.textContent = "Email verified";
    elements.message.textContent = "You're all set! You can close this tab and return to MacroMint.";
  } catch (error) {
    elements.title.textContent = "Verification failed";
    elements.message.textContent = error.message || "That link is invalid or expired.";
  }
};

document.addEventListener("DOMContentLoaded", init);
