const elements = {
  password: document.getElementById("reset-password"),
  confirm: document.getElementById("reset-confirm"),
  submit: document.getElementById("reset-submit"),
  message: document.getElementById("reset-message"),
  help: document.getElementById("reset-help"),
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

const init = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) {
    elements.message.textContent = "Missing reset token.";
    elements.submit.disabled = true;
    return;
  }

  elements.submit.addEventListener("click", async () => {
    const password = elements.password.value;
    const confirm = elements.confirm.value;
    if (!password || password.length < 8) {
      elements.help.textContent = "Password must be at least 8 characters.";
      elements.help.style.color = "#b91c1c";
      return;
    }
    if (password !== confirm) {
      elements.help.textContent = "Passwords do not match.";
      elements.help.style.color = "#b91c1c";
      return;
    }

    try {
      await apiFetch("/api/auth/reset", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      elements.help.style.color = "";
      elements.help.textContent = "Password updated. You can close this tab.";
      elements.submit.disabled = true;
    } catch (error) {
      elements.help.textContent = error.message || "Reset failed.";
      elements.help.style.color = "#b91c1c";
    }
  });
};

document.addEventListener("DOMContentLoaded", init);
