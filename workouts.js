(() => {
  "use strict";

  const API_BASE = () => (window.MACROMINT_API || "https://macromint-1.onrender.com").replace(/\/$/, "");
  const TOKEN_KEY   = "macromint_token";
  const PROFILE_KEY = "macromint_profile";

  // ── Muscle keyword map ────────────────────────────────────────────────────
  // Maps words that appear in OpenAI output → data-muscle attribute values
  const MUSCLE_MAP = {
    chest:        ["chest", "pec", "pectoral"],
    shoulders:    ["shoulder", "delt", "deltoid", "ohp", "press"],
    traps:        ["trap", "shrug", "upper back"],
    lats:         ["lat", "lats", "pull-up", "pullup", "pull up", "row", "rowing"],
    "lower-back": ["lower back", "erector", "deadlift", "rdl"],
    biceps:       ["bicep", "curl"],
    triceps:      ["tricep", "dip", "skull crusher", "pushdown"],
    forearms:     ["forearm", "wrist"],
    abs:          ["ab ", "abs", "core", "crunch", "plank", "sit-up"],
    obliques:     ["oblique", "side bend", "russian twist"],
    glutes:       ["glut", "hip thrust", "bridge"],
    quads:        ["quad", "squat", "leg press", "lunge", "extension"],
    hamstrings:   ["hamstring", "leg curl", "rdl", "romanian"],
    calves:       ["calf", "calves", "calf raise"],
  };

  const MUSCLE_LABELS = {
    chest: "Chest",
    shoulders: "Shoulders",
    traps: "Traps",
    lats: "Lats",
    "lower-back": "Lower Back",
    biceps: "Biceps",
    triceps: "Triceps",
    forearms: "Forearms",
    abs: "Abs / Core",
    obliques: "Obliques",
    glutes: "Glutes",
    quads: "Quads",
    hamstrings: "Hamstrings",
    calves: "Calves",
  };

  // ── Parse which muscles appear in the plan text ───────────────────────────
  const parseMuscles = (text) => {
    const lower = text.toLowerCase();
    const found = new Set();
    for (const [muscle, keywords] of Object.entries(MUSCLE_MAP)) {
      if (keywords.some((kw) => lower.includes(kw))) {
        found.add(muscle);
      }
    }
    return found;
  };

  // ── Highlight muscles on the SVG body outlines ────────────────────────────
  const highlightMuscles = (muscles) => {
    // Reset all
    document.querySelectorAll(".muscle-group").forEach((el) => {
      el.classList.remove("muscle-active", "muscle-primary");
    });

    muscles.forEach((muscle) => {
      document.querySelectorAll(`.muscle-group[data-muscle="${muscle}"]`).forEach((el) => {
        el.classList.add("muscle-active");
      });
    });

    // Update legend
    const legend = document.getElementById("muscle-legend");
    if (!legend) return;
    if (muscles.size === 0) {
      legend.innerHTML = `<p class="legend-empty">No muscles detected in plan</p>`;
      return;
    }
    legend.innerHTML = [...muscles]
      .map((m) => `<span class="legend-pill">${MUSCLE_LABELS[m] || m}</span>`)
      .join("");
  };

  // ── Render the markdown-like plan text into HTML ──────────────────────────
  const renderPlan = (text) => {
    return text
      // Headers
      .replace(/^### (.+)$/gm, "<h4>$1</h4>")
      .replace(/^## (.+)$/gm, "<h3>$1</h3>")
      .replace(/^# (.+)$/gm, "<h3>$1</h3>")
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Bullet points
      .replace(/^[\-\*] (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, (m) => `<ul>${m}</ul>`)
      // Numbered lists
      .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      // Line breaks
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  };

  // ── Load profile from localStorage ───────────────────────────────────────
  const loadProfile = () => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    } catch {
      return {};
    }
  };

  // ── Pre-fill controls from saved profile ─────────────────────────────────
  const prefillFromProfile = () => {
    const profile = loadProfile();
    if (profile.goalPreset) {
      const sel = document.getElementById("workout-goal");
      if (sel) sel.value = profile.goalPreset;
    }
    if (profile.activityLevel) {
      const sel = document.getElementById("workout-activity");
      if (sel) sel.value = String(profile.activityLevel);
    }
  };

  // ── Generate plan ─────────────────────────────────────────────────────────
  const generatePlan = async () => {
    const btn = document.getElementById("workout-generate-btn");
    const status = document.getElementById("workout-status");
    const resultPanel = document.getElementById("workout-result-panel");
    const output = document.getElementById("workout-output");

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      const notice = document.getElementById("workout-auth-notice");
      if (notice) notice.classList.remove("hidden");
      if (status) status.textContent = "Sign in to generate a personalised plan.";
      return;
    }

    const profile = loadProfile();
    const goalSel     = document.getElementById("workout-goal");
    const activitySel = document.getElementById("workout-activity");

    const payload = {
      sex:           profile.sex,
      age:           profile.age,
      weightKg:      profile.weightKg,
      heightCm:      profile.heightCm,
      goalPreset:    goalSel?.value || profile.goalPreset || "maintain",
      activityLevel: parseFloat(activitySel?.value || "1.55"),
    };

    btn.textContent = "Generating…";
    btn.disabled = true;
    if (status) status.textContent = "Asking AI for your personalised plan…";

    try {
      const res = await fetch(`${API_BASE()}/v1/workout/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.message || `Error ${res.status}`;
        throw new Error(msg);
      }

      const data = await res.json();
      const planText = data.plan || "";

      // Highlight muscles
      const muscles = parseMuscles(planText);
      highlightMuscles(muscles);

      // Render plan
      if (output) output.innerHTML = `<p>${renderPlan(planText)}</p>`;
      if (resultPanel) resultPanel.hidden = false;
      if (status) status.textContent = "";

      // Scroll to plan
      resultPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      if (status) status.textContent = err.message || "Failed to generate plan. Try again.";
    } finally {
      btn.textContent = "Generate My Workout Plan";
      btn.disabled = false;
    }
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    prefillFromProfile();

    // Show auth notice if not signed in
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      const notice = document.getElementById("workout-auth-notice");
      if (notice) notice.classList.remove("hidden");
    }

    document.getElementById("workout-generate-btn")
      ?.addEventListener("click", generatePlan);

    document.getElementById("workout-regenerate-btn")
      ?.addEventListener("click", generatePlan);
  });
})();
