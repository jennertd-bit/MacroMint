(() => {
  "use strict";

  // ── Storage ──────────────────────────────────────────────────────────────
  const ONBOARD_KEY   = "macromint_onboarded";
  const PROFILE_KEY   = "macromint_profile";
  const TOKEN_KEY     = "macromint_token";
  const REFRESH_KEY   = "macromint_refresh_token";
  const API_BASE      = () => (window.MACROMINT_API || "https://macromint-1.onrender.com").replace(/\/$/, "");

  // ── State ─────────────────────────────────────────────────────────────────
  const state = {
    step: 1,
    units: "us",       // "us" | "metric"
    sex: "male",
    age: 25,
    ft: 5,
    inches: 9,
    cm: 175,
    weightLbs: 160,
    weightKg: 72,
    goal: "lose",
    activity: "moderate",
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const $  = (id) => document.getElementById(id);
  const lbs2kg = (lbs) => +(lbs * 0.453592).toFixed(1);
  const kg2lbs = (kg)  => Math.round(kg * 2.20462);
  const ftIn2cm = (ft, inches) => Math.round((ft * 30.48) + (inches * 2.54));
  const cm2ftIn = (cm) => {
    const totalIn = cm / 2.54;
    return { ft: Math.floor(totalIn / 12), inches: Math.round(totalIn % 12) };
  };

  const heightCm = () =>
    state.units === "us" ? ftIn2cm(state.ft, state.inches) : state.cm;
  const weightKg = () =>
    state.units === "us" ? lbs2kg(state.weightLbs) : state.weightKg;

  // ── Progress dots ─────────────────────────────────────────────────────────
  const setProgress = (step) => {
    document.querySelectorAll(".progress-step").forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.toggle("active",    n === step);
      el.classList.toggle("completed", n < step);
    });
  };

  // ── Step navigation ───────────────────────────────────────────────────────
  const showStep = (n) => {
    state.step = n;
    document.querySelectorAll(".onboard-step").forEach((el) => {
      el.classList.toggle("hidden", el.id !== `step-${n}` && el.id !== "step-success");
      if (el.id === "step-success") el.classList.add("hidden");
    });
    if (n === "success") {
      document.getElementById("step-success").classList.remove("hidden");
      document.querySelectorAll(".onboard-step:not(#step-success)").forEach((el) =>
        el.classList.add("hidden")
      );
    }
    setProgress(typeof n === "number" ? n : 3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Tile selector helper ──────────────────────────────────────────────────
  const initTiles = (containerId, onChange) => {
    const container = $(containerId);
    if (!container) return;
    container.addEventListener("click", (e) => {
      const tile = e.target.closest(".option-tile");
      if (!tile) return;
      container.querySelectorAll(".option-tile").forEach((t) => t.classList.remove("selected"));
      tile.classList.add("selected");
      onChange(tile.dataset.value);
    });
  };

  // ── Stepper helper ────────────────────────────────────────────────────────
  const initStepper = (minusId, plusId, displayId, getter, setter, min, max, step = 1) => {
    const display = $(displayId);
    const update = () => { if (display) display.textContent = getter(); };
    update();
    $(minusId)?.addEventListener("click", () => {
      setter(Math.max(min, getter() - step));
      update();
      onAnyChange();
    });
    $(plusId)?.addEventListener("click", () => {
      setter(Math.min(max, getter() + step));
      update();
      onAnyChange();
    });
  };

  // ── TDEE preview ──────────────────────────────────────────────────────────
  const activityMult = {
    sedentary:  1.2,
    light:      1.375,
    moderate:   1.55,
    active:     1.725,
    very_active:1.9,
  };

  const updateTdeePreview = () => {
    const el = $("tdee-est");
    if (!el) return;
    const hCm = heightCm();
    const wKg = weightKg();
    const a   = state.age;
    // Mifflin-St Jeor BMR
    const bmr = state.sex === "female"
      ? 10 * wKg + 6.25 * hCm - 5 * a - 161
      : 10 * wKg + 6.25 * hCm - 5 * a + 5;
    const tdee = Math.round(bmr * (activityMult[state.activity] || 1.55));
    el.textContent = tdee.toLocaleString();
  };

  const onAnyChange = () => updateTdeePreview();

  // ── Units toggle ──────────────────────────────────────────────────────────
  const initUnitsToggle = () => {
    const usBtn     = $("units-us");
    const metricBtn = $("units-metric");
    const heightUs  = $("height-us");
    const heightMet = $("height-metric");
    const weightLbl = $("weight-label");

    const apply = (units) => {
      state.units = units;
      usBtn.classList.toggle("active",     units === "us");
      metricBtn.classList.toggle("active", units === "metric");
      heightUs.classList.toggle("hidden",  units !== "us");
      heightMet.classList.toggle("hidden", units !== "metric");
      if (weightLbl) {
        weightLbl.textContent = units === "us"
          ? "Current weight (lbs)"
          : "Current weight (kg)";
      }
      // Sync values when switching
      if (units === "metric") {
        state.cm          = ftIn2cm(state.ft, state.inches);
        state.weightKg    = lbs2kg(state.weightLbs);
        $("cm-display").textContent     = state.cm;
        $("weight-display").textContent = state.weightKg;
      } else {
        const fi = cm2ftIn(state.cm);
        state.ft      = fi.ft;
        state.inches  = fi.inches;
        state.weightLbs = kg2lbs(state.weightKg);
        $("ft-display").textContent     = state.ft;
        $("in-display").textContent     = state.inches;
        $("weight-display").textContent = state.weightLbs;
      }
      onAnyChange();
    };

    usBtn?.addEventListener("click",     () => apply("us"));
    metricBtn?.addEventListener("click", () => apply("metric"));
  };

  // ── Build profile object ──────────────────────────────────────────────────
  const buildProfile = () => ({
    sex:           state.sex,
    age:           state.age,
    heightCm:      heightCm(),
    weightKg:      weightKg(),
    goalPreset:    state.goal,
    activityLevel: state.activity,
    units:         state.units,
  });

  // ── Validation ────────────────────────────────────────────────────────────
  const showError = (msg) => {
    const el = $("ob-error");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("hidden", !msg);
  };

  // ── API signup ────────────────────────────────────────────────────────────
  const submitAccount = async () => {
    const email    = $("ob-email")?.value.trim();
    const password = $("ob-password")?.value;
    const agreed   = $("ob-terms")?.checked;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showError("Please enter a valid email address.");
    }
    if (!password || password.length < 8) {
      return showError("Password must be at least 8 characters.");
    }
    if (!agreed) {
      return showError("Please agree to the Terms of Service to continue.");
    }

    showError("");
    const btn = $("step3-submit");
    btn.textContent = "Creating account…";
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE()}/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message || "Registration failed. Please try again.";
        throw new Error(msg);
      }

      // Store tokens
      if (data.accessToken)  localStorage.setItem(TOKEN_KEY,   data.accessToken);
      if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);

      // Save profile locally
      const profile = buildProfile();
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

      // Try to push profile to API (non-fatal)
      if (data.accessToken) {
        try {
          await fetch(`${API_BASE()}/v1/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.accessToken}`,
            },
            body: JSON.stringify(profile),
          });
        } catch (_) { /* ignore */ }
      }

      // Mark onboarded
      localStorage.setItem(ONBOARD_KEY, "1");

      // Show success
      showStep("success");
    } catch (err) {
      showError(err.message || "Something went wrong. Please try again.");
      btn.textContent = "Start Free Trial";
      btn.disabled = false;
    }
  };

  // ── Terms toggle ──────────────────────────────────────────────────────────
  const initTermsToggle = () => {
    $("terms-toggle")?.addEventListener("click", () => {
      const box = $("terms-box");
      box?.classList.toggle("hidden");
    });
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {

    // Tiles
    initTiles("sex-tiles",      (v) => { state.sex      = v; onAnyChange(); });
    initTiles("goal-tiles",     (v) => { state.goal     = v; });
    initTiles("activity-tiles", (v) => { state.activity = v; updateTdeePreview(); });

    // Steppers
    initStepper("age-minus",    "age-plus",    "age-display",
      () => state.age,           (v) => { state.age = v; },           16, 99);
    initStepper("ft-minus",     "ft-plus",     "ft-display",
      () => state.ft,            (v) => { state.ft = v; },            3, 8);
    initStepper("in-minus",     "in-plus",     "in-display",
      () => state.inches,        (v) => { state.inches = v; },        0, 11);
    initStepper("cm-minus",     "cm-plus",     "cm-display",
      () => state.cm,            (v) => { state.cm = v; },            100, 250);
    initStepper("weight-minus", "weight-plus", "weight-display",
      () => state.units === "us" ? state.weightLbs : state.weightKg,
      (v) => {
        if (state.units === "us") state.weightLbs = v;
        else state.weightKg = v;
      }, 50, 600);

    // Units
    initUnitsToggle();

    // Terms
    initTermsToggle();

    // Navigation
    $("step1-next")?.addEventListener("click", () => showStep(2));
    $("step2-back")?.addEventListener("click", () => showStep(1));
    $("step2-next")?.addEventListener("click", () => {
      updateTdeePreview();
      showStep(3);
    });
    $("step3-back")?.addEventListener("click", () => showStep(2));
    $("step3-submit")?.addEventListener("click", submitAccount);
    $("go-to-app")?.addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Initial TDEE preview
    updateTdeePreview();
  });
})();
