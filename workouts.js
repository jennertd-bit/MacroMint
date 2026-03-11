(() => {
  "use strict";

  const API_BASE  = () => (window.MACROMINT_API || "https://macromint-1.onrender.com").replace(/\/$/, "");
  const TOKEN_KEY   = "macromint_token";
  const PROFILE_KEY = "macromint_profile";

  // ── Exercise database ─────────────────────────────────────────────────────
  const EXERCISES = {
    chest: {
      label: "Chest",
      icon: "🫁",
      exercises: [
        { name: "Barbell Bench Press",       sets: "4 × 6–8",   equipment: "Barbell",    tip: "Plant feet firmly. Lower bar to lower chest, elbows ~45°." },
        { name: "Incline Dumbbell Press",    sets: "3 × 8–10",  equipment: "Dumbbell",   tip: "Set bench to 30–45°. Squeeze at the top, slow on the way down." },
        { name: "Cable Chest Flye",          sets: "3 × 12–15", equipment: "Cable",      tip: "Slight elbow bend. Think 'hugging a tree' – feel the stretch." },
        { name: "Push-Ups",                  sets: "3 × Max",   equipment: "Bodyweight", tip: "Core tight, chest touches floor. Elevate feet to target upper chest." },
        { name: "Dips (Chest Focus)",        sets: "3 × 10–12", equipment: "Bodyweight", tip: "Lean forward ~30°, let elbows flare out slightly." },
        { name: "Machine Chest Press",       sets: "3 × 10–12", equipment: "Machine",    tip: "Great for beginners. Control the negative for max tension." },
      ]
    },
    shoulders: {
      label: "Shoulders",
      icon: "🏋️",
      exercises: [
        { name: "Overhead Press (Barbell)",  sets: "4 × 5–8",   equipment: "Barbell",    tip: "Bar starts at collarbone. Drive head through at the top." },
        { name: "Dumbbell Lateral Raise",    sets: "4 × 12–15", equipment: "Dumbbell",   tip: "Lead with elbows. Slight forward lean to hit medial delt harder." },
        { name: "Arnold Press",              sets: "3 × 10–12", equipment: "Dumbbell",   tip: "Start with palms facing you, rotate outward as you press." },
        { name: "Face Pull",                 sets: "3 × 15–20", equipment: "Cable",      tip: "Rope to face, elbows high. Key for shoulder health." },
        { name: "Upright Row",               sets: "3 × 10–12", equipment: "Barbell",    tip: "Wide grip (wider than shoulder) to reduce impingement risk." },
        { name: "Seated DB Shoulder Press",  sets: "3 × 10–12", equipment: "Dumbbell",   tip: "Press straight up, don't arch. Control the descent." },
      ]
    },
    traps: {
      label: "Traps",
      icon: "🦾",
      exercises: [
        { name: "Barbell Shrug",             sets: "4 × 10–12", equipment: "Barbell",    tip: "Drive shoulders straight up — no rolling. Hold 1s at top." },
        { name: "Dumbbell Shrug",            sets: "3 × 12–15", equipment: "Dumbbell",   tip: "Full range of motion, stretch at the bottom." },
        { name: "Farmer's Carry",            sets: "3 × 40m",   equipment: "Dumbbell",   tip: "Chest up, shoulders packed. Walk briskly." },
        { name: "Cable Shrug",               sets: "3 × 15",    equipment: "Cable",      tip: "Constant tension all the way through. No momentum." },
        { name: "Rack Pull",                 sets: "3 × 5",     equipment: "Barbell",    tip: "Pull from just below knee. Focus on upper-back lockout." },
      ]
    },
    lats: {
      label: "Lats",
      icon: "🪽",
      exercises: [
        { name: "Pull-Up",                   sets: "4 × Max",   equipment: "Bodyweight", tip: "Dead hang start. Drive elbows to hips — think 'lat spread'." },
        { name: "Lat Pulldown",              sets: "4 × 8–12",  equipment: "Cable",      tip: "Slight lean back, drive bar to upper chest. Squeeze lats." },
        { name: "Bent-Over Barbell Row",     sets: "4 × 6–8",   equipment: "Barbell",    tip: "Hinge to ~45°. Pull to belly button, lead with elbows." },
        { name: "Single-Arm DB Row",         sets: "3 × 10–12", equipment: "Dumbbell",   tip: "Support on bench, pull elbow past your hip." },
        { name: "Cable Straight-Arm Pulldown", sets: "3 × 12–15", equipment: "Cable",   tip: "Keep arms straight. Feel the lats fully stretch and contract." },
        { name: "Seated Cable Row",          sets: "3 × 10–12", equipment: "Cable",      tip: "Chest tall, pull to belly. Squeeze shoulder blades together." },
      ]
    },
    "lower-back": {
      label: "Lower Back",
      icon: "🔩",
      exercises: [
        { name: "Romanian Deadlift (RDL)",   sets: "4 × 8–10",  equipment: "Barbell",    tip: "Push hips back, bar stays close to legs. Feel hamstring stretch." },
        { name: "Back Extension",            sets: "3 × 12–15", equipment: "Bodyweight", tip: "Controlled movement, squeeze glutes at top. Add plate for load." },
        { name: "Good Morning",              sets: "3 × 10",    equipment: "Barbell",    tip: "Light weight. Hinge at hips with soft knees. Never round spine." },
        { name: "Deadlift",                  sets: "4 × 4–6",   equipment: "Barbell",    tip: "Neutral spine, big breath, lat engagement before you pull." },
        { name: "Bird-Dog",                  sets: "3 × 10ea",  equipment: "Bodyweight", tip: "Core brace, extend opposite arm/leg. Hold 2s. Great for rehab." },
        { name: "Superman Hold",             sets: "3 × 15",    equipment: "Bodyweight", tip: "Lift arms, chest, and legs off floor. Hold 2–3s at top." },
      ]
    },
    biceps: {
      label: "Biceps",
      icon: "💪",
      exercises: [
        { name: "Barbell Curl",              sets: "4 × 8–10",  equipment: "Barbell",    tip: "Elbows pinned to sides. Full extension at bottom." },
        { name: "Hammer Curl",               sets: "3 × 10–12", equipment: "Dumbbell",   tip: "Neutral grip. Hits brachialis — gives arms more thickness." },
        { name: "Incline Dumbbell Curl",     sets: "3 × 10–12", equipment: "Dumbbell",   tip: "Recline on incline bench. Arms hang back for full stretch." },
        { name: "Cable Curl",                sets: "3 × 12–15", equipment: "Cable",      tip: "Constant tension. Great as a finisher." },
        { name: "Concentration Curl",        sets: "3 × 12ea",  equipment: "Dumbbell",   tip: "Elbow on inner thigh. Full squeeze at top." },
        { name: "EZ-Bar Preacher Curl",      sets: "3 × 10–12", equipment: "Barbell",    tip: "Pad supports upper arm. Prevents cheating — strict form." },
      ]
    },
    triceps: {
      label: "Triceps",
      icon: "🔱",
      exercises: [
        { name: "Close-Grip Bench Press",    sets: "4 × 6–8",   equipment: "Barbell",    tip: "Hands shoulder-width. Elbows in — maximum tricep activation." },
        { name: "Overhead Tricep Extension", sets: "3 × 10–12", equipment: "Dumbbell",   tip: "One or two dumbbells. Stretch the long head — huge growth driver." },
        { name: "Rope Pushdown",             sets: "3 × 12–15", equipment: "Cable",      tip: "Split the rope at the bottom. Lock elbows to sides." },
        { name: "Skull Crusher",             sets: "3 × 10–12", equipment: "Barbell",    tip: "Lower bar to forehead (almost). Slow negative. Great mass builder." },
        { name: "Dips (Tricep Focus)",       sets: "3 × Max",   equipment: "Bodyweight", tip: "Body upright, elbows close to ribs. Full extension at top." },
        { name: "Kickback",                  sets: "3 × 12–15", equipment: "Dumbbell",   tip: "Upper arm parallel to floor. Extend fully and hold 1s." },
      ]
    },
    forearms: {
      label: "Forearms",
      icon: "✊",
      exercises: [
        { name: "Wrist Curl",                sets: "3 × 15–20", equipment: "Dumbbell",   tip: "Rest forearm on knee, curl wrist up. Full range." },
        { name: "Reverse Wrist Curl",        sets: "3 × 15–20", equipment: "Dumbbell",   tip: "Overhand grip. Hits extensors for balanced forearm strength." },
        { name: "Farmer's Carry",            sets: "3 × 40m",   equipment: "Dumbbell",   tip: "Heavy grip challenge. Walk slowly, keep shoulders level." },
        { name: "Reverse Curl",              sets: "3 × 12",    equipment: "Barbell",    tip: "Overhand grip curl. Great for brachioradialis development." },
        { name: "Dead Hang",                 sets: "3 × 30–60s",equipment: "Bodyweight", tip: "Just hang from a bar. Builds grip and decompresses spine." },
      ]
    },
    abs: {
      label: "Abs / Core",
      icon: "🧱",
      exercises: [
        { name: "Plank",                     sets: "3 × 45–60s",equipment: "Bodyweight", tip: "Squeeze glutes and abs. Don't let hips rise or sag." },
        { name: "Hanging Leg Raise",         sets: "3 × 12–15", equipment: "Bodyweight", tip: "Control the swing. Lower slowly. Bend knees to regress." },
        { name: "Cable Crunch",              sets: "3 × 12–15", equipment: "Cable",      tip: "Round spine toward pelvis. Don't just hinge at hips." },
        { name: "Ab Wheel Rollout",          sets: "3 × 8–12",  equipment: "Equipment",  tip: "Keep hips in line. Squeeze hard to pull back in." },
        { name: "Decline Sit-Up",            sets: "3 × 15",    equipment: "Machine",    tip: "Add plate to chest for progression. Full range of motion." },
        { name: "Bicycle Crunch",            sets: "3 × 20ea",  equipment: "Bodyweight", tip: "Slow and controlled. Elbow to opposite knee." },
      ]
    },
    obliques: {
      label: "Obliques",
      icon: "↔️",
      exercises: [
        { name: "Russian Twist",             sets: "3 × 20",    equipment: "Bodyweight", tip: "Feet up, rotate fully side to side. Add plate for load." },
        { name: "Side Plank",                sets: "3 × 30–45s",equipment: "Bodyweight", tip: "Hips stacked. Top hip slightly forward to engage obliques more." },
        { name: "Cable Woodchopper",         sets: "3 × 12ea",  equipment: "Cable",      tip: "Rotate from high to low or low to high. Pivot back foot." },
        { name: "Pallof Press",              sets: "3 × 12ea",  equipment: "Cable",      tip: "Anti-rotation drill. Press and hold 2s. Core must resist twist." },
        { name: "Suitcase Carry",            sets: "3 × 30m ea",equipment: "Dumbbell",   tip: "Heavy weight one side. Core fights the lean — obliques fire." },
      ]
    },
    glutes: {
      label: "Glutes",
      icon: "🍑",
      exercises: [
        { name: "Hip Thrust (Barbell)",      sets: "4 × 8–12",  equipment: "Barbell",    tip: "Drive through heels. Squeeze hard at top. Chin to chest." },
        { name: "Bulgarian Split Squat",     sets: "3 × 10ea",  equipment: "Dumbbell",   tip: "Front foot forward. Sink straight down. Posterior tilt at top." },
        { name: "Sumo Deadlift",             sets: "4 × 6–8",   equipment: "Barbell",    tip: "Wide stance, toes out. Drive knees out and thrust hips." },
        { name: "Glute Bridge",              sets: "3 × 15–20", equipment: "Bodyweight", tip: "Feet flat, drive hips up. Add band above knees for activation." },
        { name: "Cable Kickback",            sets: "3 × 15ea",  equipment: "Cable",      tip: "Slight forward lean. Squeeze glute fully at extension." },
        { name: "Step-Up",                   sets: "3 × 12ea",  equipment: "Dumbbell",   tip: "Drive through the heel of the raised leg. Control descent." },
      ]
    },
    quads: {
      label: "Quads",
      icon: "🦵",
      exercises: [
        { name: "Back Squat",                sets: "4 × 5–8",   equipment: "Barbell",    tip: "Knees track over toes. Break parallel. Chest tall." },
        { name: "Leg Press",                 sets: "4 × 10–12", equipment: "Machine",    tip: "Feet hip-width. Full range — don't lock knees at top." },
        { name: "Front Squat",               sets: "3 × 6–8",   equipment: "Barbell",    tip: "More quad, less back. Keep torso vertical throughout." },
        { name: "Walking Lunge",             sets: "3 × 12ea",  equipment: "Dumbbell",   tip: "Long stride. Front shin vertical. Drive through front heel." },
        { name: "Leg Extension",             sets: "3 × 12–15", equipment: "Machine",    tip: "Great isolation finisher. Slow negative. Hold 1s at top." },
        { name: "Hack Squat",                sets: "3 × 10",    equipment: "Machine",    tip: "Feet low on platform = more quad. Deep range of motion." },
      ]
    },
    hamstrings: {
      label: "Hamstrings",
      icon: "🔗",
      exercises: [
        { name: "Romanian Deadlift",         sets: "4 × 8–10",  equipment: "Barbell",    tip: "The king of hamstring work. Push hips back, bar stays close." },
        { name: "Lying Leg Curl",            sets: "3 × 10–12", equipment: "Machine",    tip: "Point toes down. Curl through full range, hold 1s at top." },
        { name: "Nordic Curl",               sets: "3 × 5–8",   equipment: "Bodyweight", tip: "Hardest bodyweight hamstring move. Lower slowly — eccentric focus." },
        { name: "Seated Leg Curl",           sets: "3 × 12",    equipment: "Machine",    tip: "More stretch than lying version. Higher hip flexion." },
        { name: "Stiff-Leg Deadlift",        sets: "3 × 10",    equipment: "Dumbbell",   tip: "Less hip hinge than RDL. Feel the hamstring tension throughout." },
        { name: "Good Morning",              sets: "3 × 10",    equipment: "Barbell",    tip: "Light weight. Hip hinge with soft knees. Slow and controlled." },
      ]
    },
    calves: {
      label: "Calves",
      icon: "🦷",
      exercises: [
        { name: "Standing Calf Raise",       sets: "4 × 15–20", equipment: "Machine",    tip: "Full range — stretch at bottom, squeeze at top. Slow tempo." },
        { name: "Seated Calf Raise",         sets: "3 × 15–20", equipment: "Machine",    tip: "Hits the soleus. Essential for full calf development." },
        { name: "Donkey Calf Raise",         sets: "3 × 15",    equipment: "Bodyweight", tip: "Hinge forward 90°. Best stretch on the gastrocnemius." },
        { name: "Single-Leg Calf Raise",     sets: "3 × 12ea",  equipment: "Bodyweight", tip: "Hold onto wall. Full range. Hard but great for imbalances." },
        { name: "Jump Rope",                 sets: "3 × 2 min", equipment: "Equipment",  tip: "Continuous plyometric calf work. Also great for conditioning." },
      ]
    },
  };

  // ── Muscle keyword map ────────────────────────────────────────────────────
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

  // ── State ─────────────────────────────────────────────────────────────────
  let selectedMuscle = null;

  // ── Render exercise cards ─────────────────────────────────────────────────
  const renderExercises = (muscleKey) => {
    const data = EXERCISES[muscleKey];
    if (!data) return;

    const panel = document.getElementById("muscle-exercises");
    if (!panel) return;

    panel.innerHTML = `
      <div class="exercise-header">
        <span class="exercise-icon">${data.icon}</span>
        <div>
          <h3 class="exercise-title">${data.label}</h3>
          <p class="exercise-subtitle">${data.exercises.length} exercises · tap any to add to your log</p>
        </div>
      </div>
      <div class="exercise-grid">
        ${data.exercises.map(ex => `
          <div class="exercise-card">
            <div class="exercise-card-top">
              <span class="exercise-name">${ex.name}</span>
              <span class="exercise-sets-badge">${ex.sets}</span>
            </div>
            <span class="exercise-equip">${ex.equipment}</span>
            <p class="exercise-tip">💡 ${ex.tip}</p>
          </div>
        `).join("")}
      </div>
    `;

    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // ── Select a muscle ───────────────────────────────────────────────────────
  const selectMuscle = (muscleKey) => {
    // Deselect all
    document.querySelectorAll(".muscle-group").forEach(el => {
      el.classList.remove("muscle-selected", "muscle-active");
    });

    if (selectedMuscle === muscleKey) {
      // Toggle off
      selectedMuscle = null;
      const panel = document.getElementById("muscle-exercises");
      if (panel) panel.classList.add("hidden");
      updateLegend(new Set());
      return;
    }

    selectedMuscle = muscleKey;

    // Highlight selected muscle
    document.querySelectorAll(`.muscle-group[data-muscle="${muscleKey}"]`).forEach(el => {
      el.classList.add("muscle-selected");
    });

    updateLegend(new Set([muscleKey]));
    renderExercises(muscleKey);
  };

  // ── Update legend ─────────────────────────────────────────────────────────
  const updateLegend = (muscles) => {
    const legend = document.getElementById("muscle-legend");
    if (!legend) return;
    if (muscles.size === 0) {
      legend.innerHTML = `<p class="legend-empty">Tap a muscle to see exercises</p>`;
      return;
    }
    legend.innerHTML = [...muscles]
      .map(m => `<span class="legend-pill">${EXERCISES[m]?.label || m}</span>`)
      .join("");
  };

  // ── Highlight muscles from AI plan ────────────────────────────────────────
  const parseMuscles = (text) => {
    const lower = text.toLowerCase();
    const found = new Set();
    for (const [muscle, keywords] of Object.entries(MUSCLE_MAP)) {
      if (keywords.some(kw => lower.includes(kw))) found.add(muscle);
    }
    return found;
  };

  const highlightPlanMuscles = (muscles) => {
    document.querySelectorAll(".muscle-group").forEach(el => {
      el.classList.remove("muscle-active", "muscle-selected");
    });
    muscles.forEach(muscle => {
      document.querySelectorAll(`.muscle-group[data-muscle="${muscle}"]`).forEach(el => {
        el.classList.add("muscle-active");
      });
    });
    updateLegend(muscles);
  };

  // ── Render markdown plan ──────────────────────────────────────────────────
  const renderPlan = (text) => {
    return text
      .replace(/^### (.+)$/gm, "<h4>$1</h4>")
      .replace(/^## (.+)$/gm, "<h3>$1</h3>")
      .replace(/^# (.+)$/gm, "<h3>$1</h3>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^[\-\*] (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, m => `<ul>${m}</ul>`)
      .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  };

  // ── Profile helpers ───────────────────────────────────────────────────────
  const loadProfile = () => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); }
    catch { return {}; }
  };

  const prefillFromProfile = () => {
    const p = loadProfile();
    if (p.goalPreset) {
      const s = document.getElementById("workout-goal");
      if (s) s.value = p.goalPreset;
    }
    if (p.activityLevel) {
      const s = document.getElementById("workout-activity");
      if (s) s.value = String(p.activityLevel);
    }
  };

  // ── Generate AI plan ──────────────────────────────────────────────────────
  const generatePlan = async () => {
    const btn         = document.getElementById("workout-generate-btn");
    const status      = document.getElementById("workout-status");
    const resultPanel = document.getElementById("workout-result-panel");
    const output      = document.getElementById("workout-output");

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      const notice = document.getElementById("workout-auth-notice");
      if (notice) notice.classList.remove("hidden");
      if (status) status.textContent = "Sign in to generate a personalised plan.";
      return;
    }

    const profile     = loadProfile();
    const goalSel     = document.getElementById("workout-goal");
    const activitySel = document.getElementById("workout-activity");

    const payload = {
      sex:           profile.sex,
      age:           profile.age,
      weightKg:      profile.weightKg,
      heightCm:      profile.heightCm,
      tdeeValue:     profile.tdee,
      adaptiveTdeeValue: profile.adaptiveTdee,
      goalPreset:    goalSel?.value || profile.goalPreset || "maintain",
      activityLevel: parseFloat(activitySel?.value || "1.55"),
    };

    btn.textContent = "Generating…";
    btn.disabled    = true;
    if (status) status.textContent = "Building your personalised plan…";

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
        throw new Error(data?.message || `Error ${res.status}`);
      }

      const data     = await res.json();
      const planText = data.plan || "";

      // Light up muscles from plan text
      const muscles = parseMuscles(planText);
      highlightPlanMuscles(muscles);

      // Hide click-mode exercise panel when plan is shown
      const exPanel = document.getElementById("muscle-exercises");
      if (exPanel) exPanel.classList.add("hidden");
      selectedMuscle = null;

      if (output) output.innerHTML = `<p>${renderPlan(planText)}</p>`;
      if (resultPanel) resultPanel.hidden = false;
      if (status) status.textContent = "";
      resultPanel?.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (err) {
      if (status) status.textContent = err.message || "Failed to generate plan. Try again.";
    } finally {
      btn.textContent = "Generate My Workout Plan";
      btn.disabled    = false;
    }
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    prefillFromProfile();

    // Show auth notice if not signed in
    if (!localStorage.getItem(TOKEN_KEY)) {
      const notice = document.getElementById("workout-auth-notice");
      if (notice) notice.classList.remove("hidden");
    }

    // Make all muscle groups clickable
    document.querySelectorAll(".muscle-group").forEach(el => {
      el.addEventListener("click", () => {
        const muscle = el.getAttribute("data-muscle");
        if (muscle) selectMuscle(muscle);
      });
    });

    // Init legend hint
    updateLegend(new Set());

    // Generate plan buttons
    document.getElementById("workout-generate-btn")
      ?.addEventListener("click", generatePlan);
    document.getElementById("workout-regenerate-btn")
      ?.addEventListener("click", generatePlan);
  });
})();
