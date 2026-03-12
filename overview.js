const STORAGE_KEYS = {
  authToken: "macromint_token",
  refreshToken: "macromint_refresh_token",
};

const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  custom: "Custom",
};

const GOAL_LABELS = {
  maintain: "Maintain / Sustain",
  diet: "Diet",
  lose: "Lose",
  shred: "Shred",
  gain: "Gain",
  bulk: "Bulk",
  custom: "Custom",
};

const PLAN_SLOT_LABELS = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

const elements = {
  mode: document.getElementById("overview-mode"),
  dateInput: document.getElementById("overview-date"),
  monthInput: document.getElementById("overview-month"),
  dateWrap: document.getElementById("overview-date-wrap"),
  monthWrap: document.getElementById("overview-month-wrap"),
  range: document.getElementById("overview-range"),
  total: document.getElementById("overview-total"),
  average: document.getElementById("overview-average"),
  meals: document.getElementById("overview-meals"),
  highest: document.getElementById("overview-high"),
  target: document.getElementById("overview-target"),
  goal: document.getElementById("overview-goal"),
  list: document.getElementById("overview-list"),
  planStatus: document.getElementById("plan-status"),
  remainingCalories: document.getElementById("plan-remaining-calories"),
  remainingProtein: document.getElementById("plan-remaining-protein"),
  remainingCarbs: document.getElementById("plan-remaining-carbs"),
  remainingFat: document.getElementById("plan-remaining-fat"),
  planSuggestions: document.getElementById("plan-suggestions"),
};

const state = {
  user: null,
  isAuthenticated: false,
  log: [],
  profile: null,
};

const parseNumber = (value) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
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

const setPlanStatus = (message, isError = false) => {
  if (!elements.planStatus) return;
  elements.planStatus.textContent = message;
  elements.planStatus.classList.toggle("error", isError);
};

const updateAuthUI = () => {
  state.isAuthenticated = Boolean(state.user);
};

const updateTargetFromProfile = (profileInput) => {
  const profile = normalizeProfile(profileInput);
  state.profile = profile;
  const target = calculateTargetFromProfile(profile);
  if (target) {
    elements.target.textContent = formatNumber(target);
  } else {
    elements.target.textContent = "--";
  }

  if (profile?.goalPreset) {
    const label = GOAL_LABELS[profile.goalPreset] || profile.goalPreset;
    elements.goal.textContent = `${label} goal`;
  } else {
    elements.goal.textContent = "Goal target";
  }
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

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateFromKey = (key) => new Date(`${key}T00:00:00`);

const GOAL_TYPE_MAP = {
  maintain: "MAINTAIN",
  diet: "CUT",
  lose: "CUT",
  shred: "CUT",
  gain: "BULK",
  bulk: "BULK",
  custom: "MAINTAIN",
};

const buildGoalPayload = (targetCalories, profile) => {
  const proteinCalories = targetCalories * 0.3;
  const carbCalories = targetCalories * 0.4;
  const fatCalories = targetCalories * 0.3;

  const goalType = GOAL_TYPE_MAP[profile?.goalPreset] || "MAINTAIN";

  return {
    goalType,
    targetCalories: Math.round(targetCalories),
    targetProteinG: Math.round(proteinCalories / 4),
    targetCarbsG: Math.round(carbCalories / 4),
    targetFatG: Math.round(fatCalories / 9),
  };
};

const clearPlanUI = () => {
  if (elements.remainingCalories) elements.remainingCalories.textContent = "--";
  if (elements.remainingProtein) elements.remainingProtein.textContent = "--";
  if (elements.remainingCarbs) elements.remainingCarbs.textContent = "--";
  if (elements.remainingFat) elements.remainingFat.textContent = "--";
  if (elements.planSuggestions) elements.planSuggestions.innerHTML = "";
};

const renderPlanSuggestions = (plan) => {
  if (!elements.planSuggestions) return;
  elements.planSuggestions.innerHTML = "";

  if (!plan?.suggestions?.length) {
    const empty = document.createElement("p");
    empty.className = "plan-empty";
    empty.textContent = "No suggestions yet. Log a few foods to unlock ideas.";
    elements.planSuggestions.appendChild(empty);
    return;
  }

  plan.suggestions.forEach((slot) => {
    const slotCard = document.createElement("div");
    slotCard.className = "plan-slot";

    const title = document.createElement("h4");
    title.textContent = PLAN_SLOT_LABELS[slot.slot] || slot.slot || "Meal";
    slotCard.appendChild(title);

    if (!slot.options || slot.options.length === 0) {
      const empty = document.createElement("p");
      empty.className = "plan-empty";
      empty.textContent = "No suggestions for this slot yet.";
      slotCard.appendChild(empty);
      elements.planSuggestions.appendChild(slotCard);
      return;
    }

    slot.options.slice(0, 2).forEach((option, index) => {
      const optionWrap = document.createElement("div");
      optionWrap.className = "plan-option";

      if (slot.options.length > 1) {
        const optionLabel = document.createElement("small");
        optionLabel.className = "muted";
        optionLabel.textContent = `Option ${index + 1}`;
        optionWrap.appendChild(optionLabel);
      }

      (option.items || []).forEach((item) => {
        const row = document.createElement("div");
        row.className = "plan-item";

        const name = document.createElement("div");
        const qty = item.servingQty ? `${formatQuantity(item.servingQty)} ` : "";
        const unit = item.servingUnit ? item.servingUnit.toLowerCase() : "serving";
        name.textContent = `${item.name} · ${qty}${unit}`;

        const macros = document.createElement("small");
        macros.textContent = `${formatMacro(item.calories)} kcal • ${formatMacro(
          item.proteinG,
          "P",
        )} / ${formatMacro(item.carbsG, "C")} / ${formatMacro(item.fatG, "F")}`;

        row.appendChild(name);
        row.appendChild(macros);
        optionWrap.appendChild(row);
      });

      slotCard.appendChild(optionWrap);
    });

    elements.planSuggestions.appendChild(slotCard);
  });
};

const updatePlanForDate = async (dateKey, mode) => {
  if (!elements.planStatus) return;

  if (mode !== "day") {
    clearPlanUI();
    setPlanStatus("Switch to Daily view to generate suggestions.");
    return;
  }

  if (!state.isAuthenticated) {
    clearPlanUI();
    setPlanStatus("Sign in to generate suggestions.");
    return;
  }

  try {
    setPlanStatus("Generating suggestions...");
    let plan = null;
    let source = "rules";
    let proRequired = false;

    try {
      plan = await apiFetch("/api/plans/generate-ai", {
        method: "POST",
        body: JSON.stringify({ date: dateKey }),
      });
      source = plan?.source === "rules" ? "rules" : "ai";
    } catch (error) {
      const message = error.message || "";
      if (message.includes("Pro subscription required") || message.includes("AI planner")) {
        proRequired = message.includes("Pro subscription required");
        plan = await apiFetch("/api/plans/generate", {
          method: "POST",
          body: JSON.stringify({ date: dateKey }),
        });
        source = "rules";
      } else {
        throw error;
      }
    }

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

    renderPlanSuggestions(plan);
    if (source === "ai") {
      setPlanStatus("AI suggestions ready.");
    } else if (proRequired) {
      setPlanStatus("Standard suggestions loaded. Upgrade to Pro for AI.", false);
    } else {
      setPlanStatus("Standard suggestions loaded (AI unavailable).");
    }
  } catch (error) {
    const message = error.message || "Unable to load plan suggestions.";
    if (message.includes("No goal configured")) {
      const target = calculateTargetFromProfile(state.profile);
      if (!target) {
        clearPlanUI();
        setPlanStatus("Add your profile details to generate a plan.", true);
        return;
      }
      try {
        await apiFetch("/api/goals", {
          method: "POST",
          body: JSON.stringify(buildGoalPayload(target, state.profile)),
        });
        await updatePlanForDate(dateKey, mode);
        return;
      } catch (goalError) {
        clearPlanUI();
        setPlanStatus(goalError.message || "Unable to save goals.", true);
        return;
      }
    }

    clearPlanUI();
    setPlanStatus(message, true);
  }
};

const loadLogRange = async (from, to) => {
  if (!state.isAuthenticated) {
    return [];
  }

  if (from === to) {
    const data = await apiFetch(`/api/meals?date=${from}`);
    const meals = Array.isArray(data) ? data : data.meals || [];
    return meals.map((meal) => {
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
    });
  }

  const data = await apiFetch(`/api/totals/daily?from=${from}&to=${to}`);
  const totals = Array.isArray(data) ? data : data.totals || [];
  return totals.map((total) => ({
    date: toDateKey(new Date(total.date)),
    calories: Math.round(total.calories || 0),
  }));
};

const loadProfileFromServer = async () => {
  const data = await apiFetch("/api/profile");
  return data.profile ?? data ?? null;
};

const normalizeProfile = (profile) => {
  if (!profile) return null;
  const normalized = {
    units: profile.units || "us",
    age: profile.age ?? null,
    sex: profile.sex || "male",
    heightFt: profile.heightFt ?? profile.height_ft ?? null,
    heightIn: profile.heightIn ?? profile.height_in ?? null,
    heightCm: profile.heightCm ?? profile.height_cm ?? null,
    weightLb: profile.weightLb ?? profile.weight_lb ?? null,
    weightKg: profile.weightKg ?? profile.weight_kg ?? null,
    activity: profile.activity ?? profile.activityLevel ?? profile.activity_level ?? null,
    goalPreset: profile.goalPreset ?? profile.goal_preset ?? null,
    adjustment: profile.adjustment ?? null,
  };

  const heightCm = Number.isFinite(normalized.heightCm)
    ? normalized.heightCm
    : Number.parseFloat(normalized.heightCm);
  const weightKg = Number.isFinite(normalized.weightKg)
    ? normalized.weightKg
    : Number.parseFloat(normalized.weightKg);

  if ((normalized.heightFt === null || normalized.heightIn === null) && Number.isFinite(heightCm)) {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - feet * 12);
    normalized.heightFt = feet;
    normalized.heightIn = inches;
  }

  if (normalized.weightLb === null && Number.isFinite(weightKg)) {
    normalized.weightLb = Math.round(weightKg * 2.20462 * 10) / 10;
  }

  return normalized;
};

const calculateTargetFromProfile = (profileInput) => {
  const profile = normalizeProfile(profileInput);
  if (!profile) return null;
  const unit = profile.units || "us";
  const age = parseNumber(profile.age);
  const sex = profile.sex || "male";
  const activity = parseNumber(profile.activity) || 1.2;
  const adjustment = parseNumber(profile.adjustment) || 0;

  const metrics = window.MacroMintCalcs?.toMetric({
    unit,
    heightFt: profile.heightFt,
    heightIn: profile.heightIn,
    heightCm: profile.heightCm,
    weightLb: profile.weightLb,
    weightKg: profile.weightKg,
  });

  const heightCm = metrics?.heightCm ?? null;
  const weightKg = metrics?.weightKg ?? null;

  if (!age || !heightCm || !weightKg) return null;

  const bmr = window.MacroMintCalcs?.bmrMifflin({ sex, age, heightCm, weightKg });
  const tdee = window.MacroMintCalcs?.tdee({ bmr, activity });
  const target = window.MacroMintCalcs?.target({ tdeeValue: tdee, adjustment });
  return Number.isFinite(target) ? target : null;
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

const loadAuth = async () => {
  if (!getStoredToken() && !getStoredRefreshToken()) {
    state.user = null;
    updateAuthUI();
    return;
  }

  try {
    const data = await apiFetch("/api/auth/me");
    state.user = data.user;
    updateAuthUI();
  } catch (error) {
    state.user = null;
    updateAuthUI();
  }
};

const sumForDate = (log, dateKey) =>
  log.filter((entry) => entry.date === dateKey).reduce((sum, entry) => sum + entry.calories, 0);

const buildDayList = (entries) => {
  elements.list.innerHTML = "";
  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No meals logged for this day.";
    elements.list.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "overview-row";

    const header = document.createElement("div");
    header.className = "overview-row-header";

    const left = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = entry.name || "Meal";
    const time = document.createElement("div");
    time.className = "muted";
    const timeSource = entry.timestamp || entry.created_at || Date.now();
    time.textContent = new Date(timeSource).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    left.appendChild(title);
    left.appendChild(time);

    const right = document.createElement("div");
    right.style.display = "grid";
    right.style.justifyItems = "end";
    const pill = document.createElement("span");
    pill.className = "meal-pill";
    pill.textContent = MEAL_LABELS[entry.type] || "Meal";
    const calories = document.createElement("strong");
    calories.textContent = `${entry.calories} kcal`;

    right.appendChild(pill);
    right.appendChild(calories);

    header.appendChild(left);
    header.appendChild(right);

    row.appendChild(header);
    elements.list.appendChild(row);
  });
};

const buildRangeList = (days, maxTotal) => {
  elements.list.innerHTML = "";
  days.forEach((day) => {
    const row = document.createElement("div");
    row.className = "overview-row";

    const header = document.createElement("div");
    header.className = "overview-row-header";

    const label = document.createElement("strong");
    label.textContent = day.label;
    const value = document.createElement("span");
    value.textContent = `${formatNumber(day.total)} kcal`;

    header.appendChild(label);
    header.appendChild(value);

    const bar = document.createElement("div");
    bar.className = "row-bar";

    const fill = document.createElement("div");
    fill.className = "row-bar-fill";
    const width = maxTotal > 0 ? Math.round((day.total / maxTotal) * 100) : 0;
    fill.style.width = `${width}%`;

    bar.appendChild(fill);
    row.appendChild(header);
    row.appendChild(bar);

    row.addEventListener("click", () => {
      elements.mode.value = "day";
      elements.dateInput.value = day.key;
      updateModeUI();
      updateOverview();
    });

    elements.list.appendChild(row);
  });
};

const updateModeUI = () => {
  const mode = elements.mode.value;
  if (mode === "month") {
    elements.monthWrap.hidden = false;
    elements.dateWrap.hidden = true;
  } else {
    elements.monthWrap.hidden = true;
    elements.dateWrap.hidden = false;
  }
};

const updateOverview = async () => {
  try {
    const mode = elements.mode.value;

    if (mode === "month") {
      const monthValue = elements.monthInput.value || getTodayKey().slice(0, 7);
      elements.monthInput.value = monthValue;
      const [year, month] = monthValue.split("-").map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      const rangeStart = `${monthValue}-01`;
      const rangeEnd = `${monthValue}-${String(daysInMonth).padStart(2, "0")}`;
      const log = await loadLogRange(rangeStart, rangeEnd);
      state.log = log;

      const days = [];
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month - 1, day);
        const key = toDateKey(date);
        days.push({
          key,
          label: date.toLocaleDateString([], { month: "short", day: "numeric" }),
          total: sumForDate(log, key),
        });
      }

      const total = days.reduce((sum, day) => sum + day.total, 0);
      const average = total / days.length;
      const meals = log.filter((entry) => entry.date.startsWith(monthValue)).length;
      const max = Math.max(...days.map((day) => day.total), 0);
      const maxDay = max > 0 ? days.find((day) => day.total === max) : null;

      elements.range.textContent = new Date(year, month - 1, 1).toLocaleDateString([], {
        month: "long",
        year: "numeric",
      });
      elements.total.textContent = formatNumber(total);
      elements.average.textContent = formatNumber(average || 0);
      elements.meals.textContent = meals.toLocaleString();
      elements.highest.textContent = maxDay ? `${maxDay.label} · ${formatNumber(max)} kcal` : "--";

      buildRangeList(days, max);
      await updatePlanForDate(monthValue + "-01", mode);
      return;
    }

    if (mode === "week") {
      const dateKey = elements.dateInput.value || getTodayKey();
      elements.dateInput.value = dateKey;
      const date = dateFromKey(dateKey);
      const dayIndex = (date.getDay() + 6) % 7;
      const start = new Date(date);
      start.setDate(date.getDate() - dayIndex);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const log = await loadLogRange(toDateKey(start), toDateKey(end));
      state.log = log;

      const days = [];
      for (let i = 0; i < 7; i += 1) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        const key = toDateKey(current);
        days.push({
          key,
          label: current.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          total: sumForDate(log, key),
        });
      }

      const total = days.reduce((sum, day) => sum + day.total, 0);
      const average = total / days.length;
      const meals = log.filter((entry) => {
        const entryDate = dateFromKey(entry.date);
        return entryDate >= start && entryDate <= end;
      }).length;
      const max = Math.max(...days.map((day) => day.total), 0);
      const maxDay = max > 0 ? days.find((day) => day.total === max) : null;

      elements.range.textContent = `${start.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })} – ${end.toLocaleDateString([], { month: "short", day: "numeric" })}`;
      elements.total.textContent = formatNumber(total);
      elements.average.textContent = formatNumber(average || 0);
      elements.meals.textContent = meals.toLocaleString();
      elements.highest.textContent = maxDay ? `${maxDay.label} · ${formatNumber(max)} kcal` : "--";

      buildRangeList(days, max);
      await updatePlanForDate(toDateKey(start), mode);
      return;
    }

    const dateKey = elements.dateInput.value || getTodayKey();
    elements.dateInput.value = dateKey;
    const log = await loadLogRange(dateKey, dateKey);
    state.log = log;
    const entries = log.filter((entry) => entry.date === dateKey);
    const total = entries.reduce((sum, entry) => sum + entry.calories, 0);
    const average = entries.length ? total : 0;
    const max = entries.reduce((current, entry) => Math.max(current, entry.calories), 0);

    elements.range.textContent = dateFromKey(dateKey).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    elements.total.textContent = formatNumber(total);
    elements.average.textContent = formatNumber(average || 0);
    elements.meals.textContent = entries.length.toLocaleString();
    elements.highest.textContent = max ? `${formatNumber(max)} kcal` : "--";

    buildDayList(entries);
    await updatePlanForDate(dateKey, mode);
  } catch (error) {
    setPlanStatus("Unable to load overview data.", true);
  }
};

const init = async () => {
  if (!elements.mode) return;

  const today = getTodayKey();
  elements.dateInput.value = today;
  elements.monthInput.value = today.slice(0, 7);

  await loadAuth();

  let profile = null;
  if (state.isAuthenticated) {
    try {
      profile = await loadProfileFromServer();
    } catch (error) {
      profile = null;
    }
  }

  updateTargetFromProfile(profile);

  updateModeUI();
  await updateOverview();
  initDropdowns();

  elements.mode.addEventListener("change", () => {
    updateModeUI();
    updateOverview();
  });

  elements.dateInput.addEventListener("change", updateOverview);
  elements.monthInput.addEventListener("change", updateOverview);

};

document.addEventListener("DOMContentLoaded", init);

// ─────────────────────────────────────────────────────────────
// PROGRESS CHARTS + WEEKLY COACHING
// ─────────────────────────────────────────────────────────────

const WEIGHT_STORAGE_KEY = "macromint_weight_log";
const getLocalWeightLog = () => {
  try { return JSON.parse(localStorage.getItem(WEIGHT_STORAGE_KEY) || "[]"); }
  catch { return []; }
};

const drawLineChart = (canvas, datasets, opts = {}) => {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 300;
  const cssH = parseInt(canvas.getAttribute("height")) || 160;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  ctx.scale(dpr, dpr);

  const W = cssW;
  const H = cssH;
  const PAD = { top: 12, right: 12, bottom: 28, left: 46 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  ctx.clearRect(0, 0, W, H);

  const allValues = datasets.flatMap((d) => d.values.filter(Number.isFinite));
  if (allValues.length === 0) return;

  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const pad = (rawMax - rawMin) * 0.15 || 100;
  const minVal = rawMin - pad;
  const maxVal = rawMax + pad;
  const range = maxVal - minVal || 1;

  const toX = (i, len) => PAD.left + (i / Math.max(len - 1, 1)) * chartW;
  const toY = (v) => PAD.top + chartH - ((v - minVal) / range) * chartH;

  // Grid
  ctx.strokeStyle = "rgba(15,23,42,0.07)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (i / 4) * chartH;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + chartW, y); ctx.stroke();
    const label = (maxVal - (i / 4) * range).toFixed(opts.decimals ?? 0);
    ctx.fillStyle = "rgba(91,100,116,0.9)";
    ctx.font = "10px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(label, PAD.left - 4, y + 4);
  }

  // Target line
  if (Number.isFinite(opts.target)) {
    const ty = toY(opts.target);
    ctx.save();
    ctx.strokeStyle = "rgba(236,72,153,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(PAD.left, ty); ctx.lineTo(PAD.left + chartW, ty); ctx.stroke();
    ctx.restore();
  }

  datasets.forEach((ds) => {
    const pts = ds.values.map((v, i) => ({
      x: toX(i, ds.values.length),
      y: toY(v),
      valid: Number.isFinite(v),
    }));
    ctx.save();
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = ds.lineWidth ?? 2;
    if (ds.dashed) ctx.setLineDash([5, 3]);

    if (ds.fill) {
      ctx.fillStyle = ds.fill;
      ctx.beginPath();
      const validPts = pts.filter((p) => p.valid);
      if (validPts.length > 0) {
        ctx.moveTo(validPts[0].x, validPts[0].y);
        validPts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(validPts[validPts.length - 1].x, PAD.top + chartH);
        ctx.lineTo(validPts[0].x, PAD.top + chartH);
        ctx.closePath(); ctx.fill();
      }
    }

    ctx.beginPath();
    let started = false;
    pts.forEach((pt) => {
      if (!pt.valid) { started = false; return; }
      if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    if (ds.dots) {
      pts.forEach((pt) => {
        if (!pt.valid) return;
        ctx.fillStyle = ds.dotColor ?? ds.color;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2); ctx.fill();
      });
    }
    ctx.restore();
  });

  // X labels
  if (opts.labels && opts.labels.length > 0) {
    ctx.fillStyle = "rgba(91,100,116,0.85)";
    ctx.font = "10px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.textAlign = "center";
    const step = Math.max(1, Math.floor(opts.labels.length / 6));
    opts.labels.forEach((label, i) => {
      if (i % step !== 0 && i !== opts.labels.length - 1) return;
      ctx.fillText(label, toX(i, opts.labels.length), H - 6);
    });
  }
};

const renderWeightChart = (weightEntries, profileUnits) => {
  const canvas = document.getElementById("weight-chart");
  const emptyEl = document.getElementById("weight-chart-empty");
  if (!canvas) return;

  const useKg = profileUnits === "metric";

  if (!weightEntries || weightEntries.length < 2) {
    canvas.style.display = "none";
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  canvas.style.display = "block";
  if (emptyEl) emptyEl.hidden = true;

  const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const trendData = window.MacroMintCalcs?.weightEma(sorted) || sorted.map((e) => ({ ...e, trend: e.weightKg }));
  const rawValues = sorted.map((e) => useKg ? e.weightKg : Math.round(e.weightKg * 2.20462 * 10) / 10);
  const trendValues = trendData.map((e) => useKg ? e.trend : Math.round(e.trend * 2.20462 * 10) / 10);
  const labels = sorted.map((e) => {
    const d = new Date(`${e.date}T00:00:00`);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  drawLineChart(canvas, [
    { values: rawValues, color: "rgba(99,102,241,0.5)", lineWidth: 1.5, dots: true, dotColor: "rgba(99,102,241,0.7)", fill: "rgba(99,102,241,0.06)" },
    { values: trendValues, color: "#10b981", lineWidth: 2.5 },
  ], { labels, decimals: useKg ? 1 : 0 });
};

const renderCalorieChart = (intakeEntries, target) => {
  const canvas = document.getElementById("calorie-chart");
  const emptyEl = document.getElementById("calorie-chart-empty");
  if (!canvas) return;

  if (!intakeEntries || intakeEntries.length < 2) {
    canvas.style.display = "none";
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  canvas.style.display = "block";
  if (emptyEl) emptyEl.hidden = true;

  const sorted = [...intakeEntries].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const values = sorted.map((e) => e.calories || 0);
  const labels = sorted.map((e) => {
    const d = new Date(`${e.date}T00:00:00`);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  drawLineChart(canvas, [
    { values, color: "rgba(236,72,153,0.8)", lineWidth: 2, fill: "rgba(236,72,153,0.08)", dots: true, dotColor: "rgba(236,72,153,0.7)" },
  ], { labels, target, decimals: 0 });
};

const calcTargetForProfile = (profile) => {
  if (!profile) return null;
  const activity = parseNumber(profile.activity ?? profile.activityLevel) || 1.2;
  const adjustment = parseNumber(profile.adjustment) || 0;
  const age = parseNumber(profile.age);
  const sex = profile.sex || "male";
  const metrics = window.MacroMintCalcs?.toMetric({
    unit: profile.units || "us",
    heightFt: profile.heightFt ?? profile.height_ft,
    heightIn: profile.heightIn ?? profile.height_in,
    heightCm: profile.heightCm ?? profile.height_cm,
    weightLb: profile.weightLb ?? profile.weight_lb,
    weightKg: profile.weightKg ?? profile.weight_kg,
  });
  if (!age || !metrics?.heightCm || !metrics?.weightKg) return null;
  const bmr = window.MacroMintCalcs?.bmrMifflin({ sex, age, heightCm: metrics.heightCm, weightKg: metrics.weightKg });
  const tdee = window.MacroMintCalcs?.tdee({ bmr, activity });
  const t = window.MacroMintCalcs?.target({ tdeeValue: tdee, adjustment });
  return Number.isFinite(t) ? Math.round(t) : null;
};

const renderCoaching = async (profile, weightEntries) => {
  const badgeEl = document.getElementById("coaching-badge");
  const msgEl = document.getElementById("coaching-message");
  const metricsEl = document.getElementById("coaching-metrics");

  if (!profile) {
    if (msgEl) msgEl.textContent = "Complete your profile to enable weekly coaching.";
    return;
  }

  const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date));
  const trendData = window.MacroMintCalcs?.weightEma(sorted) || [];
  const currentTarget = calcTargetForProfile(profile) || 2000;
  let adaptiveTdeeValue = null;
  let intakeEntries = [];

  if (state.isAuthenticated && sorted.length >= 4) {
    try {
      const earliest = sorted[0].date;
      const intakeData = await apiFetch(`/api/totals/daily?from=${earliest}&to=${getTodayKey()}`);
      intakeEntries = (Array.isArray(intakeData) ? intakeData : intakeData?.totals || []).map((e) => ({
        date: typeof e.date === "string" ? e.date : new Date(e.date).toISOString().slice(0, 10),
        calories: e.calories || 0,
      }));
      adaptiveTdeeValue = window.MacroMintCalcs?.adaptiveTdee(weightEntries, intakeEntries);
    } catch { /* ignore */ }
  }

  renderCalorieChart(intakeEntries, currentTarget);

  const coaching = window.MacroMintCalcs?.weeklyCoaching({
    trendData,
    goalPreset: profile.goalPreset ?? profile.goal_preset ?? "maintain",
    currentTarget,
    adaptiveTdeeValue,
  });

  if (!coaching) return;
  if (msgEl) msgEl.textContent = coaching.message;

  if (coaching.status === "insufficient_data") {
    if (badgeEl) { badgeEl.textContent = "Needs Data"; badgeEl.className = "coaching-badge coaching-badge--neutral"; }
    return;
  }

  if (metricsEl) metricsEl.hidden = false;

  const useKg = (profile.units || "us") === "metric";
  const toDisplayWeight = (kg) => useKg ? kg : Math.round(kg * 2.20462 * 100) / 100;
  const unit = useKg ? "kg" : "lb";

  const el = (id) => document.getElementById(id);
  if (el("coaching-goal-rate")) el("coaching-goal-rate").textContent = `${toDisplayWeight(coaching.goalRateKgPerWeek)} ${unit}/wk`;
  if (el("coaching-actual-rate")) el("coaching-actual-rate").textContent = coaching.actualRateKgPerWeek !== null
    ? `${toDisplayWeight(coaching.actualRateKgPerWeek)} ${unit}/wk` : "--";
  if (el("coaching-adaptive-tdee")) el("coaching-adaptive-tdee").textContent = coaching.adaptiveTdee
    ? `${coaching.adaptiveTdee.toLocaleString()} kcal` : "Need more data";
  if (el("coaching-suggested-target")) el("coaching-suggested-target").textContent = `${coaching.suggestedTarget.toLocaleString()} kcal`;

  const adj = coaching.recommendation;
  if (el("coaching-adjustment-label")) {
    if (adj === 0) el("coaching-adjustment-label").textContent = "no change needed";
    else if (adj > 0) el("coaching-adjustment-label").textContent = `+${adj} kcal/day`;
    else el("coaching-adjustment-label").textContent = `${adj} kcal/day`;
  }

  if (badgeEl) {
    if (Math.abs(adj) <= 50) { badgeEl.textContent = "On Track"; badgeEl.className = "coaching-badge coaching-badge--good"; }
    else if (Math.abs(adj) <= 200) { badgeEl.textContent = "Minor Adjust"; badgeEl.className = "coaching-badge coaching-badge--warn"; }
    else { badgeEl.textContent = "Needs Adjustment"; badgeEl.className = "coaching-badge coaching-badge--alert"; }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    const weightEntries = getLocalWeightLog();
    let profile = state.profile || null;

    if (state.isAuthenticated && !profile) {
      try {
        const data = await apiFetch("/api/profile");
        profile = data.profile ?? data ?? null;
      } catch { /* ignore */ }
    }

    renderWeightChart(weightEntries, profile?.units || "us");
    await renderCoaching(profile, weightEntries);
  }, 700);

  // Workout trends
  renderWorkoutTrends();
});

// ── Workout Trends ─────────────────────────────────────────────────────────
const WORKOUT_LOG_KEY = "macromint_workout_log";

const loadLocalWorkoutLog = () => {
  try { return JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY) || "[]"); }
  catch { return []; }
};

const calcWorkoutStreak = (log) => {
  if (!log.length) return 0;
  const dates = [...new Set(log.map(w => w.date))].sort().reverse();
  let streak = 0;
  let d = new Date(); d.setHours(0,0,0,0);
  let expected = d.toISOString().slice(0,10);
  for (const date of dates) {
    if (date === expected) {
      streak++;
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().slice(0,10);
    } else break;
  }
  return streak;
};

const EXERCISE_LABELS = {
  chest:"Chest", shoulders:"Shoulders", traps:"Traps", lats:"Lats",
  "lower-back":"Lower Back", biceps:"Biceps", triceps:"Triceps", forearms:"Forearms",
  abs:"Abs/Core", obliques:"Obliques", glutes:"Glutes", quads:"Quads",
  hamstrings:"Hamstrings", calves:"Calves",
};

const renderWorkoutTrends = () => {
  const log = loadLocalWorkoutLog();
  const noEl = document.getElementById("ov-no-workouts");
  const statsEl = document.getElementById("workout-trend-stats");

  if (log.length === 0) {
    if (noEl) noEl.style.display = "";
    if (statsEl) statsEl.style.display = "none";
    return;
  }
  if (noEl) noEl.style.display = "none";
  if (statsEl) statsEl.style.display = "";

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffKey = cutoff.toISOString().slice(0,10);
  const thisWeek  = log.filter(w => w.date >= cutoffKey);
  const streak    = calcWorkoutStreak(log);
  const weekKcal  = thisWeek.reduce((s,w) => s + (w.caloriesBurned||0), 0);
  const musclesThisWeek = new Set();
  thisWeek.forEach(w => (w.muscles||[]).forEach(m => musclesThisWeek.add(m)));

  // Stats
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("ov-week-count",     thisWeek.length);
  set("ov-streak",         streak);
  set("ov-kcal-burned",    weekKcal.toLocaleString());
  set("ov-total-workouts", log.length);

  // Streak badge
  const badge = document.getElementById("ov-streak-badge");
  if (badge) {
    if (streak >= 2) {
      badge.textContent = `🔥 ${streak} days`;
      badge.removeAttribute("hidden");
    } else {
      badge.setAttribute("hidden", "");
    }
  }

  // Muscles trained this week chips
  const musclesEl = document.getElementById("ov-muscles-trained");
  if (musclesEl) {
    musclesEl.innerHTML = musclesThisWeek.size > 0
      ? [...musclesThisWeek].map(m =>
          `<span class="history-muscle-chip">${EXERCISE_LABELS[m] || m}</span>`
        ).join("")
      : `<span class="muted" style="font-size:0.8rem">No muscles logged this week</span>`;
  }

  // Coaching tip
  const tipEl = document.getElementById("ov-workout-coach-tip");
  if (tipEl) {
    const today = new Date().toISOString().slice(0,10);
    const workedOutToday = log.some(w => w.date === today);
    let tip = "";
    if (workedOutToday) {
      const todayW = log.slice().reverse().find(w => w.date === today);
      tip = `💪 Great work today — ${todayW?.name || "workout"} logged. Recovery nutrition is key: hit your protein target.`;
    } else if (thisWeek.length >= 4) {
      tip = `🌟 ${thisWeek.length} workouts this week — consider a rest day to let muscles recover and grow.`;
    } else if (thisWeek.length === 0) {
      tip = `📅 No workouts this week yet. Even a 20-min session boosts metabolism and mood.`;
    } else {
      tip = `📈 ${thisWeek.length} workout${thisWeek.length !== 1 ? "s" : ""} this week and ${weekKcal} kcal burned — keep the consistency going.`;
    }
    tipEl.textContent = tip;
    tipEl.style.display = "";
  }
};
