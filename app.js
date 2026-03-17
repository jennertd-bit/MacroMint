const GOAL_PRESETS = {
  maintain: { label: "Maintain / Sustain", adjustment: 0 },
  diet: { label: "Diet", adjustment: -300 },
  lose: { label: "Lose", adjustment: -400 },
  shred: { label: "Shred", adjustment: -500 },
  gain: { label: "Gain", adjustment: 300 },
  bulk: { label: "Bulk", adjustment: 450 },
  custom: { label: "Custom", adjustment: 0 },
};

const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  custom: "Custom",
};

const PLAN_SLOT_LABELS = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

const STORAGE_KEYS = {
  authToken: "macromint_token",
  refreshToken: "macromint_refresh_token",
};

const state = {
  user: null,
  isAuthenticated: false,
  authState: "loadingAuth",
  pendingAction: null,
  log: [],
  profile: null,
  scannedProduct: null,
  profileEditMode: false,
  authMode: "signin",
};

const AUTH_DEBUG = localStorage.getItem("macromint_auth_debug") === "1";
let authInitCount = 0;
let authRenderCount = 0;
let appInitialized = false;

const authDebugLog = (message, details) => {
  if (!AUTH_DEBUG) return;
  if (details !== undefined) {
    console.debug(`[auth-debug] ${message}`, details);
    return;
  }
  console.debug(`[auth-debug] ${message}`);
};

const elements = {
  profileForm: document.getElementById("profile-form"),
  unitRadios: document.querySelectorAll('input[name="units"]'),
  age: document.getElementById("age"),
  sex: document.getElementById("sex"),
  heightFt: document.getElementById("height-ft"),
  heightIn: document.getElementById("height-in"),
  heightCm: document.getElementById("height-cm"),
  weightLb: document.getElementById("weight-lb"),
  weightKg: document.getElementById("weight-kg"),
  activity: document.getElementById("activity"),
  goalPreset: document.getElementById("goal-preset"),
  adjustment: document.getElementById("adjustment"),
  bmrValue: document.getElementById("bmr-value"),
  tdeeValue: document.getElementById("tdee-value"),
  targetValue: document.getElementById("target-value"),
  goalLabel: document.getElementById("goal-label"),
  targetsSummary: document.getElementById("targets-summary"),
  targetsSummaryStatus: document.getElementById("targets-summary-status"),
  targetsSummaryUnits: document.getElementById("targets-summary-units"),
  targetsSummaryGoal: document.getElementById("targets-summary-goal"),
  targetsSummaryWeight: document.getElementById("targets-summary-weight"),
  targetsSummaryActivity: document.getElementById("targets-summary-activity"),
  targetsEdit: document.getElementById("targets-edit"),
  targetsSave: document.getElementById("targets-save"),
  targetsFormActions: document.getElementById("targets-form-actions"),
  targetsMessage: document.getElementById("targets-message"),
  macroProtein: document.getElementById("macro-protein"),
  macroCarbs: document.getElementById("macro-carbs"),
  macroFat: document.getElementById("macro-fat"),
  macroAlcohol: document.getElementById("macro-alcohol"),
  macroCalories: document.getElementById("macro-calories"),
  authPanel: document.querySelector(".auth-panel"),
  authLoading: document.getElementById("auth-loading"),
  authSignedOut: document.getElementById("auth-signed-out"),
  authSignedIn: document.getElementById("auth-signed-in"),
  authModeSignin: document.getElementById("auth-mode-signin"),
  authModeSignup: document.getElementById("auth-mode-signup"),
  authLoginForm: document.getElementById("auth-login-form"),
  authSignupForm: document.getElementById("auth-signup-form"),
  authLoginEmail: document.getElementById("auth-login-email"),
  authLoginPassword: document.getElementById("auth-login-password"),
  authSignupName: document.getElementById("auth-signup-name"),
  authSignupEmail: document.getElementById("auth-signup-email"),
  authSignupPassword: document.getElementById("auth-signup-password"),
  authUserName: document.getElementById("auth-user-name"),
  authUserEmail: document.getElementById("auth-user-email"),
  authUserStatus: document.getElementById("auth-user-status"),
  authEditStats: document.getElementById("auth-edit-stats"),
  authRegister: document.getElementById("auth-register"),
  authLogin: document.getElementById("auth-login"),
  authLogout: document.getElementById("auth-logout"),
  authStatus: document.getElementById("auth-status"),
  authMessage: document.getElementById("auth-message"),
  authMessageSigned: document.getElementById("auth-message-signed"),
  barcodeStart: document.getElementById("barcode-start"),
  barcodeStop: document.getElementById("barcode-stop"),
  barcodeReader: document.getElementById("barcode-reader"),
  barcodeStatus: document.getElementById("barcode-status"),
  barcodeInput: document.getElementById("barcode-input"),
  barcodeLookup: document.getElementById("barcode-lookup"),
  productInfo: document.getElementById("product-info"),
  productName: document.getElementById("product-name"),
  productBrand: document.getElementById("product-brand"),
  productSource: document.getElementById("product-source"),
  labelInput: document.getElementById("label-input"),
  previewWrap: document.getElementById("preview-wrap"),
  labelPreview: document.getElementById("label-preview"),
  ocrMessage: document.getElementById("ocr-message"),
  ocrProgress: document.getElementById("ocr-progress"),
  ocrRawText: document.getElementById("ocr-raw-text"),
  labelCalories: document.getElementById("label-calories"),
  labelServing: document.getElementById("label-serving"),
  labelServings: document.getElementById("label-servings"),
  labelFat: document.getElementById("label-fat"),
  labelCarbs: document.getElementById("label-carbs"),
  labelProtein: document.getElementById("label-protein"),
  servingsEaten: document.getElementById("servings-eaten"),
  saveFood: document.getElementById("save-food"),
  saveFoodMessage: document.getElementById("save-food-message"),
  mealType: document.getElementById("meal-type"),
  mealName: document.getElementById("meal-name"),
  caloriesOverride: document.getElementById("calories-override"),
  mealCalories: document.getElementById("meal-calories"),
  macroCheck: document.getElementById("macro-check"),
  macroMismatch: document.getElementById("macro-mismatch"),
  addMeal: document.getElementById("add-meal"),
  logList: document.getElementById("log-list"),
  clearLog: document.getElementById("clear-log"),
  dailyTotal: document.getElementById("daily-total"),
  dailyRemaining: document.getElementById("daily-remaining"),
  scrollButtons: document.querySelectorAll("[data-scroll]"),
  planStatus: document.getElementById("plan-status"),
  remainingCalories: document.getElementById("plan-remaining-calories"),
  remainingProtein: document.getElementById("plan-remaining-protein"),
  remainingCarbs: document.getElementById("plan-remaining-carbs"),
  remainingFat: document.getElementById("plan-remaining-fat"),
  planSuggestions: document.getElementById("plan-suggestions"),
};

const parseNumber = (value) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
};

const formatNumber = (value) => Math.round(value).toLocaleString();
const formatQuantity = (value) => {
  if (!Number.isFinite(value)) return "";
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
};
const formatMacro = (value, unit = "") => {
  if (!Number.isFinite(value)) return "--";
  return `${formatNumber(value)}${unit}`;
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

const setAuthMessage = (message, isError = false) => {
  if (elements.authMessage) {
    elements.authMessage.textContent = message;
    elements.authMessage.style.color = isError ? "#b91c1c" : "";
  }
  if (elements.authMessageSigned) {
    elements.authMessageSigned.textContent = message;
    elements.authMessageSigned.style.color = isError ? "#b91c1c" : "";
  }
};

const setPlanStatus = (message, isError = false) => {
  if (!elements.planStatus) return;
  elements.planStatus.textContent = message;
  elements.planStatus.classList.toggle("error", isError);
};

const setSaveFoodMessage = (message, isError = false) => {
  if (!elements.saveFoodMessage) return;
  elements.saveFoodMessage.textContent = message;
  elements.saveFoodMessage.style.color = isError ? "#b91c1c" : "";
};

const setTargetsMessage = (message, isError = false) => {
  if (!elements.targetsMessage) return;
  elements.targetsMessage.textContent = message;
  elements.targetsMessage.style.color = isError ? "#b91c1c" : "";
};

const setAuthMode = (mode) => {
  state.authMode = mode === "signup" ? "signup" : "signin";
  if (!elements.authModeSignin || !elements.authModeSignup) return;
  const isSignin = state.authMode === "signin";
  elements.authModeSignin.classList.toggle("active", isSignin);
  elements.authModeSignup.classList.toggle("active", !isSignin);
  elements.authModeSignin.setAttribute("aria-selected", String(isSignin));
  elements.authModeSignup.setAttribute("aria-selected", String(!isSignin));
  if (elements.authLoginForm) elements.authLoginForm.hidden = !isSignin;
  if (elements.authSignupForm) elements.authSignupForm.hidden = isSignin;
};

const setAuthState = (user) => {
  state.user = user || null;
  state.isAuthenticated = Boolean(user);
  state.authState = state.isAuthenticated ? "signedIn" : "signedOut";
};

const setAuthViewState = (nextState) => {
  if (!nextState) return;
  state.authState = nextState;
};

const promptAuthForAction = (message = "You need an account to save changes.", mode = "signin") => {
  setAuthMode(mode);
  setAuthMessage(message, true);
  if (elements.authPanel) {
    elements.authPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (mode === "signup") {
    elements.authSignupEmail?.focus();
  } else {
    elements.authLoginEmail?.focus();
  }
};

const runPendingAction = async () => {
  const action = state.pendingAction;
  state.pendingAction = null;
  if (typeof action !== "function") return;
  try {
    await action();
  } catch (error) {
    setAuthMessage(error.message || "Unable to complete pending action.", true);
  }
};

const requireAuth = async (action, options = {}) => {
  if (state.authState === "loadingAuth") {
    state.pendingAction = action;
    return null;
  }
  if (state.isAuthenticated) {
    return action();
  }
  state.pendingAction = action;
  promptAuthForAction(options.message, options.mode);
  return null;
};

const renderAccountAuthPanel = () => {
  if (!elements.authStatus || !elements.authPanel) return;
  authRenderCount += 1;
  const isLoading = state.authState === "loadingAuth";
  const isSignedIn = state.authState === "signedIn";
  const isSignedOut = state.authState === "signedOut";
  const authContainerCount = document.querySelectorAll(".auth-panel").length;
  authDebugLog("renderAccountAuthPanel", {
    authRenderCount,
    authState: state.authState,
    isAuthenticated: state.isAuthenticated,
    authContainerCount,
  });

  if (elements.authLoading) elements.authLoading.hidden = !isLoading;
  if (elements.authSignedOut) elements.authSignedOut.hidden = !isSignedOut;
  if (elements.authSignedIn) elements.authSignedIn.hidden = !isSignedIn;

  if (isLoading) {
    elements.authStatus.textContent = "Checking session...";
    updateTargetsUI();
    return;
  }

  if (isSignedIn && state.user) {
    const email = state.user.email || "--";
    elements.authStatus.textContent = `Signed in as ${email}`;
    if (elements.authUserEmail) elements.authUserEmail.textContent = email;
    if (elements.authUserName) elements.authUserName.textContent = state.user.name || "No name set";
    if (elements.authUserStatus) elements.authUserStatus.textContent = `Signed in as ${email}`;
  } else {
    elements.authStatus.textContent = "Not signed in";
    setAuthMode("signin");
  }
  updateTargetsUI();
};

const updateAuthUI = renderAccountAuthPanel;

const normalizeProfile = (profile) => {
  if (!profile) return null;
  const normalized = {
    units: profile.units || "us",
    age: profile.age ?? "",
    sex: profile.sex || "male",
    heightFt: profile.heightFt ?? profile.height_ft ?? "",
    heightIn: profile.heightIn ?? profile.height_in ?? "",
    heightCm: profile.heightCm ?? profile.height_cm ?? "",
    weightLb: profile.weightLb ?? profile.weight_lb ?? "",
    weightKg: profile.weightKg ?? profile.weight_kg ?? "",
    activity: profile.activity ?? profile.activityLevel ?? profile.activity_level ?? "1.2",
    goalPreset: profile.goalPreset ?? profile.goal_preset ?? "maintain",
    adjustment: profile.adjustment ?? 0,
  };

  const heightCm = Number.isFinite(normalized.heightCm) ? normalized.heightCm : Number.parseFloat(normalized.heightCm);
  const weightKg = Number.isFinite(normalized.weightKg) ? normalized.weightKg : Number.parseFloat(normalized.weightKg);

  if ((!normalized.heightFt || !normalized.heightIn) && Number.isFinite(heightCm)) {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - feet * 12);
    normalized.heightFt = feet;
    normalized.heightIn = inches;
  }

  if (!normalized.weightLb && Number.isFinite(weightKg)) {
    normalized.weightLb = Math.round(weightKg * 2.20462 * 10) / 10;
  }

  return normalized;
};

const applyProfileToForm = (profile) => {
  if (!profile) return;
  if (profile.units) {
    elements.unitRadios.forEach((radio) => {
      radio.checked = radio.value === profile.units;
    });
  }
  if (profile.age !== undefined && profile.age !== null) elements.age.value = profile.age;
  if (profile.sex) elements.sex.value = profile.sex;
  if (profile.heightFt !== undefined && profile.heightFt !== null) elements.heightFt.value = profile.heightFt;
  if (profile.heightIn !== undefined && profile.heightIn !== null) elements.heightIn.value = profile.heightIn;
  if (profile.heightCm !== undefined && profile.heightCm !== null) elements.heightCm.value = profile.heightCm;
  if (profile.weightLb !== undefined && profile.weightLb !== null) elements.weightLb.value = profile.weightLb;
  if (profile.weightKg !== undefined && profile.weightKg !== null) elements.weightKg.value = profile.weightKg;
  if (profile.activity) elements.activity.value = profile.activity;
  if (profile.goalPreset) elements.goalPreset.value = profile.goalPreset;
  if (profile.adjustment !== undefined && profile.adjustment !== null)
    elements.adjustment.value = profile.adjustment;
};

const isFiniteNumber = (value) => Number.isFinite(parseNumber(value));

const getActivityLabel = (value) => {
  if (!elements.activity) return "--";
  const match = Array.from(elements.activity.options || []).find((option) => option.value === String(value));
  return match ? match.textContent : "--";
};

const getProfileForUI = () => normalizeProfile(state.profile ?? collectProfileFromForm());

const isProfileComplete = (profileInput) => {
  const profile = normalizeProfile(profileInput);
  if (!profile) return false;

  const units = profile.units === "metric" ? "metric" : "us";
  const hasHeight =
    units === "metric"
      ? isFiniteNumber(profile.heightCm)
      : isFiniteNumber(profile.heightFt) && isFiniteNumber(profile.heightIn);
  const hasWeight = units === "metric" ? isFiniteNumber(profile.weightKg) : isFiniteNumber(profile.weightLb);

  return (
    ["us", "metric"].includes(units) &&
    isFiniteNumber(profile.age) &&
    Boolean(profile.sex) &&
    hasHeight &&
    hasWeight &&
    isFiniteNumber(profile.activity) &&
    Boolean(profile.goalPreset) &&
    isFiniteNumber(profile.adjustment)
  );
};

const renderTargetsSummary = (profileInput) => {
  if (!elements.targetsSummary) return;
  const profile = normalizeProfile(profileInput);
  if (!profile) return;

  const units = profile.units === "metric" ? "metric" : "us";
  const weight =
    units === "metric"
      ? `${formatQuantity(parseNumber(profile.weightKg) || 0)} kg`
      : `${formatQuantity(parseNumber(profile.weightLb) || 0)} lb`;
  const goalLabel = GOAL_PRESETS[profile.goalPreset]?.label || "Custom";
  const activityLabel = getActivityLabel(profile.activity);

  if (elements.targetsSummaryStatus) elements.targetsSummaryStatus.textContent = "Profile complete";
  if (elements.targetsSummaryUnits) elements.targetsSummaryUnits.textContent = units === "metric" ? "Metric" : "US";
  if (elements.targetsSummaryGoal) elements.targetsSummaryGoal.textContent = goalLabel;
  if (elements.targetsSummaryWeight) elements.targetsSummaryWeight.textContent = weight;
  if (elements.targetsSummaryActivity) elements.targetsSummaryActivity.textContent = activityLabel;
};

const updateTargetsUI = () => {
  if (!elements.profileForm || !elements.targetsSummary || !elements.targetsFormActions) return;

  if (!state.isAuthenticated) {
    elements.profileForm.hidden = false;
    elements.targetsSummary.hidden = true;
    elements.targetsFormActions.hidden = true;
    return;
  }

  const profile = getProfileForUI();
  const complete = isProfileComplete(profile);
  const showForm = !complete || state.profileEditMode;

  elements.profileForm.hidden = !showForm;
  elements.targetsSummary.hidden = showForm;
  elements.targetsFormActions.hidden = !showForm || !state.profileEditMode;

  if (!showForm) {
    renderTargetsSummary(profile);
  }
};

const getUnitSystem = () => {
  const selected = Array.from(elements.unitRadios).find((radio) => radio.checked);
  return selected ? selected.value : "us";
};

const updateUnitVisibility = () => {
  const unit = getUnitSystem();
  document.querySelectorAll("[data-unit]").forEach((field) => {
    field.style.display = field.getAttribute("data-unit") === unit ? "grid" : "none";
  });
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

const updateMealNameFromType = () => {
  if (!elements.mealType || !elements.mealName) return;
  const type = elements.mealType.value;
  if (type === "custom") {
    elements.mealName.value = "";
    elements.mealName.placeholder = "Custom meal";
    elements.mealName.focus();
    return;
  }
  const label = MEAL_LABELS[type] || "Meal";
  elements.mealName.value = label;
  elements.mealName.placeholder = label;
};

const updateGoalLabel = () => {
  const preset = elements.goalPreset.value;
  const label = GOAL_PRESETS[preset]?.label || "Goal";
  elements.goalLabel.textContent = `${label} target`;
};

const GOAL_TYPE_MAP = {
  maintain: "MAINTAIN",
  diet: "CUT",
  lose: "CUT",
  shred: "CUT",
  gain: "BULK",
  bulk: "BULK",
  custom: "MAINTAIN",
};

let goalSaveTimer = null;
let goalSaveInFlight = false;
let lastSavedGoalSignature = null;

const buildGoalPayloadFromTarget = (targetCalories) => {
  const proteinCalories = targetCalories * 0.3;
  const carbCalories = targetCalories * 0.4;
  const fatCalories = targetCalories * 0.3;

  return {
    goalType: GOAL_TYPE_MAP[elements.goalPreset.value] || "MAINTAIN",
    targetCalories: Math.round(targetCalories),
    targetProteinG: Math.round(proteinCalories / 4),
    targetCarbsG: Math.round(carbCalories / 4),
    targetFatG: Math.round(fatCalories / 9),
  };
};

const saveGoalForTarget = async (targetCalories) => {
  if (!state.isAuthenticated || !Number.isFinite(targetCalories)) return false;
  const payload = buildGoalPayloadFromTarget(targetCalories);
  const signature = JSON.stringify(payload);
  if (signature === lastSavedGoalSignature || goalSaveInFlight) {
    return false;
  }

  goalSaveInFlight = true;
  try {
    await apiFetch("/api/goals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    lastSavedGoalSignature = signature;
    return true;
  } finally {
    goalSaveInFlight = false;
  }
};

const queueGoalSave = (targetCalories) => {
  if (!state.isAuthenticated || !Number.isFinite(targetCalories)) return;
  if (goalSaveTimer) clearTimeout(goalSaveTimer);
  goalSaveTimer = setTimeout(async () => {
    try {
      await saveGoalForTarget(targetCalories);
    } catch (error) {
      setAuthMessage("Unable to save goals.", true);
    }
  }, 800);
};

const calculateTargets = ({ saveGoal = true } = {}) => {
  const unit = getUnitSystem();
  const age = parseNumber(elements.age.value);
  const sex = elements.sex.value;
  const activity = parseNumber(elements.activity.value) || 1.2;
  const adjustment = parseNumber(elements.adjustment.value) || 0;

  const metrics = window.MacroMintCalcs?.toMetric({
    unit,
    heightFt: elements.heightFt.value,
    heightIn: elements.heightIn.value,
    heightCm: elements.heightCm.value,
    weightLb: elements.weightLb.value,
    weightKg: elements.weightKg.value,
  });

  const heightCm = metrics?.heightCm ?? null;
  const weightKg = metrics?.weightKg ?? null;

  if (!age || !heightCm || !weightKg) {
    elements.bmrValue.textContent = "--";
    elements.tdeeValue.textContent = "--";
    elements.targetValue.textContent = "--";
    updateRemaining();
    return null;
  }

  const bmr = window.MacroMintCalcs?.bmrMifflin({ sex, age, heightCm, weightKg });
  const tdee = window.MacroMintCalcs?.tdee({ bmr, activity });
  const target = window.MacroMintCalcs?.target({ tdeeValue: tdee, adjustment });

  elements.bmrValue.textContent = Number.isFinite(bmr) ? Math.round(bmr).toLocaleString() : "--";
  elements.tdeeValue.textContent = Number.isFinite(tdee) ? Math.round(tdee).toLocaleString() : "--";
  elements.targetValue.textContent = Number.isFinite(target) ? Math.round(target).toLocaleString() : "--";
  updateRemaining();
  if (saveGoal && Number.isFinite(target)) {
    queueGoalSave(target);
  }
  queuePlanUpdate();
  return Number.isFinite(target) ? target : null;
};

const updateMacroCalories = () => {
  const protein = parseNumber(elements.macroProtein.value) || 0;
  const carbs = parseNumber(elements.macroCarbs.value) || 0;
  const fat = parseNumber(elements.macroFat.value) || 0;
  const alcohol = parseNumber(elements.macroAlcohol.value) || 0;
  const calories = protein * 4 + carbs * 4 + fat * 9 + alcohol * 7;
  elements.macroCalories.textContent = Math.round(calories).toLocaleString();
};

const setBarcodeStatus = (message, isError = false) => {
  if (!elements.barcodeStatus) return;
  elements.barcodeStatus.textContent = message;
  elements.barcodeStatus.classList.toggle("error", isError);
};

const setBarcodeIdle = (message = "Ready to scan.") => {
  if (!elements.barcodeReader) return;
  elements.barcodeReader.textContent = message;
};

const extractNutriment = (nutriments, keys) => {
  if (!nutriments) return null;
  for (const key of keys) {
    const value = nutriments[key];
    const number = Number.parseFloat(value);
    if (Number.isFinite(number)) {
      return number;
    }
  }
  return null;
};

let barcodeScanner = null;
let barcodeActive = false;

const getBarcodeScanner = () => {
  if (!window.Html5Qrcode || !elements.barcodeReader) return null;
  if (barcodeScanner) return barcodeScanner;

  const formats = window.Html5QrcodeSupportedFormats
    ? [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
      ]
    : undefined;

  barcodeScanner = new Html5Qrcode("barcode-reader", {
    formatsToSupport: formats,
    experimentalFeatures: { useBarCodeDetectorIfSupported: true },
  });

  return barcodeScanner;
};

const stopBarcodeScanner = async (message) => {
  if (!barcodeScanner || !barcodeActive) {
    if (elements.barcodeStart) elements.barcodeStart.disabled = false;
    if (elements.barcodeStop) elements.barcodeStop.disabled = true;
    if (message) setBarcodeStatus(message);
    return;
  }
  try {
    await barcodeScanner.stop();
    barcodeScanner.clear();
  } catch (error) {
    // Ignore stop errors.
  } finally {
    barcodeActive = false;
    if (elements.barcodeStart) elements.barcodeStart.disabled = false;
    if (elements.barcodeStop) elements.barcodeStop.disabled = true;
    if (message) setBarcodeStatus(message);
    setBarcodeIdle();
  }
};

const applyProductData = (product, nutriments, sourceLabel) => {
  // ── Determine if the API gave us per-serving values ──────────────────────
  // Open Food Facts stores *_serving keys when a serving size is configured.
  // When those are missing we only have *_100g values and must scale them.
  const hasServingKcal = extractNutriment(nutriments, ["energy-kcal_serving"]) !== null;

  let calories, fat, carbs, protein, servingLabel;

  if (hasServingKcal) {
    // ── Per-serving data present → use directly ──
    calories = extractNutriment(nutriments, ["energy-kcal_serving"]) ??
               extractNutriment(nutriments, ["energy-kcal", "energy-kcal_100g"]);
    fat      = extractNutriment(nutriments, ["fat_serving"])              ?? extractNutriment(nutriments, ["fat_100g"]);
    carbs    = extractNutriment(nutriments, ["carbohydrates_serving"])    ?? extractNutriment(nutriments, ["carbohydrates_100g"]);
    protein  = extractNutriment(nutriments, ["proteins_serving"])         ?? extractNutriment(nutriments, ["proteins_100g"]);
    servingLabel = product?.serving_size || null;
  } else {
    // ── Only 100g data → try to scale by serving size ──────────────────────
    // `serving_quantity` is the numeric serving size in grams/ml (e.g. 28 for "28g")
    const servingQty = Number.parseFloat(product?.serving_quantity);
    const scaleFactor = Number.isFinite(servingQty) && servingQty > 0 ? servingQty / 100 : null;

    const kcal100  = extractNutriment(nutriments, ["energy-kcal_100g", "energy-kcal", "energy_100g"]);
    const fat100   = extractNutriment(nutriments, ["fat_100g"]);
    const carbs100 = extractNutriment(nutriments, ["carbohydrates_100g"]);
    const prot100  = extractNutriment(nutriments, ["proteins_100g"]);

    if (scaleFactor) {
      // Scale 100g values to actual serving size
      calories = kcal100  !== null ? Math.round(kcal100  * scaleFactor) : null;
      fat      = fat100   !== null ? Math.round(fat100   * scaleFactor * 10) / 10 : null;
      carbs    = carbs100 !== null ? Math.round(carbs100 * scaleFactor * 10) / 10 : null;
      protein  = prot100  !== null ? Math.round(prot100  * scaleFactor * 10) / 10 : null;
      servingLabel = product?.serving_size || `${Math.round(servingQty)}g`;
    } else {
      // No serving info at all — show per 100g and label it clearly
      calories = kcal100;
      fat      = fat100;
      carbs    = carbs100;
      protein  = prot100;
      servingLabel = "100g";
    }
  }

  if (calories !== null) elements.labelCalories.value = Math.round(calories);
  if (fat      !== null) elements.labelFat.value      = fat;
  if (carbs    !== null) elements.labelCarbs.value    = carbs;
  if (protein  !== null) elements.labelProtein.value  = protein;

  if (servingLabel) {
    elements.labelServing.value = servingLabel;
  } else if (!elements.labelServing.value) {
    elements.labelServing.value = "1 serving";
  }

  const name = product?.product_name || product?.product_name_en || "";
  const brand = product?.brands || "";

  state.scannedProduct = {
    name,
    brand,
    barcode: elements.barcodeInput.value?.trim() || null,
    source: sourceLabel,
  };

  if (elements.productInfo) {
    elements.productInfo.hidden = false;
    elements.productName.textContent = name || "Product found";
    elements.productBrand.textContent = brand ? `Brand: ${brand}` : "Brand not listed";
    elements.productSource.textContent = sourceLabel;
  }

  const currentName = elements.mealName.value.trim();
  if (name && (!currentName || Object.values(MEAL_LABELS).includes(currentName))) {
    elements.mealName.value = name;
  }

  updateMealSummary();
};

const lookupBarcode = async (barcode) => {
  if (!barcode) {
    setBarcodeStatus("Enter a barcode to look up.", true);
    return;
  }

  const sanitized = barcode.replace(/\\s+/g, "");
  elements.barcodeInput.value = sanitized;
  setBarcodeStatus("Looking up product...");

  try {
    const response = await fetch(
      `https://world.openfoodfacts.net/api/v2/product/${encodeURIComponent(
        sanitized
      )}.json?fields=product_name,product_name_en,brands,serving_size,serving_quantity,serving_quantity_unit,nutriments`
    );
    if (!response.ok) {
      throw new Error("Lookup failed");
    }
    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      setBarcodeStatus("Product not found. Try the label scan instead.", true);
      if (elements.productInfo) elements.productInfo.hidden = true;
      return;
    }

    applyProductData(data.product, data.product.nutriments || {}, "Source: Open Food Facts");
    setBarcodeStatus("Product loaded. Review the values.");
  } catch (error) {
    setBarcodeStatus("Lookup failed. Check connection or try OCR scan.", true);
  }
};

const startBarcodeScanner = async () => {
  if (!elements.barcodeStart) return;
  const scanner = getBarcodeScanner();
  if (!scanner) {
    setBarcodeStatus("Barcode scanner unavailable. Use manual entry.", true);
    return;
  }
  if (barcodeActive) return;

  elements.barcodeStart.disabled = true;
  elements.barcodeStop.disabled = false;
  elements.barcodeReader.textContent = "";
  setBarcodeStatus("Requesting camera...");

  try {
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 260, height: 160 } },
      async (decodedText) => {
        if (!barcodeActive) return;
        await stopBarcodeScanner("Barcode detected.");
        elements.barcodeInput.value = decodedText;
        lookupBarcode(decodedText);
      },
      () => {}
    );
    barcodeActive = true;
    setBarcodeStatus("Scanning... Hold the barcode steady.");
  } catch (error) {
    barcodeActive = false;
    elements.barcodeStart.disabled = false;
    elements.barcodeStop.disabled = true;
    setBarcodeStatus("Camera access blocked. Use manual entry.", true);
  }
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);
const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ── Date navigation state ─────────────────────────────────────────────────
let viewDate = new Date();            // currently viewed date
const getViewDateKey = () => toDateKey(viewDate);
const isViewingToday = () => getViewDateKey() === getTodayKey();

function formatDateLabel(date) {
  const key = toDateKey(date);
  const today = getTodayKey();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  if (key === today) return "Today";
  if (key === toDateKey(yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function updateDateNav() {
  const label = document.getElementById("date-label");
  const nextBtn = document.getElementById("date-next");
  if (label) {
    label.textContent = formatDateLabel(viewDate);
    label.classList.toggle("is-today", isViewingToday());
  }
  // Don't allow navigating into the future
  if (nextBtn) nextBtn.disabled = isViewingToday();
  // Disable "Add to Today" and "Clear Today" when not viewing today
  const addMealBtn = document.getElementById("add-meal");
  const clearBtn = document.getElementById("clear-log");
  if (addMealBtn) {
    addMealBtn.disabled = !isViewingToday();
    addMealBtn.textContent = isViewingToday() ? "Add to Today ✓" : "← Go to Today to add";
  }
  if (clearBtn) clearBtn.disabled = !isViewingToday();
}

function navigateDate(offset) {
  viewDate.setDate(viewDate.getDate() + offset);
  updateDateNav();
  reloadLogForDate();
}

function goToToday() {
  viewDate = new Date();
  updateDateNav();
  reloadLogForDate();
}

async function reloadLogForDate() {
  const dateKey = getViewDateKey();
  if (!state.isAuthenticated) {
    state.log = getLocalLogForDate(dateKey).map(e => ({ ...e, date: e.date || dateKey }));
  } else {
    try {
      const meals = await apiFetch(`/api/meals?date=${dateKey}`);
      state.log = (meals || []).map(mapMealLogToEntry);
    } catch {
      state.log = [];
    }
  }
  renderLog();
}

// Wire up date nav buttons after DOM load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date-prev")?.addEventListener("click", () => navigateDate(-1));
  document.getElementById("date-next")?.addEventListener("click", () => navigateDate(1));
  document.getElementById("date-label")?.addEventListener("click", goToToday);
  updateDateNav();
});

const mapMealLogToEntry = (meal) => {
  const calories = (meal.items || []).reduce(
    (sum, item) => sum + (item.computedCalories || 0),
    0,
  );
  const loggedAt = meal.loggedAt || meal.createdAt || Date.now();
  const dateKey = toDateKey(new Date(loggedAt));
  const slot = meal.mealSlot ? meal.mealSlot.toLowerCase() : "custom";
  return {
    id: meal.id,
    name: meal.customSlotName || MEAL_LABELS[slot] || "Meal",
    type: slot,
    calories: Math.round(calories),
    date: dateKey,
    timestamp: loggedAt,
  };
};

const loadLogForToday = async () => {
  const today = getTodayKey();
  if (!state.isAuthenticated) {
    // Load from localStorage — works without an account
    state.log = getLocalLogForDate(today);
    renderLog();
    queuePlanUpdate();
    return;
  }

  try {
    const data = await apiFetch(`/api/meals?date=${today}`);
    const meals = Array.isArray(data) ? data : data.meals || [];
    state.log = meals.map(mapMealLogToEntry);
    renderLog();
    queuePlanUpdate();
  } catch (error) {
    setAuthMessage("Unable to load meals.", true);
    state.log = [];
    renderLog();
    queuePlanUpdate();
  }
};

const updateRemaining = () => {
  const total = Number.parseFloat(elements.dailyTotal.textContent.replace(/,/g, "")) || 0;
  const targetText = elements.targetValue.textContent.replace(/,/g, "");
  const target = Number.parseFloat(targetText);

  if (!Number.isFinite(target)) {
    elements.dailyRemaining.textContent = "--";
    return;
  }

  const remaining = Math.round(target - total);
  const label = remaining >= 0 ? remaining : `-${Math.abs(remaining)}`;
  elements.dailyRemaining.textContent = label.toLocaleString();
};

const clearPlanUI = () => {
  if (elements.remainingCalories) elements.remainingCalories.textContent = "--";
  if (elements.remainingProtein) elements.remainingProtein.textContent = "--";
  if (elements.remainingCarbs) elements.remainingCarbs.textContent = "--";
  if (elements.remainingFat) elements.remainingFat.textContent = "--";
  if (elements.planSuggestions) elements.planSuggestions.innerHTML = "";
};

const parseServingSize = (text) => {
  if (!text) return { grams: null, ml: null };
  const gramMatch = text.match(/([0-9]+(?:\\.[0-9]+)?)\\s*g/i);
  const mlMatch = text.match(/([0-9]+(?:\\.[0-9]+)?)\\s*ml/i);
  return {
    grams: gramMatch ? Number.parseFloat(gramMatch[1]) : null,
    ml: mlMatch ? Number.parseFloat(mlMatch[1]) : null,
  };
};

// ── Local daily food log (no auth required) ───────────────────────────────
const LOCAL_LOG_KEY = "macromint_daily_log";

const getLocalLog = () => {
  try { return JSON.parse(localStorage.getItem(LOCAL_LOG_KEY) || "{}"); } catch { return {}; }
};

const saveLocalLog = (byDate) => {
  try { localStorage.setItem(LOCAL_LOG_KEY, JSON.stringify(byDate)); } catch {}
};

const getLocalLogForDate = (dateKey) => {
  const all = getLocalLog();
  return all[dateKey] || [];
};

const addLocalLogEntry = (entry) => {
  const all = getLocalLog();
  const date = entry.date || getTodayKey();
  all[date] = [entry, ...(all[date] || [])];
  // prune old dates — keep last 30 days
  const keys = Object.keys(all).sort().slice(-30);
  const pruned = {};
  keys.forEach(k => { pruned[k] = all[k]; });
  saveLocalLog(pruned);
};

const removeLocalLogEntry = (entryId, dateKey) => {
  const all = getLocalLog();
  if (all[dateKey]) {
    all[dateKey] = all[dateKey].filter(e => e.id !== entryId);
    saveLocalLog(all);
  }
};

// ── Pantry: localStorage-based food library ───────────────────────────────
const PANTRY_KEY = "macromint_pantry";

const getPantry = () => {
  try { return JSON.parse(localStorage.getItem(PANTRY_KEY) || "[]"); } catch { return []; }
};

const savePantry = (items) => {
  try { localStorage.setItem(PANTRY_KEY, JSON.stringify(items)); } catch {}
};

// Record a log entry in pantry so we can learn tendencies over time
const recordPantryUsage = (pantryId) => {
  const pantry = getPantry();
  const item = pantry.find(f => f.id === pantryId);
  if (!item) return;
  item.useCount  = (item.useCount  || 0) + 1;
  item.lastUsed  = new Date().toISOString();
  item.useDates  = [...(item.useDates || []), getTodayKey()].slice(-60); // keep last 60 dates
  savePantry(pantry);
};

const saveFoodToLibrary = () => {
  const calories = parseNumber(elements.labelCalories.value);
  const protein  = parseNumber(elements.labelProtein.value);
  const carbs    = parseNumber(elements.labelCarbs.value);
  const fat      = parseNumber(elements.labelFat.value);

  if (calories === null || protein === null || carbs === null || fat === null) {
    setSaveFoodMessage("Add calories, protein, carbs, and fat first.", true);
    return;
  }

  const name    = state.scannedProduct?.name || elements.mealName.value.trim() || "Scanned food";
  const brand   = state.scannedProduct?.brand  || "";
  const barcode = state.scannedProduct?.barcode || elements.barcodeInput?.value?.trim() || "";
  const serving = elements.labelServing?.value?.trim() || "1 serving";

  const pantry = getPantry();

  // Avoid exact duplicates (same barcode or same name+brand combo)
  const exists = pantry.find(f =>
    (barcode && f.barcode === barcode) ||
    (f.name.toLowerCase() === name.toLowerCase() && f.brand?.toLowerCase() === brand.toLowerCase())
  );
  if (exists) {
    // Update nutrition in case label has changed, bump useCount
    exists.nutrition = { calories, protein, carbs, fat };
    exists.serving   = serving;
    exists.updatedAt = new Date().toISOString();
    exists.useCount  = (exists.useCount || 0) + 1;
    exists.lastUsed  = new Date().toISOString();
    savePantry(pantry);
    setSaveFoodMessage("✓ Updated in your Pantry.");
    return;
  }

  // Auto-guess category from name/brand keywords
  const autoCategory = (() => {
    const hay = (name + " " + brand).toLowerCase();
    if (/starbucks|dunkin|mcdonald|chick.fil|wendy|burger|panera|subway|chipotle|five.guys|taco.bell/.test(hay)) return "restaurant";
    if (/trader joe|amy'?s|kodiak|rxbar|quest|kind bar|clif|fairlife|siggi/.test(hay)) return "packaged";
    if (/shake|smoothie|juice|coffee|latte|tea|water|milk|oat.?milk|protein.shake/.test(hay)) return "drinks";
    if (/yogurt|cheese|cottage|whey|dairy|kefir|cream/.test(hay)) return "dairy";
    if (/oatmeal|oats|waffle|pancake|bagel|toast|muffin|cereal|granola|french.toast/.test(hay)) return "breakfast";
    if (/salmon|tuna|chicken|beef|pork|shrimp|turkey|steak|lamb|egg/.test(hay)) return "protein";
    if (/salad|wrap|sandwich|bowl|soup|burrito|taco|panini/.test(hay)) return "lunch";
    if (/pasta|stir.fry|curry|enchilada|casserole|roast|bake/.test(hay)) return "dinner";
    if (/apple|banana|berry|grape|avocado|broccoli|spinach|kale|carrot|fruit|vegetable|veggie/.test(hay)) return "produce";
    if (/rice|quinoa|couscous|bread|noodle|grain|oat|corn/.test(hay)) return "grains";
    if (/nuts|bar|cracker|chip|pretzel|popcorn|hummus|edamame/.test(hay)) return "snack";
    return "other";
  })();

  const newItem = {
    id:        `pantry_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    name,
    brand,
    barcode,
    serving,
    category:  autoCategory,
    nutrition: { calories, protein, carbs, fat },
    savedAt:   new Date().toISOString(),
    lastUsed:  null,
    useCount:  0,
    useDates:  [],
  };

  pantry.unshift(newItem); // newest first
  savePantry(pantry);
  setSaveFoodMessage("✓ Saved to your Pantry.");
  queuePlanUpdate();
};

// ── Shared meal database — diverse pool covering homemade, chains & packaged
const LOCAL_MEALS = {
  BREAKFAST: [
    { name: "Oatmeal with banana & peanut butter",             kcal: 420, p: 15, c: 62, f: 13 },
    { name: "Scrambled eggs & whole wheat toast",              kcal: 380, p: 22, c: 30, f: 18 },
    { name: "Greek yogurt parfait with granola & berries",     kcal: 320, p: 18, c: 45, f:  7 },
    { name: "Protein smoothie — banana, milk & whey protein",  kcal: 390, p: 32, c: 44, f:  6 },
    { name: "Avocado toast with 2 fried eggs",                 kcal: 420, p: 18, c: 35, f: 22 },
    { name: "Overnight oats with chia seeds & honey",          kcal: 380, p: 14, c: 52, f: 12 },
    { name: "Cottage cheese bowl with fruit & almonds",        kcal: 310, p: 24, c: 30, f:  8 },
    { name: "Veggie omelette with feta & spinach",             kcal: 360, p: 26, c: 12, f: 24 },
    { name: "Açaí bowl with granola, banana & honey",          kcal: 460, p: 10, c: 76, f: 12 },
    { name: "Peanut butter & banana overnight oats",           kcal: 450, p: 18, c: 58, f: 16 },
    { name: "Smoked salmon & cream cheese on rye toast",       kcal: 400, p: 26, c: 36, f: 16 },
    { name: "Whole grain waffles with fresh berries",          kcal: 400, p: 12, c: 68, f:  9 },
    { name: "Breakfast burrito — eggs, black beans & salsa",   kcal: 490, p: 28, c: 54, f: 18 },
    { name: "Egg white scramble with mushrooms & peppers",     kcal: 280, p: 26, c: 18, f:  8 },
    { name: "Baked oatmeal with blueberries & walnuts",        kcal: 410, p: 12, c: 58, f: 15 },
    { name: "Sweet potato & egg breakfast hash",               kcal: 390, p: 20, c: 44, f: 14 },
    { name: "Chia seed pudding with mango & coconut",          kcal: 340, p: 10, c: 48, f: 12 },
    { name: "Buckwheat pancakes with fresh berries",           kcal: 420, p: 14, c: 68, f: 10 },
    { name: "Turkey & egg white breakfast wrap",               kcal: 360, p: 32, c: 30, f: 12 },
    { name: "Quinoa breakfast bowl with poached egg & avocado",kcal: 440, p: 22, c: 44, f: 18 },
    { name: "Smoked salmon & cucumber on rye crispbreads",     kcal: 310, p: 24, c: 28, f: 10 },
    { name: "Plain skyr with fresh berries & hemp seeds",      kcal: 250, p: 22, c: 28, f:  5 },
    { name: "Almond butter & banana on whole grain toast",     kcal: 390, p: 12, c: 52, f: 16 },
  ],

  LUNCH: [
    { name: "Grilled chicken salad with olive oil & lemon",    kcal: 480, p: 42, c: 16, f: 26 },
    { name: "Turkey, avocado & spinach wrap",                  kcal: 520, p: 35, c: 46, f: 20 },
    { name: "Tuna melt on whole wheat bread",                  kcal: 460, p: 38, c: 36, f: 14 },
    { name: "Brown rice bowl with black beans & salsa",        kcal: 510, p: 18, c: 84, f:  8 },
    { name: "Grilled chicken & quinoa power bowl",             kcal: 550, p: 45, c: 58, f: 12 },
    { name: "Lentil soup with whole grain bread",              kcal: 460, p: 22, c: 64, f:  8 },
    { name: "Baked salmon with roasted sweet potato",          kcal: 590, p: 45, c: 50, f: 20 },
    { name: "Turkey & hummus sandwich on sourdough",           kcal: 490, p: 30, c: 52, f: 16 },
    { name: "Caprese sandwich with fresh mozzarella",          kcal: 480, p: 22, c: 46, f: 22 },
    { name: "Roasted chicken, wild rice & roasted beet bowl",  kcal: 580, p: 42, c: 66, f: 16 },
    { name: "Cobb salad — egg, avocado, turkey & romaine",     kcal: 460, p: 36, c: 14, f: 28 },
    { name: "Tuna poke bowl with brown rice & avocado",        kcal: 560, p: 38, c: 62, f: 18 },
    { name: "Falafel bowl with hummus, cucumber & pita",       kcal: 540, p: 18, c: 72, f: 18 },
    { name: "Grilled shrimp tacos x2 on corn tortillas",       kcal: 480, p: 32, c: 52, f: 14 },
    { name: "Grilled chicken & veggie panini on whole grain",  kcal: 510, p: 36, c: 48, f: 16 },
    { name: "Nicoise salad — tuna, egg, olives & green beans", kcal: 440, p: 34, c: 22, f: 22 },
    { name: "Sesame tofu bowl with edamame & brown rice",      kcal: 520, p: 24, c: 68, f: 16 },
    { name: "Turkey meatball sub on whole wheat roll",         kcal: 530, p: 38, c: 54, f: 14 },
    { name: "Egg salad on whole grain with mixed greens",      kcal: 420, p: 24, c: 30, f: 22 },
    { name: "White bean & kale soup with sourdough",           kcal: 450, p: 20, c: 62, f: 10 },
    { name: "Greek salad with grilled chicken & tzatziki",     kcal: 490, p: 38, c: 24, f: 24 },
    { name: "Spelt wrap with roasted veggies & goat cheese",   kcal: 470, p: 18, c: 54, f: 18 },
  ],

  DINNER: [
    { name: "Grilled salmon, asparagus & brown rice",          kcal: 620, p: 48, c: 58, f: 18 },
    { name: "Lean beef & broccoli stir-fry with white rice",   kcal: 640, p: 42, c: 70, f: 20 },
    { name: "Turkey & veggie sheet-pan bake",                  kcal: 500, p: 46, c: 36, f: 16 },
    { name: "Lean ground turkey tacos x3 (corn shells)",       kcal: 580, p: 38, c: 50, f: 22 },
    { name: "Whole wheat pasta with marinara & lean beef",     kcal: 660, p: 40, c: 78, f: 18 },
    { name: "Shrimp stir-fry with jasmine rice & vegetables",  kcal: 560, p: 38, c: 64, f: 12 },
    { name: "Pork tenderloin with roasted root vegetables",    kcal: 500, p: 48, c: 28, f: 16 },
    { name: "Tofu & vegetable curry with basmati rice",        kcal: 550, p: 22, c: 76, f: 14 },
    { name: "Pulled chicken with slaw & brown rice",           kcal: 620, p: 44, c: 70, f: 16 },
    { name: "Seared tuna with edamame & miso rice",            kcal: 560, p: 52, c: 54, f: 12 },
    { name: "Lamb kofta with tzatziki & whole grain couscous", kcal: 630, p: 40, c: 58, f: 24 },
    { name: "Black bean & sweet potato enchiladas (x2)",       kcal: 580, p: 20, c: 84, f: 16 },
    { name: "Chicken tikka masala with basmati rice",          kcal: 680, p: 44, c: 72, f: 22 },
    { name: "Sesame noodles with edamame & soft-boiled egg",   kcal: 540, p: 24, c: 72, f: 16 },
    { name: "Baked cod with lemon, capers & roasted broccoli", kcal: 420, p: 46, c: 18, f: 14 },
    { name: "Chicken & vegetable soup with crusty bread",      kcal: 480, p: 34, c: 52, f: 12 },
    { name: "Pesto chicken with cherry tomatoes & pasta",      kcal: 620, p: 42, c: 62, f: 20 },
    { name: "Moroccan chickpea stew with whole grain couscous",kcal: 520, p: 20, c: 78, f: 12 },
    { name: "Grilled flank steak with chimichurri & peppers",  kcal: 540, p: 48, c: 16, f: 28 },
    { name: "Thai green curry with shrimp & jasmine rice",     kcal: 580, p: 36, c: 66, f: 16 },
    { name: "Baked chicken thighs with roasted sweet potato",  kcal: 560, p: 44, c: 48, f: 18 },
    { name: "Stuffed bell peppers with lean beef & quinoa",    kcal: 500, p: 36, c: 46, f: 16 },
  ],

  SNACK: [
    { name: "Apple with 2 tbsp almond butter",                 kcal: 260, p:  6, c: 34, f: 13 },
    { name: "Plain Greek yogurt with honey & walnuts",         kcal: 240, p: 17, c: 26, f:  8 },
    { name: "Mixed nuts & dried cranberries (40g)",            kcal: 290, p:  8, c: 22, f: 22 },
    { name: "Cottage cheese with pineapple chunks",            kcal: 210, p: 20, c: 26, f:  2 },
    { name: "Rice cakes with peanut butter & banana slices",   kcal: 290, p:  8, c: 40, f: 10 },
    { name: "2 hard-boiled eggs & whole grain crackers",       kcal: 260, p: 16, c: 20, f: 12 },
    { name: "Steamed edamame (1 cup) with sea salt",           kcal: 190, p: 17, c: 14, f:  8 },
    { name: "Sliced cucumber & bell pepper with hummus",       kcal: 170, p:  6, c: 20, f:  8 },
    { name: "Turkey & lettuce roll-ups (4 rolls)",             kcal: 210, p: 18, c:  6, f: 12 },
    { name: "Part-skim string cheese & a small apple",         kcal: 190, p: 10, c: 24, f:  6 },
    { name: "Protein shake with unsweetened oat milk",         kcal: 240, p: 28, c: 18, f:  5 },
    { name: "Oat & almond energy balls (3)",                   kcal: 270, p:  8, c: 34, f: 12 },
    { name: "Banana with 1 tbsp cashew butter",                kcal: 220, p:  4, c: 34, f:  8 },
    { name: "Tuna on whole grain crispbreads (3)",             kcal: 230, p: 24, c: 20, f:  6 },
    { name: "Plain skyr with fresh mixed berries",             kcal: 180, p: 16, c: 22, f:  2 },
    { name: "Walnut & date trail mix (1 oz)",                  kcal: 280, p:  5, c: 30, f: 16 },
    { name: "Sliced turkey & cucumber rounds",                 kcal: 180, p: 20, c:  8, f:  6 },
    { name: "Roasted chickpeas with sea salt (½ cup)",         kcal: 200, p: 10, c: 30, f:  4 },
    { name: "Frozen Greek yogurt bark with berries",           kcal: 190, p: 12, c: 24, f:  4 },
    { name: "Celery with natural peanut butter (2 tbsp)",      kcal: 200, p:  8, c: 12, f: 14 },
    { name: "Chocolate protein shake (1 scoop, water)",        kcal: 150, p: 25, c:  8, f:  2 },
    { name: "Sliced avocado on whole grain rice cakes",        kcal: 230, p:  4, c: 26, f: 12 },
  ],
};

const SLOT_PORTIONS = { BREAKFAST: 0.25, LUNCH: 0.30, DINNER: 0.30, SNACK: 0.15 };

// ── Smart meal pick: blend pantry favourites into the suggestion pool ─────
// Pantry items used 3+ times get a weighted slot in the pool.
// 40% chance of picking a pantry item (when available), 60% from built-in pool.
const pickMealsForSlot = (slot) => {
  const builtIn = LOCAL_MEALS[slot] || [];

  // Pull pantry items that have been used at least twice (learned preference)
  const pantry = getPantry();
  const pantryFaves = pantry
    .filter(f => (f.useCount || 0) >= 2 && f.nutrition?.calories > 0)
    .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
    .slice(0, 6) // cap at top 6 pantry items
    .map(f => ({
      name:  f.brand ? `${f.name} (${f.brand})` : f.name,
      kcal:  f.nutrition.calories,
      p:     f.nutrition.protein  || 0,
      c:     f.nutrition.carbs    || 0,
      f:     f.nutrition.fat      || 0,
      _pantryId: f.id,
    }));

  // 40% chance to surface a pantry favourite if any exist
  if (pantryFaves.length && Math.random() < 0.4) {
    const pick = pantryFaves[Math.floor(Math.random() * pantryFaves.length)];
    return [pick];
  }

  if (!builtIn.length) return [];
  const meal = builtIn[Math.floor(Math.random() * builtIn.length)];
  return meal ? [meal] : [];
};

const buildLocalSuggestions = (remainingKcal) => {
  const kcal = Math.max(remainingKcal, 800); // floor so suggestions still show
  return Object.entries(SLOT_PORTIONS).map(([slot]) => {
    const meals = pickMealsForSlot(slot);
    return {
      slot,
      options: meals.map(m => ({
        items: [{
          name:       m.name,
          servingQty: 1,
          servingUnit: "serving",
          calories:   m.kcal,
          proteinG:   m.p,
          carbsG:     m.c,
          fatG:       m.f,
        }]
      })),
    };
  });
};

const renderPlanSuggestions = (plan) => {
  if (!elements.planSuggestions) return;
  elements.planSuggestions.innerHTML = "";

  if (!plan?.suggestions?.length) {
    const empty = document.createElement("p");
    empty.className = "plan-empty";
    empty.style.cssText = "grid-column:span 2;font-size:0.85rem";
    empty.textContent = "No suggestions yet. Log a few foods to unlock ideas.";
    elements.planSuggestions.appendChild(empty);
    return;
  }

  plan.suggestions.forEach((slot) => {
    const slotCard = document.createElement("div");
    slotCard.className = "plan-slot";

    // Meal label tag
    const tag = document.createElement("p");
    tag.className = "plan-slot-tag";
    tag.textContent = PLAN_SLOT_LABELS[slot.slot] || slot.slot || "Meal";
    slotCard.appendChild(tag);

    const option = slot.options?.[0];
    if (!option?.items?.length) {
      const empty = document.createElement("p");
      empty.className = "plan-empty";
      empty.textContent = "No suggestion yet.";
      slotCard.appendChild(empty);
      elements.planSuggestions.appendChild(slotCard);
      return;
    }

    // Item names
    const content = document.createElement("div");
    content.className = "plan-slot-content";
    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    option.items.forEach((item) => {
      const nameLine = document.createElement("div");
      nameLine.className = "plan-slot-item-name";
      const qty  = item.servingQty  ? `${formatQuantity(item.servingQty)} ` : "";
      const unit = item.servingUnit ? item.servingUnit.toLowerCase() : "serving";
      nameLine.textContent = `${item.name} · ${qty}${unit}`;
      content.appendChild(nameLine);
      totalCal += item.calories  || 0;
      totalP   += item.proteinG  || 0;
      totalC   += item.carbsG    || 0;
      totalF   += item.fatG      || 0;
    });
    slotCard.appendChild(content);

    // Footer: kcal + macro chips
    const footer = document.createElement("div");
    footer.className = "plan-slot-footer";

    const kcalEl = document.createElement("span");
    kcalEl.className = "plan-slot-kcal";
    kcalEl.textContent = `${Math.round(totalCal)} kcal`;
    footer.appendChild(kcalEl);

    const macroRow = document.createElement("div");
    macroRow.className = "plan-slot-macros";
    [
      { val: Math.round(totalP), label: "P", cls: "plan-macro-p" },
      { val: Math.round(totalC), label: "C", cls: "plan-macro-c" },
      { val: Math.round(totalF), label: "F", cls: "plan-macro-f" },
    ].forEach(({ val, label, cls }) => {
      const chip = document.createElement("span");
      chip.className = `plan-macro-chip ${cls}`;
      chip.textContent = `${val}${label}`;
      macroRow.appendChild(chip);
    });
    footer.appendChild(macroRow);
    slotCard.appendChild(footer);

    // Make card clickable → open meal detail modal
    slotCard.style.cursor = "pointer";
    slotCard.setAttribute("title", "Tap for recipe & swaps");
    slotCard.addEventListener("click", () => {
      if (typeof openMealModal === "function") {
        openMealModal({
          name:  option.items[0]?.name || (slot.slot || "Meal"),
          slot:  slot.slot || "custom",
          kcal:  totalCal,
          p:     totalP,
          c:     totalC,
          f:     totalF,
        });
      }
    });

    elements.planSuggestions.appendChild(slotCard);
  });
};

let planUpdateTimer = null;

const requestPlanSuggestions = async (dateKey) => {
  try {
    const plan = await apiFetch("/api/plans/generate-ai", {
      method: "POST",
      body: JSON.stringify({ date: dateKey }),
    });
    const source = plan?.source === "rules" ? "rules" : "ai";
    return { plan, source };
  } catch (error) {
    const message = error.message || "";
    if (
      message.includes("Pro subscription required") ||
      message.includes("AI planner") ||
      message.includes("No foods available")
    ) {
      const plan = await apiFetch("/api/plans/generate", {
        method: "POST",
        body: JSON.stringify({ date: dateKey }),
      });
      return {
        plan,
        source: "rules",
        proRequired: message.includes("Pro subscription required"),
        noFoodsForAi: message.includes("No foods available"),
      };
    }
    throw error;
  }
};

const updatePlanForToday = async () => {
  if (!elements.planStatus) return;

  // ── Local fallback: show real meal ideas even without sign-in ──
  if (!state.isAuthenticated) {
    const targetRaw   = elements.targetValue?.textContent?.replace(/,/g, "") || "0";
    const targetKcal  = Number.parseFloat(targetRaw) || 2000;
    const loggedKcal  = Number.parseFloat(elements.dailyTotal?.textContent?.replace(/,/g, "") || "0") || 0;
    const remainKcal  = Math.max(targetKcal - loggedKcal, 0);

    const localPlan = {
      remaining: { calories: remainKcal, proteinG: 0, carbsG: 0, fatG: 0 },
      suggestions: buildLocalSuggestions(remainKcal || targetKcal),
    };

    if (elements.remainingCalories) elements.remainingCalories.textContent = Math.round(remainKcal).toLocaleString();
    renderPlanSuggestions(localPlan);
    setPlanStatus("Meal ideas based on your calorie target. Sign in to unlock AI suggestions.");
    return;
  }

  const dateKey = getTodayKey();

  try {
    setPlanStatus("Generating suggestions...");
    const result = await requestPlanSuggestions(dateKey);
    const plan = result.plan;

    const remaining = plan.remaining || {};
    if (elements.remainingCalories) {
      elements.remainingCalories.textContent = formatMacro(remaining.calories);
    }
    if (elements.remainingProtein) {
      elements.remainingProtein.textContent = formatMacro(remaining.proteinG, "g");
    }
    if (elements.remainingCarbs) {
      elements.remainingCarbs.textContent = formatMacro(remaining.carbsG, "g");
    }
    if (elements.remainingFat) {
      elements.remainingFat.textContent = formatMacro(remaining.fatG, "g");
    }

    if (result.source === "ai") {
      // AI gave us real varied suggestions — use them
      renderPlanSuggestions(plan);
      setPlanStatus("AI suggestions ready.");
    } else {
      // Rules-based path only has the user's scanned foods (often repetitive).
      // Use the local real-meal database instead, keeping the API's remaining macros.
      const localPlan = {
        remaining,
        suggestions: buildLocalSuggestions(remaining.calories || 2000),
      };
      renderPlanSuggestions(localPlan);
      if (result.proRequired) {
        setPlanStatus("Meal ideas based on your target. Upgrade to Pro for AI suggestions.", false);
      } else {
        setPlanStatus("Meal ideas based on your remaining calories.");
      }
    }
  } catch (error) {
    const message = error.message || "Unable to load plan suggestions.";
    if (message.includes("No goal configured")) {
      const target = Number.parseFloat(elements.targetValue.textContent.replace(/,/g, ""));
      if (!Number.isFinite(target)) {
        clearPlanUI();
        setPlanStatus("Add your profile details to generate a plan.", true);
        return;
      }
      try {
        await apiFetch("/api/goals", {
          method: "POST",
          body: JSON.stringify(buildGoalPayloadFromTarget(target)),
        });
        await updatePlanForToday();
        return;
      } catch (goalError) {
        clearPlanUI();
        setPlanStatus(goalError.message || "Unable to save goals.", true);
        return;
      }
    }

    // Fallback to local meal suggestions on any other API error
    const targetRaw  = elements.targetValue?.textContent?.replace(/,/g, "") || "0";
    const targetKcal = Number.parseFloat(targetRaw) || 2000;
    const loggedKcal = Number.parseFloat(elements.dailyTotal?.textContent?.replace(/,/g, "") || "0") || 0;
    const remainKcal = Math.max(targetKcal - loggedKcal, 0);
    const localPlan  = {
      remaining: { calories: remainKcal, proteinG: 0, carbsG: 0, fatG: 0 },
      suggestions: buildLocalSuggestions(remainKcal || targetKcal),
    };
    if (elements.remainingCalories) elements.remainingCalories.textContent = Math.round(remainKcal).toLocaleString();
    renderPlanSuggestions(localPlan);
    setPlanStatus("Showing local meal ideas. Sign in for personalised AI suggestions.");
  }
};

const queuePlanUpdate = () => {
  if (!elements.planStatus) return;
  if (planUpdateTimer) clearTimeout(planUpdateTimer);
  planUpdateTimer = setTimeout(updatePlanForToday, 800);
};

const renderLog = () => {
  const dateKey = typeof getViewDateKey === "function" ? getViewDateKey() : getTodayKey();
  const todaysLog = state.log.filter((entry) => entry.date === dateKey);

  elements.logList.innerHTML = "";

  if (todaysLog.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No meals logged yet.";
    elements.logList.appendChild(empty);
    elements.dailyTotal.textContent = "0";
    updateRemaining();
    return;
  }

  let total = 0, totalP = 0, totalC = 0, totalF = 0;
  todaysLog.forEach((entry) => {
    total  += entry.calories || 0;
    totalP += entry.protein  || 0;
    totalC += entry.carbs    || 0;
    totalF += entry.fat      || 0;
    const item = document.createElement("div");
    item.className = "log-item";

    const meta = document.createElement("div");
    meta.className = "log-meta";

    const row = document.createElement("div");
    row.className = "log-row";

    const title = document.createElement("strong");
    title.textContent = entry.name || "Meal";

    const typeLabel = MEAL_LABELS[entry.type] || "Meal";
    const typePill = document.createElement("span");
    typePill.className = "meal-pill";
    typePill.textContent = typeLabel;

    const info = document.createElement("span");
    const timeSource = entry.timestamp || entry.created_at || Date.now();
    const time = new Date(timeSource).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const hasMacros = (entry.protein || entry.carbs || entry.fat);
    const macroStr  = hasMacros
      ? ` · ${entry.protein || 0}P ${entry.carbs || 0}C ${entry.fat || 0}F`
      : "";
    info.textContent = `${entry.calories} kcal${macroStr} · ${time}`;

    row.appendChild(title);
    row.appendChild(typePill);
    meta.appendChild(row);
    meta.appendChild(info);

    const remove = document.createElement("button");
    remove.className = "button ghost";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", async () => {
      if (!state.isAuthenticated) {
        removeLocalLogEntry(entry.id, entry.date || getTodayKey());
        state.log = state.log.filter((item) => item.id !== entry.id);
        renderLog();
        queuePlanUpdate();
        return;
      }

      try {
        await apiFetch(`/api/meals/${entry.id}`, { method: "DELETE" });
        state.log = state.log.filter((item) => item.id !== entry.id);
        renderLog();
      } catch (error) {
        setAuthMessage("Unable to delete meal.", true);
      }
    });

    item.appendChild(meta);
    item.appendChild(remove);
    elements.logList.appendChild(item);
  });

  elements.dailyTotal.textContent = Math.round(total).toLocaleString();

  // Feed macro totals to the dashboard arc rings via hidden data elements
  const dpEl = document.getElementById("daily-protein");
  const dcEl = document.getElementById("daily-carbs");
  const dfEl = document.getElementById("daily-fat");
  if (dpEl) dpEl.textContent = Math.round(totalP);
  if (dcEl) dcEl.textContent = Math.round(totalC);
  if (dfEl) dfEl.textContent = Math.round(totalF);

  updateRemaining();

  // Update macro tracker from local totals (unauthenticated path)
  if (!state.isAuthenticated && (totalP || totalC || totalF)) {
    const targetRaw  = elements.targetValue?.textContent?.replace(/,/g, "") || "0";
    const targetKcal = Number.parseFloat(targetRaw) || 2000;
    const remainKcal = Math.max(targetKcal - total, 0);
    if (elements.remainingCalories) elements.remainingCalories.textContent = Math.round(remainKcal).toLocaleString();
    if (elements.remainingProtein)  elements.remainingProtein.textContent  = `${Math.round(totalP)}g`;
    if (elements.remainingCarbs)    elements.remainingCarbs.textContent    = `${Math.round(totalC)}g`;
    if (elements.remainingFat)      elements.remainingFat.textContent      = `${Math.round(totalF)}g`;
  }
};

const collectProfileFromForm = () => ({
  units: getUnitSystem(),
  age: parseNumber(elements.age.value),
  sex: elements.sex.value,
  heightFt: parseNumber(elements.heightFt.value),
  heightIn: parseNumber(elements.heightIn.value),
  heightCm: parseNumber(elements.heightCm.value),
  weightLb: parseNumber(elements.weightLb.value),
  weightKg: parseNumber(elements.weightKg.value),
  activity: parseNumber(elements.activity.value),
  goalPreset: elements.goalPreset.value,
  adjustment: parseNumber(elements.adjustment.value) || 0,
});

let profileSaveTimer = null;

const buildProfilePayload = (profile) => {
  const unit = profile.units || "us";
  let heightCm = profile.heightCm;
  let weightKg = profile.weightKg;

  if (unit === "us") {
    if (Number.isFinite(profile.heightFt) && Number.isFinite(profile.heightIn)) {
      heightCm = (profile.heightFt * 12 + profile.heightIn) * 2.54;
    }
    if (Number.isFinite(profile.weightLb)) {
      weightKg = profile.weightLb / 2.20462;
    }
  }

  const payload = {
    units: unit,
    age: Number.isFinite(profile.age) ? profile.age : undefined,
    sex: profile.sex || undefined,
    heightCm: Number.isFinite(heightCm) ? Math.round(heightCm) : undefined,
    weightKg: Number.isFinite(weightKg) ? Math.round(weightKg) : undefined,
    activityLevel: Number.isFinite(profile.activity) ? profile.activity : undefined,
    goalPreset: profile.goalPreset || undefined,
    adjustment: Number.isFinite(profile.adjustment) ? Math.round(profile.adjustment) : 0,
  };

  return payload;
};

const persistProfile = async (profile) => {
  const data = await apiFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify(buildProfilePayload(profile)),
  });
  state.profile = normalizeProfile(data.profile ?? data ?? profile);
  return state.profile;
};

const queueProfileSave = (profile) => {
  if (!state.isAuthenticated) return;
  if (profileSaveTimer) clearTimeout(profileSaveTimer);
  profileSaveTimer = setTimeout(async () => {
    try {
      await persistProfile(profile);
      updateTargetsUI();
    } catch (error) {
      setAuthMessage("Unable to save profile.", true);
    }
  }, 600);
};

const saveProfile = () => {
  const profile = collectProfileFromForm();
  state.profile = normalizeProfile(profile);
  updateTargetsUI();

  if (state.isAuthenticated) {
    queueProfileSave(profile);
    return;
  }
};

const loadProfileFromServer = async () => {
  try {
    const data = await apiFetch("/api/profile");
    const profile = normalizeProfile(data.profile ?? data);
    if (!profile) return;
    state.profile = profile;
    applyProfileToForm(profile);
    updateTargetsUI();
  } catch (error) {
    setAuthMessage("Unable to load profile.", true);
  }
};

const handleEditTargets = () => {
  state.profileEditMode = true;
  setTargetsMessage("");
  updateTargetsUI();
};

const handleAuthEditStats = () => {
  handleEditTargets();
  const targetsPanel = document.getElementById("profile-form");
  if (targetsPanel) {
    targetsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const setTargetsSavingState = (isSaving) => {
  if (!elements.targetsSave) return;
  elements.targetsSave.disabled = isSaving;
  elements.targetsSave.textContent = isSaving ? "Saving..." : "Save stats";
};

const handleSaveTargets = async () => {
  if (!state.isAuthenticated) {
    await requireAuth(() => handleSaveTargets(), { message: "You need an account to save changes." });
    return;
  }

  const profile = collectProfileFromForm();
  state.profile = normalizeProfile(profile);

  if (profileSaveTimer) clearTimeout(profileSaveTimer);
  if (goalSaveTimer) clearTimeout(goalSaveTimer);

  try {
    setTargetsSavingState(true);
    const targetCalories = calculateTargets({ saveGoal: false });
    if (!Number.isFinite(targetCalories)) {
      setTargetsMessage("Enter complete stats before saving.", true);
      return;
    }

    await persistProfile(profile);
    await saveGoalForTarget(targetCalories);
    state.profileEditMode = false;
    setTargetsMessage("Stats saved.");
    setAuthMessage("Stats saved.");
    updateGoalLabel();
    updateUnitVisibility();
    calculateTargets({ saveGoal: false });
    updateTargetsUI();
  } catch (error) {
    const message = error.message || "Unable to save stats.";
    setTargetsMessage(message, true);
    setAuthMessage(message, true);
  } finally {
    setTargetsSavingState(false);
  }
};

const loadAuth = async () => {
  authDebugLog("loadAuth:start", {
    hasAccessToken: Boolean(getStoredToken()),
    hasRefreshToken: Boolean(getStoredRefreshToken()),
  });
  setAuthViewState("loadingAuth");
  updateAuthUI();

  if (!getStoredToken() && !getStoredRefreshToken()) {
    setAuthState(null);
    state.profileEditMode = false;
    updateAuthUI();
    await loadLogForToday();
    if (state.pendingAction) {
      promptAuthForAction("You need an account to save changes.");
    }
    authDebugLog("loadAuth:end:signedOut(no tokens)");
    return;
  }
  try {
    const data = await apiFetch("/api/auth/me");
    setAuthState(data.user);
    state.profileEditMode = false;
    updateAuthUI();
    await loadProfileFromServer();
    await loadLogForToday();
    await runPendingAction();
    authDebugLog("loadAuth:end:signedIn", { email: state.user?.email || null });
  } catch (error) {
    setAuthState(null);
    state.profileEditMode = false;
    updateAuthUI();
    await loadLogForToday();
    if (state.pendingAction) {
      promptAuthForAction("You need an account to save changes.");
    }
    authDebugLog("loadAuth:end:signedOut(error)", { error: error?.message || String(error) });
  }
};

const handleRegister = async () => {
  const name = elements.authSignupName?.value?.trim() || "";
  const email = elements.authSignupEmail?.value?.trim() || "";
  const password = elements.authSignupPassword?.value || "";
  if (!email || !password) {
    setAuthMessage("Email and password are required.", true);
    return;
  }

  try {
    const data = await apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setAuthState(data.user);
    state.profileEditMode = false;
    setStoredTokens(data.accessToken, data.refreshToken);
    setAuthMessage("Account created. You're signed in.");
    updateAuthUI();
    await loadProfileFromServer();
    updateUnitVisibility();
    updateGoalLabel();
    calculateTargets();
    await loadLogForToday();
    await runPendingAction();
  } catch (error) {
    setAuthMessage(error.message || "Registration failed.", true);
  }
};

const handleLogin = async () => {
  const email = elements.authLoginEmail?.value?.trim() || "";
  const password = elements.authLoginPassword?.value || "";
  if (!email || !password) {
    setAuthMessage("Email and password are required.", true);
    return;
  }

  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAuthState(data.user);
    state.profileEditMode = false;
    setStoredTokens(data.accessToken, data.refreshToken);
    setAuthMessage("Signed in.");
    updateAuthUI();
    await loadProfileFromServer();
    updateUnitVisibility();
    updateGoalLabel();
    calculateTargets();
    await loadLogForToday();
    await runPendingAction();
  } catch (error) {
    const message = error.message || "Login failed.";
    if (message.toLowerCase().includes("no account")) {
      setAuthMessage("No account found for this email. Use Create account to get started.", true);
      setAuthMode("signup");
      return;
    }
    setAuthMessage(message, true);
  }
};

const handleLogout = async () => {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    // Ignore logout errors.
  }
  clearStoredAuth();
  setAuthState(null);
  state.profileEditMode = false;
  state.pendingAction = null;
  updateAuthUI();
  setAuthMessage("Signed out.");
  state.profile = null;
  updateUnitVisibility();
  updateGoalLabel();
  calculateTargets();
  await loadLogForToday();
  clearPlanUI();
  setPlanStatus("Sign in to generate suggestions.");
};

const updateAdjustmentForPreset = () => {
  const preset = elements.goalPreset.value;
  if (preset === "custom") return;
  const presetData = GOAL_PRESETS[preset];
  if (presetData) {
    elements.adjustment.value = presetData.adjustment;
  }
};

const parseNutritionText = (text) => {
  const lines = text
    .split(/\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const upperLines = lines.map((line) => line.toUpperCase());
  const result = {
    calories: null,
    servingSize: null,
    servingsPerContainer: null,
    fat: null,
    carbs: null,
    protein: null,
  };

  upperLines.forEach((line, index) => {
    if (!result.calories && line.includes("CALORIES") && !line.includes("FROM")) {
      const match = line.match(/CALORIES\D*([0-9]{1,4})/);
      if (match) {
        result.calories = Number.parseInt(match[1], 10);
      } else if (upperLines[index + 1]) {
        const nextMatch = upperLines[index + 1].match(/([0-9]{1,4})/);
        if (nextMatch) {
          result.calories = Number.parseInt(nextMatch[1], 10);
        }
      }
    }

    if (!result.servingSize && line.includes("SERVING SIZE")) {
      const match = lines[index].match(/SERVING SIZE\s*(.*)/i);
      if (match && match[1]) {
        result.servingSize = match[1].trim();
      }
    }

    if (!result.servingsPerContainer && line.includes("SERVINGS PER CONTAINER")) {
      const match = line.match(/SERVINGS? PER CONTAINER\D*([0-9]+(?:\.[0-9]+)?)/);
      if (match) {
        result.servingsPerContainer = Number.parseFloat(match[1]);
      }
    }
  });

  const extractMacro = (keyword, altKeywords = [], disallow = []) => {
    for (let i = 0; i < upperLines.length; i += 1) {
      const line = upperLines[i];
      const original = lines[i];
      if (disallow.some((word) => line.includes(word))) {
        continue;
      }
      if ([keyword, ...altKeywords].some((key) => line.includes(key))) {
        const match = original.match(/([0-9]+(?:\.[0-9]+)?)\s*g/i);
        if (match) {
          return Number.parseFloat(match[1]);
        }
        const fallback = original.match(/([0-9]+(?:\.[0-9]+)?)/);
        if (fallback) {
          return Number.parseFloat(fallback[1]);
        }
      }
    }
    return null;
  };

  result.fat = extractMacro("TOTAL FAT", ["FAT"], ["SATURATED", "TRANS"]);
  result.carbs = extractMacro(
    "TOTAL CARBOHYDRATE",
    ["TOTAL CARB", "CARBOHYDRATE", "CARB"],
    ["FIBER", "SUGAR", "SUGARS"]
  );
  result.protein = extractMacro("PROTEIN");

  if (!result.calories) {
    const caloriesMatch = text.toUpperCase().match(/CALORIES\s*([0-9]{1,4})/);
    if (caloriesMatch) {
      result.calories = Number.parseInt(caloriesMatch[1], 10);
    }
  }

  return result;
};

const updateMealSummary = () => {
  const perServing = parseNumber(elements.labelCalories.value) || 0;
  const servings = parseNumber(elements.servingsEaten.value) || 0;
  const override = parseNumber(elements.caloriesOverride.value);
  const calories = override ? override : perServing * servings;

  const fat = parseNumber(elements.labelFat.value) || 0;
  const carbs = parseNumber(elements.labelCarbs.value) || 0;
  const protein = parseNumber(elements.labelProtein.value) || 0;
  const macroCalories = fat * 9 + carbs * 4 + protein * 4;

  elements.mealCalories.textContent = Math.round(calories || 0).toLocaleString();
  elements.macroCheck.textContent = Math.round(macroCalories || 0).toLocaleString();

  if (macroCalories && calories) {
    const diff = Math.abs(macroCalories - calories);
    if (diff >= 60) {
      elements.macroMismatch.textContent =
        "Macro calories differ from label calories. Double-check OCR values.";
    } else {
      elements.macroMismatch.textContent = "";
    }
  } else {
    elements.macroMismatch.textContent = "";
  }
};

const addMealToLog = async () => {
  // Always recompute from inputs — never rely on potentially stale display element
  updateMealSummary();

  const servings  = parseNumber(elements.servingsEaten.value) || 1;
  const perServing = parseNumber(elements.labelCalories.value) || 0;
  const override  = parseNumber(elements.caloriesOverride.value);
  const calories  = override ? override : Math.round(perServing * servings);
  if (!calories) return;

  const protein  = Math.round((parseNumber(elements.labelProtein.value) || 0) * servings);
  const carbs    = Math.round((parseNumber(elements.labelCarbs.value)   || 0) * servings);
  const fat      = Math.round((parseNumber(elements.labelFat.value)     || 0) * servings);

  const entry = {
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
    name: elements.mealName.value.trim() || "Meal",
    type: elements.mealType?.value || "custom",
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
    date: getTodayKey(),
    timestamp: Date.now(),
  };

  // ── Local save — no auth required ────────────────────────────────────────
  if (!state.isAuthenticated) {
    addLocalLogEntry(entry);
    state.log = [entry, ...state.log];
    renderLog();
    queuePlanUpdate();
    elements.mealName.value = "";
    elements.caloriesOverride.value = "";
    updateMealNameFromType();
    return;
  }

  try {
    const mealSlot = entry.type ? entry.type.toUpperCase() : "CUSTOM";
    const loggedAt = new Date().toISOString();
    const meal = await apiFetch("/api/meals", {
      method: "POST",
      body: JSON.stringify({
        loggedAt,
        mealSlot,
        customSlotName: mealSlot === "CUSTOM" ? entry.name : undefined,
      }),
    });

    const servings = parseNumber(elements.servingsEaten.value) || 1;
    const nutritionPayload = {
      caloriesPerServing: entry.calories,
      proteinG: (parseNumber(elements.labelProtein.value) || 0) * servings,
      carbsG: (parseNumber(elements.labelCarbs.value) || 0) * servings,
      fatG: (parseNumber(elements.labelFat.value) || 0) * servings,
    };

    const servingName = elements.labelServing.value?.trim() || "1 serving";
    const food = await apiFetch("/api/foods", {
      method: "POST",
      body: JSON.stringify({
        name: entry.name,
        source: "MANUAL",
        servings: [{ labelServingName: servingName }],
        nutrition: nutritionPayload,
      }),
    });

    await apiFetch(`/api/meals/${meal.id}/items`, {
      method: "POST",
      body: JSON.stringify({
        foodId: food.id,
        servingQty: 1,
        servingUnit: "SERVING",
      }),
    });

    entry.id = meal.id;
    entry.timestamp = loggedAt;
    state.log = [entry, ...state.log];
    renderLog();
    queuePlanUpdate();
  } catch (error) {
    // API failed — fall back to local storage so the entry isn't lost
    console.warn("API save failed, saving locally:", error);
    addLocalLogEntry(entry);
    state.log = [entry, ...state.log];
    renderLog();
    queuePlanUpdate();
    setAuthMessage("Saved locally (server unavailable). It will sync later.", true);
  }

  elements.mealName.value = "";
  elements.caloriesOverride.value = "";
  updateMealNameFromType();
};

const runOcr = async (file) => {
  if (!window.Tesseract) {
    elements.ocrMessage.textContent = "OCR engine not available.";
    return;
  }

  elements.ocrMessage.textContent = "Running OCR...";
  elements.ocrProgress.hidden = false;
  elements.ocrProgress.value = 0;

  try {
    const result = await Tesseract.recognize(file, "eng", {
      logger: (progress) => {
        if (progress && progress.progress) {
          elements.ocrProgress.value = progress.progress;
        }
      },
    });

    const text = result?.data?.text || "";
    elements.ocrRawText.textContent = text || "No text detected.";

    const parsed = parseNutritionText(text || "");
    if (parsed.calories !== null) elements.labelCalories.value = parsed.calories;
    if (parsed.servingSize) elements.labelServing.value = parsed.servingSize;
    if (parsed.servingsPerContainer !== null) elements.labelServings.value = parsed.servingsPerContainer;
    if (parsed.fat !== null) elements.labelFat.value = parsed.fat;
    if (parsed.carbs !== null) elements.labelCarbs.value = parsed.carbs;
    if (parsed.protein !== null) elements.labelProtein.value = parsed.protein;

    elements.ocrMessage.textContent = "OCR complete. Review the values.";
    updateMealSummary();
  } catch (error) {
    elements.ocrMessage.textContent = "OCR failed. Try another photo.";
  } finally {
    elements.ocrProgress.hidden = true;
  }
};

const handleLabelUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  state.scannedProduct = null;
  const previewUrl = URL.createObjectURL(file);
  elements.labelPreview.src = previewUrl;
  elements.previewWrap.hidden = false;
  elements.ocrMessage.textContent = "Preparing OCR...";
  elements.ocrRawText.textContent = "Processing...";

  runOcr(file);
};

const clearTodayLog = async () => {
  if (!state.isAuthenticated) {
    await requireAuth(() => clearTodayLog(), { message: "You need an account to save changes." });
    return;
  }

  const today = getTodayKey();

  const todaysLog = state.log.filter((entry) => entry.date === today);
  try {
    await Promise.all(
      todaysLog.map((entry) => apiFetch(`/api/meals/${entry.id}`, { method: "DELETE" }))
    );
    state.log = state.log.filter((entry) => entry.date !== today);
    renderLog();
    queuePlanUpdate();
  } catch (error) {
    setAuthMessage("Unable to clear today's meals.", true);
  }
};

const initScrollButtons = () => {
  elements.scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-scroll");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
};

const init = async () => {
  authInitCount += 1;
  authDebugLog("init:called", { authInitCount });
  if (appInitialized) {
    authDebugLog("init:skipped duplicate call");
    return;
  }
  appInitialized = true;

  if (!elements.profileForm) return;

  await loadAuth();
  updateUnitVisibility();
  updateGoalLabel();
  updateAdjustmentForPreset();
  calculateTargets();
  updateTargetsUI();
  updateMacroCalories();
  updateMealSummary();
  initScrollButtons();
  initDropdowns();

  if (elements.mealType) {
    updateMealNameFromType();
    elements.mealType.addEventListener("change", updateMealNameFromType);
  }

  if (elements.authRegister) {
    elements.authRegister.addEventListener("click", handleRegister);
  }
  if (elements.authLogin) {
    elements.authLogin.addEventListener("click", handleLogin);
  }
  if (elements.authModeSignin) {
    elements.authModeSignin.addEventListener("click", () => {
      setAuthMessage("");
      setAuthMode("signin");
    });
  }
  if (elements.authModeSignup) {
    elements.authModeSignup.addEventListener("click", () => {
      setAuthMessage("");
      setAuthMode("signup");
    });
  }
  if (elements.authLogout) {
    elements.authLogout.addEventListener("click", handleLogout);
  }
  if (elements.authEditStats) {
    elements.authEditStats.addEventListener("click", handleAuthEditStats);
  }
  if (elements.targetsEdit) {
    elements.targetsEdit.addEventListener("click", handleEditTargets);
  }
  if (elements.targetsSave) {
    elements.targetsSave.addEventListener("click", handleSaveTargets);
  }

  elements.unitRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      setTargetsMessage("");
      updateUnitVisibility();
      saveProfile();
      calculateTargets();
    });
  });

  elements.profileForm.addEventListener("input", () => {
    setTargetsMessage("");
    saveProfile();
    calculateTargets();
  });

  elements.goalPreset.addEventListener("change", () => {
    setTargetsMessage("");
    updateAdjustmentForPreset();
    updateGoalLabel();
    saveProfile();
    calculateTargets();
  });

  elements.adjustment.addEventListener("input", () => {
    setTargetsMessage("");
    if (elements.goalPreset.value !== "custom") {
      elements.goalPreset.value = "custom";
    }
    updateGoalLabel();
    saveProfile();
    calculateTargets();
  });

  [
    elements.macroProtein,
    elements.macroCarbs,
    elements.macroFat,
    elements.macroAlcohol,
  ].forEach((input) => {
    input.addEventListener("input", updateMacroCalories);
  });

  elements.labelInput.addEventListener("change", handleLabelUpload);

  [
    elements.labelCalories,
    elements.labelFat,
    elements.labelCarbs,
    elements.labelProtein,
    elements.servingsEaten,
    elements.caloriesOverride,
  ].forEach((input) => {
    input.addEventListener("input", updateMealSummary);
  });

  if (elements.barcodeReader) {
    setBarcodeIdle("Camera preview will appear here.");
    if (!window.Html5Qrcode) {
      setBarcodeStatus("Barcode scanner loading or unavailable.", true);
    }
  }

  if (elements.barcodeStart) {
    elements.barcodeStart.addEventListener("click", startBarcodeScanner);
  }

  if (elements.barcodeStop) {
    elements.barcodeStop.addEventListener("click", () => stopBarcodeScanner("Scanner stopped."));
  }

  if (elements.barcodeLookup) {
    elements.barcodeLookup.addEventListener("click", () => lookupBarcode(elements.barcodeInput.value));
  }

  if (elements.barcodeInput) {
    elements.barcodeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        lookupBarcode(elements.barcodeInput.value);
      }
    });
  }

  if (elements.saveFood) {
    elements.saveFood.addEventListener("click", saveFoodToLibrary);
  }

  elements.addMeal.addEventListener("click", addMealToLog);
  elements.clearLog.addEventListener("click", clearTodayLog);
};

document.addEventListener("DOMContentLoaded", init);

// ── Meal refresh button ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("meals-refresh-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    btn.textContent = "⏳";
    btn.disabled = true;
    updatePlanForToday().finally(() => {
      btn.textContent = "🔄";
      btn.disabled = false;
    });
  });
});

// ── Auto-trigger scanner modal from deep-links ────────────────────────────
// Other pages navigate to index.html?scan=barcode or ?scan=camera
document.addEventListener("DOMContentLoaded", () => {
  const scanParam = new URLSearchParams(window.location.search).get("scan");
  if (!scanParam) return;
  // Wait for modal logic to initialise (it uses DOMContentLoaded too)
  setTimeout(() => {
    if (typeof window.openScannerModal === "function") {
      if (scanParam === "barcode") {
        window.openScannerModal("barcode");
      } else if (scanParam === "camera") {
        window.openScannerModal("photo");
        setTimeout(() => document.getElementById("label-input")?.click(), 400);
      }
    }
  }, 300);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

// ─────────────────────────────────────────────────────────────
// WEIGHT LOG MODULE (MacroFactor-style)
// ─────────────────────────────────────────────────────────────

const WEIGHT_STORAGE_KEY = "macromint_weight_log";

const getLocalWeightLog = () => {
  try {
    return JSON.parse(localStorage.getItem(WEIGHT_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveLocalWeightLog = (entries) => {
  localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(entries));
};

const mergeWeightEntries = (local, remote) => {
  const map = new Map();
  for (const e of local) map.set(e.date, e);
  for (const e of remote) map.set(e.date, e);
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
};

const loadWeightHistory = async () => {
  const local = getLocalWeightLog();
  if (!state.isAuthenticated) return local;
  try {
    const remote = await apiFetch("/api/weight?from=" + getTodayKey().slice(0, 8) + "01");
    const merged = mergeWeightEntries(local, Array.isArray(remote) ? remote : []);
    saveLocalWeightLog(merged);
    return merged;
  } catch {
    return local;
  }
};

const pushWeightEntry = async (entry) => {
  // Always save locally first
  const log = getLocalWeightLog();
  const idx = log.findIndex((e) => e.date === entry.date);
  if (idx >= 0) log[idx] = entry;
  else log.push(entry);
  log.sort((a, b) => a.date.localeCompare(b.date));
  saveLocalWeightLog(log);

  if (state.isAuthenticated) {
    try {
      await apiFetch("/api/weight", {
        method: "POST",
        body: JSON.stringify({ date: entry.date, weightKg: entry.weightKg }),
      });
    } catch {
      // silently keep local-only
    }
  }
  return log;
};

const renderWeightHistory = (entries, profileUnits) => {
  const list = document.getElementById("weight-history-list");
  if (!list) return;
  list.innerHTML = "";
  if (!entries.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No weight entries yet. Log your weight above.";
    list.appendChild(p);
    return;
  }
  const useKg = profileUnits === "metric";
  const recent = [...entries].reverse().slice(0, 14);
  for (const entry of recent) {
    const row = document.createElement("div");
    row.className = "weight-history-row";
    const dateSpan = document.createElement("span");
    dateSpan.className = "weight-history-date";
    dateSpan.textContent = new Date(`${entry.date}T00:00:00`).toLocaleDateString([], {
      weekday: "short", month: "short", day: "numeric",
    });
    const valSpan = document.createElement("strong");
    const display = useKg ? entry.weightKg : Math.round(entry.weightKg * 2.20462 * 10) / 10;
    valSpan.textContent = `${display} ${useKg ? "kg" : "lb"}`;
    row.appendChild(dateSpan);
    row.appendChild(valSpan);
    list.appendChild(row);
  }
};

const updateWeightUI = async () => {
  const entries = await loadWeightHistory();
  const profileUnits = state.profile?.units || "us";
  const useKg = profileUnits === "metric";

  renderWeightHistory(entries, profileUnits);

  if (entries.length === 0) return;

  const trendData = window.MacroMintCalcs?.weightEma(entries);
  if (!trendData || trendData.length === 0) return;

  const latestTrend = trendData[trendData.length - 1].trend;
  const displayTrend = useKg ? latestTrend : Math.round(latestTrend * 2.20462 * 10) / 10;
  const unit = useKg ? "kg" : "lb";

  const trendBadge = document.getElementById("weight-trend-badge");
  const trendValueEl = document.getElementById("weight-trend-value");
  const trendUnitEl = document.getElementById("weight-trend-unit");
  const currentTrendEl = document.getElementById("weight-current-trend");
  const currentTrendUnitEl = document.getElementById("weight-current-trend-unit");
  const weekChangeEl = document.getElementById("weight-week-change");
  const adaptiveTdeeEl = document.getElementById("weight-adaptive-tdee");

  if (trendBadge) trendBadge.hidden = false;
  if (trendValueEl) trendValueEl.textContent = displayTrend;
  if (trendUnitEl) trendUnitEl.textContent = unit;
  if (currentTrendEl) currentTrendEl.textContent = `${displayTrend} ${unit}`;
  if (currentTrendUnitEl) currentTrendUnitEl.textContent = "smoothed trend";

  if (trendData.length >= 7) {
    const sevenAgo = trendData[trendData.length - 8]?.trend || trendData[0].trend;
    const changeKg = latestTrend - sevenAgo;
    const changeDisplay = useKg
      ? Math.round(changeKg * 100) / 100
      : Math.round(changeKg * 2.20462 * 100) / 100;
    const sign = changeDisplay > 0 ? "+" : "";
    if (weekChangeEl) weekChangeEl.textContent = `${sign}${changeDisplay} ${unit}`;
  }

  // Adaptive TDEE — needs calorie data too
  if (state.isAuthenticated && adaptiveTdeeEl) {
    try {
      const from = entries[0]?.date;
      const to = getTodayKey();
      const intakeData = await apiFetch(`/api/totals/daily?from=${from}&to=${to}`);
      const intakeEntries = Array.isArray(intakeData) ? intakeData : intakeData?.totals || [];
      const normalized = intakeEntries.map((e) => ({
        date: typeof e.date === "string" ? e.date : new Date(e.date).toISOString().slice(0, 10),
        calories: e.calories || 0,
      }));
      const adaptive = window.MacroMintCalcs?.adaptiveTdee(entries, normalized);
      if (adaptive) {
        adaptiveTdeeEl.textContent = `${adaptive.toLocaleString()} kcal`;
      }
    } catch {
      adaptiveTdeeEl.textContent = "Need more data";
    }
  }

  // Set unit select to match profile
  const unitSelect = document.getElementById("weight-entry-unit");
  if (unitSelect) unitSelect.value = useKg ? "kg" : "lb";
};

const initWeightModule = () => {
  const btn = document.getElementById("weight-log-btn");
  const input = document.getElementById("weight-entry-value");
  const unitSelect = document.getElementById("weight-entry-unit");
  const msg = document.getElementById("weight-log-message");

  if (!btn || !input) return;

  btn.addEventListener("click", async () => {
    const raw = parseFloat(input.value);
    if (!Number.isFinite(raw) || raw <= 0) {
      if (msg) { msg.textContent = "Enter a valid weight."; msg.style.color = "#b91c1c"; }
      return;
    }
    const unit = unitSelect?.value || "lb";
    const weightKg = unit === "lb" ? Math.round((raw / 2.20462) * 1000) / 1000 : raw;

    btn.disabled = true;
    if (msg) { msg.textContent = "Saving..."; msg.style.color = ""; }

    await pushWeightEntry({ date: getTodayKey(), weightKg });
    input.value = "";
    if (msg) { msg.textContent = "Logged!"; msg.style.color = "var(--mint-700)"; }
    setTimeout(() => { if (msg) msg.textContent = ""; }, 3000);
    btn.disabled = false;
    await updateWeightUI();
  });
};

// ─────────────────────────────────────────────────────────────
// WORKOUT GENERATOR (OpenAI-powered)
// ─────────────────────────────────────────────────────────────

const initWorkoutModule = () => {
  const btn = document.getElementById("workout-generate-btn");
  const output = document.getElementById("workout-output");
  const statusEl = document.getElementById("workout-status");

  if (!btn) return;

  if (!state.isAuthenticated) {
    btn.disabled = true;
    return;
  }

  btn.disabled = false;
  if (statusEl) statusEl.textContent = "Ready to generate.";

  btn.addEventListener("click", async () => {
    if (!state.isAuthenticated) {
      if (statusEl) statusEl.textContent = "Sign in to generate a workout plan.";
      return;
    }

    const profile = state.profile;
    if (!profile) {
      if (statusEl) statusEl.textContent = "Complete your profile first.";
      return;
    }

    const metrics = window.MacroMintCalcs?.toMetric({
      unit: profile.units,
      heightFt: profile.heightFt,
      heightIn: profile.heightIn,
      heightCm: profile.heightCm,
      weightLb: profile.weightLb,
      weightKg: profile.weightKg,
    });

    const bmr = window.MacroMintCalcs?.bmrMifflin({
      sex: profile.sex,
      age: parseFloat(profile.age),
      heightCm: metrics?.heightCm,
      weightKg: metrics?.weightKg,
    });
    const tdeeValue = window.MacroMintCalcs?.tdee({ bmr, activity: parseFloat(profile.activity) || 1.55 });

    const adaptiveTdeeText = document.getElementById("weight-adaptive-tdee")?.textContent;
    const adaptiveTdeeValue = adaptiveTdeeText && !adaptiveTdeeText.includes("--") && !adaptiveTdeeText.includes("Need")
      ? parseInt(adaptiveTdeeText)
      : null;

    btn.disabled = true;
    if (statusEl) statusEl.textContent = "Generating your plan...";
    if (output) { output.hidden = false; output.innerHTML = '<p class="muted">Generating personalised workout plan...</p>'; }

    try {
      const data = await apiFetch("/api/workout/generate", {
        method: "POST",
        body: JSON.stringify({
          sex: profile.sex,
          age: parseFloat(profile.age),
          weightKg: metrics?.weightKg,
          heightCm: metrics?.heightCm,
          tdeeValue: tdeeValue ? Math.round(tdeeValue) : null,
          adaptiveTdeeValue,
          goalPreset: profile.goalPreset || "maintain",
          activityLevel: parseFloat(profile.activity) || 1.55,
        }),
      });

      if (output) {
        output.hidden = false;
        // Render markdown-style output
        const formatted = (data.plan || data.text || "No plan returned.")
          .replace(/^### (.+)$/gm, "<h4>$1</h4>")
          .replace(/^## (.+)$/gm, "<h3>$1</h3>")
          .replace(/^# (.+)$/gm, "<h3>$1</h3>")
          .replace(/^\*\*(.+)\*\*$/gm, "<strong>$1</strong>")
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/^- (.+)$/gm, "<li>$1</li>")
          .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
          .replace(/\n\n/g, "<br><br>")
          .replace(/\n/g, "<br>");
        output.innerHTML = `<div class="workout-plan">${formatted}</div>`;
      }
      if (statusEl) statusEl.textContent = "Plan ready!";
    } catch (error) {
      if (output) {
        output.hidden = false;
        output.innerHTML = `<p class="muted">Unable to generate workout: ${error.message}</p>`;
      }
      if (statusEl) { statusEl.textContent = "Error"; statusEl.classList.add("error"); }
    } finally {
      btn.disabled = false;
    }
  });
};

// Extend init to run new modules
document.addEventListener("DOMContentLoaded", async () => {
  // Weight UI initialises after main init sets state.profile
  setTimeout(async () => {
    initWeightModule();
    await updateWeightUI();
    initWorkoutModule();
  }, 800);
});

// ── Global exports for cross-IIFE access ──────────────────────────────────
// Fridge Magic and other inline scripts need these functions from app.js scope
window.addMealToLog      = (...args) => addMealToLog(...args);
window.saveFoodToLibrary = (...args) => saveFoodToLibrary(...args);
