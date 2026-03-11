const elements = {
  email: document.getElementById("profile-email"),
  status: document.getElementById("profile-status"),
  verify: document.getElementById("profile-verify"),
  verifyNote: document.getElementById("profile-verify-note"),
  nameInput: document.getElementById("profile-name"),
  emailInput: document.getElementById("profile-email-input"),
  save: document.getElementById("profile-save"),
  logout: document.getElementById("profile-logout"),
  message: document.getElementById("profile-message"),
  resend: document.getElementById("profile-resend"),
  verifyMessage: document.getElementById("profile-verify-message"),
  reset: document.getElementById("profile-reset"),
  resetMessage: document.getElementById("profile-reset-message"),
};

const state = {
  user: null,
};

const STORAGE_KEYS = {
  authToken: "macromint_token",
  refreshToken: "macromint_refresh_token",
};

const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.authToken);
const getStoredRefreshToken = () => localStorage.getItem(STORAGE_KEYS.refreshToken);
const setStoredTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  }
};
const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
};

const DEFAULT_API_BASE = "https://macromint-api.onrender.com";

const normalizeApiPath = (path) => {
  if (path.startsWith("/api/")) {
    return `/v1/${path.slice(5)}`;
  }
  return path;
};

let refreshRequest = null;

const requestTokenRefresh = async () => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");
  if (refreshRequest) return refreshRequest;

  const base = (window.MACROMINT_API || DEFAULT_API_BASE).replace(/\/$/, "");
  refreshRequest = fetch(`${base}/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("Refresh failed");
      const data = await response.json();
      setStoredTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
};

const apiFetch = async (path, options = {}, retryOnAuthError = true) => {
  const base = (window.MACROMINT_API || DEFAULT_API_BASE).replace(/\/$/, "");
  const token = getStoredToken();
  const normalizedPath = normalizeApiPath(path);
  const customHeaders = options.headers || {};
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
  const hasBody = Object.prototype.hasOwnProperty.call(options, "body") && options.body !== undefined && options.body !== null;
  if (hasBody && !("Content-Type" in headers) && !("content-type" in headers)) {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(`${base}${normalizedPath}`, {
    credentials: "include",
    headers,
    ...options,
  });

  if (response.status === 401 && retryOnAuthError && !normalizedPath.endsWith("/auth/refresh")) {
    try {
      const refreshedAccessToken = await requestTokenRefresh();
      if (refreshedAccessToken) {
        return apiFetch(path, options, false);
      }
    } catch (error) {
      clearStoredAuth();
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (Array.isArray(errorData?.message)) {
        errorMessage = errorData.message.join(", ");
      } else if (typeof errorData?.message === "string") {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch (error) {
      // Ignore JSON parse errors.
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const setMessage = (element, message, isError = false) => {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? "#b91c1c" : "";
};

const updateView = () => {
  if (!state.user) {
    elements.email.textContent = "--";
    elements.status.textContent = "Not signed in";
    elements.verify.textContent = "--";
    elements.verifyNote.textContent = "Sign in to verify";
    elements.nameInput.value = "";
    elements.emailInput.value = "";
    elements.save.disabled = true;
    elements.resend.disabled = true;
    elements.reset.disabled = true;
    return;
  }

  elements.email.textContent = state.user.email;
  elements.status.textContent = "Signed in";
  elements.verify.textContent = state.user.email_verified ? "Verified" : "Unverified";
  elements.verifyNote.textContent = state.user.email_verified
    ? "You're all set."
    : "Check your inbox for the verification email.";
  elements.nameInput.value = state.user.name || "";
  elements.emailInput.value = state.user.email;
  elements.save.disabled = false;
  elements.resend.disabled = state.user.email_verified;
  elements.reset.disabled = false;
};

const loadUser = async () => {
  try {
    const data = await apiFetch("/api/auth/me");
    state.user = data.user;
    updateView();
  } catch (error) {
    state.user = null;
    updateView();
    setMessage(elements.message, "Please sign in on the main page first.", true);
  }
};

const handleSave = async () => {
  const name = elements.nameInput.value.trim();
  const email = elements.emailInput.value.trim();
  if (!email) {
    setMessage(elements.message, "Email is required.", true);
    return;
  }

  try {
    const data = await apiFetch("/api/account", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });
    state.user = data.user;
    updateView();
    setMessage(elements.message, "Profile updated.");
    if (!state.user.email_verified) {
      setMessage(elements.verifyMessage, "Verification email sent.");
    }
  } catch (error) {
    setMessage(elements.message, error.message || "Unable to save profile.", true);
  }
};

const handleResend = async () => {
  try {
    await apiFetch("/api/auth/resend-verify", { method: "POST" });
    setMessage(elements.verifyMessage, "Verification email sent.");
  } catch (error) {
    setMessage(elements.verifyMessage, error.message || "Unable to send email.", true);
  }
};

const handleReset = async () => {
  if (!state.user?.email) return;
  try {
    await apiFetch("/api/auth/request-reset", {
      method: "POST",
      body: JSON.stringify({ email: state.user.email }),
    });
    setMessage(elements.resetMessage, "Password reset email sent.");
  } catch (error) {
    setMessage(elements.resetMessage, error.message || "Unable to send reset email.", true);
  }
};

const handleLogout = async () => {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    // Ignore logout errors.
  }
  clearStoredAuth();
  state.user = null;
  updateView();
  setMessage(elements.message, "Signed out.");
};

const initDropdowns = () => {
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown) return;
  const toggle = dropdown.querySelector("[data-dropdown-toggle]");
  const menu = dropdown.querySelector(".dropdown-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isHidden = menu.hasAttribute("hidden");
    if (isHidden) {
      menu.removeAttribute("hidden");
    } else {
      menu.setAttribute("hidden", "");
    }
  });

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.closest("a")) {
      menu.setAttribute("hidden", "");
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      menu.setAttribute("hidden", "");
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      menu.setAttribute("hidden", "");
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    () => {
      menu.setAttribute("hidden", "");
    },
    { passive: true }
  );
};

const init = async () => {
  await loadUser();
  initDropdowns();

  if (elements.save) elements.save.addEventListener("click", handleSave);
  if (elements.resend) elements.resend.addEventListener("click", handleResend);
  if (elements.reset) elements.reset.addEventListener("click", handleReset);
  if (elements.logout) elements.logout.addEventListener("click", handleLogout);
};

document.addEventListener("DOMContentLoaded", init);
