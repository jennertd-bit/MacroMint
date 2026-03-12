(() => {
  "use strict";

  const API_BASE  = () => (window.MACROMINT_API || "https://macromint-1.onrender.com").replace(/\/$/, "");
  const TOKEN_KEY        = "macromint_token";
  const PROFILE_KEY      = "macromint_profile";
  const WORKOUT_LOG_KEY  = "macromint_workout_log";

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
  let currentSession = { exercises: [], muscles: new Set() };
  let pendingLogExercise = null;

  // ── Workout Log Storage ───────────────────────────────────────────────────
  const loadWorkoutLog = () => {
    try { return JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY) || "[]"); }
    catch { return []; }
  };
  const saveWorkoutLog = (log) => {
    localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(log.slice(-120)));
  };

  // ── Render exercise cards ─────────────────────────────────────────────────
  const renderExercises = (muscleKey) => {
    const data = EXERCISES[muscleKey];
    if (!data) return;

    const panel = document.getElementById("muscle-exercises");
    if (!panel) return;

    // Mark exercises already in current session
    const loggedNames = new Set(currentSession.exercises.map(e => e.name));

    panel.innerHTML = `
      <div class="exercise-header">
        <span class="exercise-icon">${data.icon}</span>
        <div>
          <h3 class="exercise-title">${data.label}</h3>
          <p class="exercise-subtitle">${data.exercises.length} exercises · tap to log any to your session</p>
        </div>
      </div>
      <div class="exercise-grid">
        ${data.exercises.map(ex => `
          <div class="exercise-card${loggedNames.has(ex.name) ? " exercise-logged" : ""}"
               data-exercise="${ex.name.replace(/"/g, "&quot;")}"
               data-sets="${ex.sets.replace(/"/g, "&quot;")}"
               data-muscle="${muscleKey}">
            <div class="exercise-card-top">
              <span class="exercise-name">${ex.name}</span>
              <span class="exercise-sets-badge">${ex.sets}</span>
            </div>
            <span class="exercise-equip">${ex.equipment}</span>
            <p class="exercise-tip">💡 ${ex.tip}</p>
            <button class="log-exercise-btn${loggedNames.has(ex.name) ? " log-exercise-btn--done" : ""}">
              ${loggedNames.has(ex.name) ? "✓ Logged" : "+ Log"}
            </button>
          </div>
        `).join("")}
      </div>
    `;

    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // ── Select a muscle ───────────────────────────────────────────────────────
  const selectMuscle = (muscleKey) => {
    document.querySelectorAll(".muscle-group").forEach(el => {
      el.classList.remove("muscle-selected", "muscle-active");
    });

    if (selectedMuscle === muscleKey) {
      selectedMuscle = null;
      const panel = document.getElementById("muscle-exercises");
      if (panel) panel.classList.add("hidden");
      updateLegend(new Set());
      return;
    }

    selectedMuscle = muscleKey;
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
      const trained = getTrainedThisWeek();
      if (trained.size > 0) {
        legend.innerHTML = `
          <p class="legend-trained-hint">🔥 Trained this week: ${[...trained].map(m => EXERCISES[m]?.label || m).join(", ")}</p>
          <p class="legend-empty">Tap a muscle to see exercises</p>`;
      } else {
        legend.innerHTML = `<p class="legend-empty">Tap a muscle to see exercises</p>`;
      }
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

  // ── Highlight muscles trained this week ───────────────────────────────────
  const getTrainedThisWeek = () => {
    const log = loadWorkoutLog();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffKey = cutoff.toISOString().slice(0, 10);
    const trained = new Set();
    log.filter(w => w.date >= cutoffKey).forEach(w => {
      (w.muscles || []).forEach(m => trained.add(m));
    });
    return trained;
  };

  const highlightTrainedThisWeek = () => {
    const trained = getTrainedThisWeek();
    document.querySelectorAll(".muscle-group").forEach(el => {
      el.classList.remove("muscle-trained");
    });
    trained.forEach(muscle => {
      document.querySelectorAll(`.muscle-group[data-muscle="${muscle}"]`).forEach(el => {
        el.classList.add("muscle-trained");
      });
    });
    updateLegend(new Set());
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

  // ── Local plan templates (fallback when API unavailable) ─────────────────
  const LOCAL_PLANS = {
    lose: `# Fat Loss — Push / Pull / Legs + Cardio
## Training Split
Push/Pull/Legs 3× per week with cardio on off-days. Designed to preserve lean muscle while maximising calorie burn.

### Monday — Push (Chest · Shoulders · Triceps)
- **Barbell Bench Press** — 4 × 8, rest 90s
- **Incline Dumbbell Press** — 3 × 10, rest 60s
- **Dumbbell Lateral Raise** — 4 × 15, rest 45s
- **Overhead Tricep Extension** — 3 × 12, rest 60s
- **Rope Pushdown** — 3 × 15, rest 45s

### Tuesday — Cardio + Core
- **Treadmill intervals** — 20 min (1 min sprint / 2 min walk)
- **Plank** — 3 × 60s
- **Hanging Leg Raise** — 3 × 12
- **Russian Twist** — 3 × 20

### Wednesday — Pull (Back · Biceps)
- **Pull-Up** — 4 × Max, rest 90s
- **Bent-Over Barbell Row** — 4 × 8, rest 90s
- **Seated Cable Row** — 3 × 12, rest 60s
- **Barbell Curl** — 3 × 10, rest 60s
- **Hammer Curl** — 3 × 12, rest 45s

### Thursday — Cardio
- **Steady-state cardio** — 35 min (bike, elliptical, or jog at 65% max HR)

### Friday — Legs
- **Back Squat** — 4 × 8, rest 2 min
- **Romanian Deadlift** — 3 × 10, rest 90s
- **Leg Press** — 3 × 12, rest 60s
- **Leg Curl** — 3 × 12, rest 60s
- **Calf Raise** — 4 × 20, rest 45s

### Saturday — Active Recovery / LISS
- Light walk, yoga, or mobility — 30–45 min

### Sunday — Rest

## Nutrition Tips
- **Protein first**: Hit 0.8–1g per lb of bodyweight to preserve muscle in a deficit.
- **Eat around training**: Carbs before workouts, protein + veggies after.

## Recovery Tip
Aim for 7–9 hours of sleep. Cortisol from poor sleep drives fat storage and muscle loss.`,

    gain: `# Muscle Gain — Upper / Lower Split
## Training Split
Upper/Lower 4× per week. Progressive overload is the key driver — add weight or reps each session.

### Monday — Upper (Strength Focus)
- **Barbell Bench Press** — 4 × 5, rest 2–3 min
- **Bent-Over Barbell Row** — 4 × 5, rest 2–3 min
- **Overhead Press** — 3 × 6, rest 2 min
- **Weighted Pull-Up** — 3 × 6, rest 2 min
- **Skull Crusher** — 3 × 8, rest 90s

### Tuesday — Lower (Strength Focus)
- **Back Squat** — 4 × 5, rest 2–3 min
- **Romanian Deadlift** — 3 × 6, rest 2 min
- **Leg Press** — 3 × 8, rest 90s
- **Nordic Curl** — 3 × 6, rest 2 min
- **Standing Calf Raise** — 4 × 12, rest 60s

### Wednesday — Rest / Light Cardio (20 min max)

### Thursday — Upper (Hypertrophy Focus)
- **Incline Dumbbell Press** — 4 × 10, rest 60s
- **Lat Pulldown** — 4 × 10, rest 60s
- **Cable Chest Flye** — 3 × 15, rest 45s
- **Face Pull** — 3 × 15, rest 45s
- **Barbell Curl** — 3 × 12, rest 60s
- **Rope Pushdown** — 3 × 12, rest 60s

### Friday — Lower (Hypertrophy Focus)
- **Leg Press** — 4 × 12, rest 60s
- **Bulgarian Split Squat** — 3 × 10 each, rest 90s
- **Lying Leg Curl** — 3 × 12, rest 60s
- **Hip Thrust** — 3 × 12, rest 60s
- **Seated Calf Raise** — 4 × 15, rest 45s

### Saturday — Rest

### Sunday — Rest

## Nutrition Tips
- **Caloric surplus**: Aim for +300–500 kcal above TDEE from whole foods.
- **Pre-workout carbs**: 40–60g of carbs 60–90 min before training for peak performance.

## Recovery Tip
Sleep 8+ hours. Growth hormone peaks during deep sleep — this is when muscle is actually built.`,

    maintain: `# Maintenance — Full Body 3× / Week
## Training Split
Full body sessions Monday / Wednesday / Friday. Balanced volume keeps all muscle groups stimulated.

### Monday — Full Body A
- **Back Squat** — 3 × 6, rest 2 min
- **Barbell Bench Press** — 3 × 8, rest 90s
- **Bent-Over Row** — 3 × 8, rest 90s
- **Overhead Press** — 3 × 10, rest 60s
- **Plank** — 3 × 45s

### Tuesday — Cardio (optional)
- 20–30 min moderate cardio (jog, bike, swim)

### Wednesday — Full Body B
- **Deadlift** — 3 × 5, rest 2–3 min
- **Incline Dumbbell Press** — 3 × 10, rest 60s
- **Pull-Up or Lat Pulldown** — 3 × 8, rest 90s
- **Dumbbell Lateral Raise** — 3 × 12, rest 45s
- **Hanging Leg Raise** — 3 × 10

### Thursday — Rest

### Friday — Full Body C
- **Front Squat** — 3 × 8, rest 90s
- **Cable Row** — 3 × 10, rest 60s
- **Dips** — 3 × 10, rest 60s
- **Barbell Curl** — 3 × 10, rest 60s
- **Romanian Deadlift** — 3 × 10, rest 60s

### Saturday — Active Recovery
- Walk 30 min, yoga, or light mobility work

### Sunday — Rest

## Nutrition Tips
- **Match calories to output**: Keep protein at 0.7–0.8g per lb to maintain muscle.
- **Carb timing**: Eat most carbs around training for energy and recovery.

## Recovery Tip
Take one full rest day between each training session. Consistency over intensity wins long-term.`,
  };

  const planKey = (goal) => {
    if (["lose","shred","diet"].includes(goal)) return "lose";
    if (["gain","bulk","recomp"].includes(goal))  return "gain";
    return "maintain";
  };

  // ── Generate plan (API → local fallback) ──────────────────────────────────
  const generatePlan = async () => {
    const btn         = document.getElementById("workout-generate-btn");
    const status      = document.getElementById("workout-status");
    const resultPanel = document.getElementById("workout-result-panel");
    const output      = document.getElementById("workout-output");

    const profile     = loadProfile();
    const goalSel     = document.getElementById("workout-goal");
    const activitySel = document.getElementById("workout-activity");
    const goal        = goalSel?.value || profile.goalPreset || "maintain";
    const activity    = parseFloat(activitySel?.value || "1.55");

    if (btn) { btn.textContent = "Generating…"; btn.disabled = true; }
    if (status) status.textContent = "Building your personalised plan…";

    let planText = "";
    let source   = "local";

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const res = await fetch(`${API_BASE()}/v1/workout/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            sex: profile.sex, age: profile.age,
            weightKg: profile.weightKg, heightCm: profile.heightCm,
            tdeeValue: profile.tdee, adaptiveTdeeValue: profile.adaptiveTdee,
            goalPreset: goal, activityLevel: activity,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          planText = data.plan || "";
          source = "ai";
        }
      } catch (_) { /* fall through to local */ }
    }

    if (!planText) {
      planText = LOCAL_PLANS[planKey(goal)];
      source = "local";
    }

    const muscles = parseMuscles(planText);
    highlightPlanMuscles(muscles);
    const exPanel = document.getElementById("muscle-exercises");
    if (exPanel) exPanel.classList.add("hidden");
    selectedMuscle = null;

    if (output) output.innerHTML = `<p>${renderPlan(planText)}</p>`;
    if (resultPanel) resultPanel.hidden = false;
    if (status) status.textContent = source === "ai" ? "AI plan generated." : "Plan ready — sign in to unlock personalised AI plans.";
    resultPanel?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (btn) { btn.textContent = "Generate My Workout Plan"; btn.disabled = false; }
  };

  // ── Log Exercise Modal ────────────────────────────────────────────────────
  const openLogModal = (exerciseName, defaultSets, muscleKey) => {
    pendingLogExercise = { name: exerciseName, muscleKey };
    const modal = document.getElementById("log-exercise-modal");
    if (!modal) return;

    const nameEl = document.getElementById("log-ex-name");
    if (nameEl) nameEl.textContent = exerciseName;

    // Parse "4 × 6–8" → sets=4, reps="6–8"
    const setsNum = parseInt(defaultSets) || 3;
    const repsPart = defaultSets.includes("×") ? defaultSets.split("×")[1].trim() : "10";
    const setsInput = document.getElementById("log-ex-sets");
    const repsInput = document.getElementById("log-ex-reps");
    if (setsInput) setsInput.value = setsNum;
    if (repsInput) repsInput.value = repsPart;
    const weightInput = document.getElementById("log-ex-weight");
    if (weightInput) { weightInput.value = ""; weightInput.focus(); }

    modal.removeAttribute("hidden");
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("is-open")));
  };

  const closeLogModal = () => {
    const modal = document.getElementById("log-exercise-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    setTimeout(() => modal.setAttribute("hidden", ""), 300);
    pendingLogExercise = null;
  };

  // ── Session management ────────────────────────────────────────────────────
  const addToSession = () => {
    if (!pendingLogExercise) return;
    const sets   = parseInt(document.getElementById("log-ex-sets")?.value) || 3;
    const reps   = document.getElementById("log-ex-reps")?.value || "10";
    const weight = parseFloat(document.getElementById("log-ex-weight")?.value) || 0;
    const unit   = document.getElementById("log-ex-unit")?.value || "lb";

    currentSession.exercises.push({
      name: pendingLogExercise.name,
      sets, reps, weight, unit,
      muscleKey: pendingLogExercise.muscleKey,
    });
    if (pendingLogExercise.muscleKey) currentSession.muscles.add(pendingLogExercise.muscleKey);

    closeLogModal();
    updateSessionBar();

    // Re-render exercise list to show logged state
    if (selectedMuscle) renderExercises(selectedMuscle);
  };

  const updateSessionBar = () => {
    const bar = document.getElementById("session-bar");
    if (!bar) return;
    const count = currentSession.exercises.length;
    if (count === 0) { bar.setAttribute("hidden", ""); return; }

    bar.removeAttribute("hidden");
    const countEl = document.getElementById("session-count");
    if (countEl) countEl.textContent = `${count} exercise${count !== 1 ? "s" : ""}`;
    const musclesEl = document.getElementById("session-muscles");
    if (musclesEl) {
      const labels = [...currentSession.muscles].map(m => EXERCISES[m]?.label || m);
      musclesEl.textContent = labels.join(" · ");
    }
  };

  // ── Save Session Modal ────────────────────────────────────────────────────
  const openSaveModal = () => {
    const modal = document.getElementById("save-session-modal");
    if (!modal) return;
    const muscles = [...currentSession.muscles];
    const suggested = muscles.length
      ? muscles.map(m => EXERCISES[m]?.label || m).slice(0, 2).join(" & ") + " Day"
      : "Workout";
    const nameInput = document.getElementById("save-session-name");
    const durInput  = document.getElementById("save-session-duration");
    if (nameInput) nameInput.value = suggested;
    if (durInput)  durInput.value  = "";
    modal.removeAttribute("hidden");
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("is-open")));
  };

  const closeSaveModal = () => {
    const modal = document.getElementById("save-session-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    setTimeout(() => modal.setAttribute("hidden", ""), 300);
  };

  const confirmSaveSession = () => {
    const name     = document.getElementById("save-session-name")?.value?.trim() || "Workout";
    const duration = parseInt(document.getElementById("save-session-duration")?.value) || 45;
    const today    = new Date().toISOString().slice(0, 10);

    const log = loadWorkoutLog();
    log.push({
      id:             Date.now(),
      date:           today,
      name,
      duration,
      muscles:        [...currentSession.muscles],
      exercises:      currentSession.exercises,
      caloriesBurned: Math.round(duration * 6),
    });
    saveWorkoutLog(log);

    // Reset
    currentSession = { exercises: [], muscles: new Set() };
    updateSessionBar();
    closeSaveModal();
    renderWorkoutHistory();
    highlightTrainedThisWeek();
    if (selectedMuscle) renderExercises(selectedMuscle);

    const statusEl = document.getElementById("workout-status");
    if (statusEl) {
      statusEl.textContent = `✓ ${name} saved — ${duration} min, ~${Math.round(duration * 6)} kcal burned`;
      setTimeout(() => { if (statusEl.textContent.startsWith("✓")) statusEl.textContent = ""; }, 5000);
    }
  };

  // ── Workout History ───────────────────────────────────────────────────────
  const calcStreak = (log) => {
    if (!log.length) return 0;
    const dates = [...new Set(log.map(w => w.date))].sort().reverse();
    let streak = 0;
    let d = new Date();
    // Allow today or yesterday as start of streak
    d.setHours(0, 0, 0, 0);
    let expected = d.toISOString().slice(0, 10);
    for (const date of dates) {
      if (date === expected) {
        streak++;
        const prev = new Date(d);
        prev.setDate(prev.getDate() - 1);
        expected = prev.toISOString().slice(0, 10);
        d = prev;
      } else {
        break;
      }
    }
    return streak;
  };

  const formatHistoryDate = (dateStr) => {
    const today     = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (dateStr === today)     return "Today";
    if (dateStr === yesterday) return "Yesterday";
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const renderWorkoutHistory = () => {
    const list = document.getElementById("workout-history-list");
    if (!list) return;

    const allLog = loadWorkoutLog();
    const log    = allLog.slice().reverse().slice(0, 10);
    const streak = calcStreak(allLog);

    // Streak badge
    const badge = document.getElementById("workout-streak-badge");
    if (badge) {
      if (streak > 0) {
        badge.textContent = `🔥 ${streak} day${streak !== 1 ? "s" : ""}`;
        badge.removeAttribute("hidden");
      } else {
        badge.setAttribute("hidden", "");
      }
    }

    // Workouts this week count
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const thisWeek = allLog.filter(w => w.date >= cutoff.toISOString().slice(0, 10)).length;
    const weekEl = document.getElementById("workouts-this-week");
    if (weekEl) weekEl.textContent = thisWeek;

    if (log.length === 0) {
      list.innerHTML = `<p class="muted" style="font-size:0.85rem;padding:12px 0">No workouts logged yet. Tap a muscle above, then hit <strong>+ Log</strong> on any exercise.</p>`;
      return;
    }

    list.innerHTML = log.map(w => {
      const dateLabel  = formatHistoryDate(w.date);
      const exCount    = w.exercises?.length || 0;
      const stats      = [];
      if (w.duration) stats.push(`${w.duration} min`);
      if (exCount)    stats.push(`${exCount} ex`);
      if (w.caloriesBurned) stats.push(`~${w.caloriesBurned} kcal`);

      const muscleChips = (w.muscles || [])
        .map(m => `<span class="history-muscle-chip">${EXERCISES[m]?.label || m}</span>`)
        .join("");

      return `
        <div class="workout-history-item">
          <div class="workout-history-top">
            <div class="workout-history-name-wrap">
              <span class="workout-history-name">${w.name}</span>
              <span class="workout-history-date">${dateLabel}</span>
            </div>
            <span class="workout-history-stats">${stats.join(" · ")}</span>
          </div>
          ${muscleChips ? `<div class="history-muscle-chips">${muscleChips}</div>` : ""}
        </div>`;
    }).join("");
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    prefillFromProfile();

    if (!localStorage.getItem(TOKEN_KEY)) {
      const notice = document.getElementById("workout-auth-notice");
      if (notice) notice.classList.remove("hidden");
    }

    // Muscle body map clicks
    document.querySelectorAll(".muscle-group").forEach(el => {
      el.addEventListener("click", () => {
        const muscle = el.getAttribute("data-muscle");
        if (muscle) selectMuscle(muscle);
      });
    });

    updateLegend(new Set());
    highlightTrainedThisWeek();
    renderWorkoutHistory();

    // Generate plan buttons
    document.getElementById("workout-generate-btn")
      ?.addEventListener("click", generatePlan);
    document.getElementById("workout-regenerate-btn")
      ?.addEventListener("click", generatePlan);

    // ── Exercise card log button (delegated) ──────────────────────────────
    document.addEventListener("click", e => {
      const logBtn = e.target.closest(".log-exercise-btn");
      if (logBtn) {
        const card = logBtn.closest(".exercise-card");
        if (card) {
          openLogModal(
            card.dataset.exercise,
            card.dataset.sets,
            card.dataset.muscle
          );
        }
      }
    });

    // ── Log modal buttons ─────────────────────────────────────────────────
    document.getElementById("log-ex-close")
      ?.addEventListener("click", closeLogModal);
    document.getElementById("log-exercise-modal")
      ?.querySelector(".log-ex-backdrop")
      ?.addEventListener("click", closeLogModal);
    document.getElementById("log-ex-add")
      ?.addEventListener("click", addToSession);

    // ── Session bar buttons ───────────────────────────────────────────────
    document.getElementById("session-save-btn")
      ?.addEventListener("click", openSaveModal);
    document.getElementById("session-discard-btn")
      ?.addEventListener("click", () => {
        if (confirm("Discard current session?")) {
          currentSession = { exercises: [], muscles: new Set() };
          updateSessionBar();
          if (selectedMuscle) renderExercises(selectedMuscle);
        }
      });

    // ── Save modal buttons ────────────────────────────────────────────────
    document.getElementById("save-session-close")
      ?.addEventListener("click", closeSaveModal);
    document.getElementById("save-session-modal")
      ?.querySelector(".log-ex-backdrop")
      ?.addEventListener("click", closeSaveModal);
    document.getElementById("save-session-confirm")
      ?.addEventListener("click", confirmSaveSession);
  });
})();
