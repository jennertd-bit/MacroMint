(() => {
  "use strict";

  const API_BASE         = () => (window.MACROMINT_API || "https://macromint-1.onrender.com").replace(/\/$/, "");
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

  // ── Structured Workout Plans ───────────────────────────────────────────────
  const WORKOUT_PLANS = {
    fullbody: {
      label: "Full Body",
      subtitle: "3× per week · A / B / C rotation",
      description: "Hit every major muscle group each session. Rotate through Days A, B, and C so you never repeat the same workout back-to-back. Ideal for any level.",
      days: [
        {
          key: "A",
          label: "Day A",
          tag: "Squat · Press · Row",
          sections: [
            {
              title: "Compound Lifts",
              icon: "🏋️",
              exercises: [
                { name: "Back Squat",            sets: "4 × 5–8",   equipment: "Barbell",    rest: "2–3 min", mechanic: "compound",  muscles: ["quads","glutes","lower-back"], tip: "Knees track over toes. Break parallel. Chest tall throughout the lift." },
                { name: "Barbell Bench Press",   sets: "4 × 6–8",   equipment: "Barbell",    rest: "2 min",   mechanic: "compound",  muscles: ["chest","shoulders","triceps"],  tip: "Plant feet firmly. Lower bar to lower chest with elbows at ~45°." },
                { name: "Bent-Over Barbell Row", sets: "4 × 6–8",   equipment: "Barbell",    rest: "2 min",   mechanic: "compound",  muscles: ["lats","lower-back","biceps"],   tip: "Hinge to ~45°. Pull to your belly button — lead with elbows." },
                { name: "Dumbbell Lateral Raise",sets: "3 × 12–15", equipment: "Dumbbell",   rest: "60s",     mechanic: "isolation", muscles: ["shoulders"],                   tip: "Lead with elbows, slight forward lean. Don't shrug at the top." },
                { name: "Barbell Curl",          sets: "3 × 8–10",  equipment: "Barbell",    rest: "60s",     mechanic: "isolation", muscles: ["biceps"],                      tip: "Elbows pinned to sides. Full extension at the bottom every rep." },
                { name: "Lying Leg Curl",        sets: "3 × 10–12", equipment: "Machine",    rest: "60s",     mechanic: "isolation", muscles: ["hamstrings"],                  tip: "Point toes down slightly. Curl through full range, hold 1s at top." },
              ]
            },
            {
              title: "Abs & Core",
              icon: "🧱",
              exercises: [
                { name: "Ab Wheel Rollout",  sets: "3 × 8–12",  equipment: "Equipment",  rest: "60s", mechanic: "compound",  muscles: ["abs"], tip: "Keep hips aligned with spine throughout. Squeeze hard to pull back in." },
                { name: "Plank",             sets: "3 × 45–60s",equipment: "Bodyweight", rest: "30s", mechanic: "isolation", muscles: ["abs"], tip: "Squeeze glutes and brace your abs. Don't let hips sag or rise." },
              ]
            },
            {
              title: "Cardio Finisher",
              icon: "🏃",
              exercises: [
                { name: "Treadmill or Stationary Bike", sets: "20 min", equipment: "Machine", rest: "—", mechanic: "cardio", muscles: [], tip: "Moderate pace at 65% max HR. Great fat-burn zone — burns ~120–160 kcal. No excuses." },
              ]
            },
          ]
        },
        {
          key: "B",
          label: "Day B",
          tag: "Deadlift · Press · Pull",
          sections: [
            {
              title: "Compound Lifts",
              icon: "🏋️",
              exercises: [
                { name: "Deadlift",               sets: "4 × 4–6",   equipment: "Barbell",    rest: "2–3 min", mechanic: "compound",  muscles: ["lower-back","hamstrings","glutes"], tip: "Neutral spine, big breath into belly, engage lats before you pull." },
                { name: "Overhead Press (Barbell)",sets: "4 × 5–8",  equipment: "Barbell",    rest: "2 min",   mechanic: "compound",  muscles: ["shoulders","triceps"],              tip: "Bar starts at collarbone level. Drive your head through at the top." },
                { name: "Pull-Up",                sets: "4 × Max",   equipment: "Bodyweight", rest: "2 min",   mechanic: "compound",  muscles: ["lats","biceps"],                    tip: "Dead hang start. Drive elbows down and back — think 'lat spread'." },
                { name: "Incline Dumbbell Press", sets: "3 × 8–10",  equipment: "Dumbbell",   rest: "90s",     mechanic: "compound",  muscles: ["chest","shoulders"],                tip: "Set bench 30–45°. Squeeze at top, slow on the way down." },
                { name: "Rope Pushdown",          sets: "3 × 12–15", equipment: "Cable",      rest: "60s",     mechanic: "isolation", muscles: ["triceps"],                         tip: "Split the rope at the bottom. Keep elbows locked to your sides." },
                { name: "Romanian Deadlift",      sets: "3 × 10–12", equipment: "Barbell",    rest: "90s",     mechanic: "compound",  muscles: ["hamstrings","glutes","lower-back"],  tip: "Push hips back — bar stays close to legs. Deep hamstring stretch." },
              ]
            },
            {
              title: "Abs & Core",
              icon: "🧱",
              exercises: [
                { name: "Hanging Leg Raise", sets: "3 × 12–15", equipment: "Bodyweight", rest: "60s", mechanic: "compound",  muscles: ["abs"],          tip: "Control the swing on the way down. Bend knees to make it easier." },
                { name: "Bicycle Crunch",    sets: "3 × 20ea",  equipment: "Bodyweight", rest: "30s", mechanic: "isolation", muscles: ["abs","obliques"],tip: "Slow and deliberate — elbow to opposite knee. No rushing through." },
              ]
            },
            {
              title: "Cardio Finisher",
              icon: "🏃",
              exercises: [
                { name: "Rowing Machine or Elliptical", sets: "20 min", equipment: "Machine", rest: "—", mechanic: "cardio", muscles: [], tip: "Full-body cardio. Row at 24–26 spm or elliptical at moderate resistance. Aim for conversational pace." },
              ]
            },
          ]
        },
        {
          key: "C",
          label: "Day C",
          tag: "Squat · Dips · Row",
          sections: [
            {
              title: "Compound Lifts",
              icon: "🏋️",
              exercises: [
                { name: "Front Squat",          sets: "3 × 6–8",   equipment: "Barbell",    rest: "2 min",  mechanic: "compound",  muscles: ["quads","glutes"],              tip: "More quad, less lower back than back squat. Keep torso vertical." },
                { name: "Dips (Chest Focus)",   sets: "3 × 10–12", equipment: "Bodyweight", rest: "90s",    mechanic: "compound",  muscles: ["chest","triceps","shoulders"],  tip: "Lean forward ~30° and let elbows flare slightly for chest emphasis." },
                { name: "Seated Cable Row",     sets: "4 × 10–12", equipment: "Cable",      rest: "90s",    mechanic: "compound",  muscles: ["lats","biceps"],               tip: "Chest tall, pull to belly button. Squeeze shoulder blades together." },
                { name: "Arnold Press",         sets: "3 × 10–12", equipment: "Dumbbell",   rest: "75s",    mechanic: "compound",  muscles: ["shoulders","triceps"],         tip: "Start with palms facing you and rotate outward as you press overhead." },
                { name: "Hammer Curl",          sets: "3 × 10–12", equipment: "Dumbbell",   rest: "60s",    mechanic: "isolation", muscles: ["biceps"],                     tip: "Neutral grip hits brachialis too — gives arms thickness and fullness." },
                { name: "Hip Thrust (Barbell)", sets: "4 × 10–12", equipment: "Barbell",    rest: "90s",    mechanic: "compound",  muscles: ["glutes","hamstrings"],         tip: "Drive through heels. Squeeze glutes hard at the top. Chin to chest." },
              ]
            },
            {
              title: "Abs & Core",
              icon: "🧱",
              exercises: [
                { name: "Cable Crunch", sets: "3 × 15",     equipment: "Cable",      rest: "45s", mechanic: "isolation", muscles: ["abs"],     tip: "Round your spine toward your pelvis — don't just hinge at the hips." },
                { name: "Side Plank",   sets: "3 × 30–45s", equipment: "Bodyweight", rest: "30s", mechanic: "isolation", muscles: ["obliques"],tip: "Hips stacked. Top hip slightly forward to engage obliques more." },
              ]
            },
            {
              title: "Cardio Finisher",
              icon: "🏃",
              exercises: [
                { name: "Stairmaster or Bike", sets: "20 min", equipment: "Machine", rest: "—", mechanic: "cardio", muscles: [], tip: "High-output, low-impact. Stairmaster burns ~8–10 kcal/min and the glutes will feel it." },
              ]
            },
          ]
        },
      ]
    },

    ppl: {
      label: "Push · Pull · Legs",
      subtitle: "3–6× per week · rotating split",
      description: "Maximum volume per muscle group. Run as 3 days (Push → Pull → Legs) or 6 days (repeat the rotation twice). Each day targets specific movement patterns.",
      days: [
        {
          key: "push",
          label: "Push",
          tag: "Chest · Shoulders · Triceps",
          sections: [
            {
              title: "Chest",
              icon: "🫁",
              exercises: [
                { name: "Barbell Bench Press",   sets: "4 × 5–8",   equipment: "Barbell",  rest: "2–3 min", mechanic: "compound",  muscles: ["chest","shoulders","triceps"], tip: "Plant feet firmly. Lower bar to lower chest with elbows at ~45°." },
                { name: "Incline Dumbbell Press",sets: "3 × 8–10",  equipment: "Dumbbell", rest: "90s",     mechanic: "compound",  muscles: ["chest","shoulders"],            tip: "Set bench to 30–45°. Squeeze at the top, slow controlled descent." },
                { name: "Cable Chest Flye",      sets: "3 × 12–15", equipment: "Cable",    rest: "60s",     mechanic: "isolation", muscles: ["chest"],                       tip: "Slight elbow bend throughout. Think 'hugging a tree' — feel the stretch." },
              ]
            },
            {
              title: "Shoulders",
              icon: "🏋️",
              exercises: [
                { name: "Seated DB Shoulder Press",sets: "4 × 8–10", equipment: "Dumbbell", rest: "90s", mechanic: "compound",  muscles: ["shoulders","triceps"], tip: "Press straight up. Control the descent — don't arch your back." },
                { name: "Dumbbell Lateral Raise",  sets: "4 × 15",   equipment: "Dumbbell", rest: "45s", mechanic: "isolation", muscles: ["shoulders"],          tip: "Lead with elbows. Slight forward lean to hit medial delt harder." },
                { name: "Face Pull",               sets: "3 × 15–20",equipment: "Cable",    rest: "45s", mechanic: "isolation", muscles: ["shoulders"],          tip: "Rope to face, elbows high and wide. Non-negotiable for shoulder health." },
              ]
            },
            {
              title: "Triceps",
              icon: "🔱",
              exercises: [
                { name: "Skull Crusher",             sets: "3 × 10–12", equipment: "Barbell", rest: "75s", mechanic: "isolation", muscles: ["triceps"], tip: "Lower bar toward forehead. Slow negative — great mass builder for the long head." },
                { name: "Rope Pushdown",             sets: "3 × 12–15", equipment: "Cable",   rest: "45s", mechanic: "isolation", muscles: ["triceps"], tip: "Split the rope at the bottom. Keep elbows locked to your sides throughout." },
                { name: "Overhead Tricep Extension", sets: "3 × 10–12", equipment: "Dumbbell",rest: "60s", mechanic: "isolation", muscles: ["triceps"], tip: "Stretch the long head fully. Hold at bottom — biggest ROM = biggest gains." },
              ]
            },
          ]
        },

        {
          key: "pull",
          label: "Pull",
          tag: "Back · Biceps · Rear Delts",
          sections: [
            {
              title: "Back",
              icon: "🪽",
              exercises: [
                { name: "Pull-Up",                     sets: "4 × Max",   equipment: "Bodyweight", rest: "2 min", mechanic: "compound",  muscles: ["lats","biceps"],           tip: "Dead hang start. Drive elbows down and back — think 'lat spread'. Add weight if easy." },
                { name: "Bent-Over Barbell Row",       sets: "4 × 6–8",   equipment: "Barbell",    rest: "2 min", mechanic: "compound",  muscles: ["lats","lower-back","biceps"],tip: "Hinge to ~45°. Pull bar to belly button — lead with elbows." },
                { name: "Lat Pulldown",                sets: "3 × 10–12", equipment: "Cable",      rest: "90s",   mechanic: "compound",  muscles: ["lats"],                    tip: "Slight lean back, drive bar to upper chest. Really squeeze the lats." },
                { name: "Cable Straight-Arm Pulldown", sets: "3 × 12–15", equipment: "Cable",      rest: "60s",   mechanic: "isolation", muscles: ["lats"],                    tip: "Keep arms straight throughout. Feel lats fully stretch at the top." },
              ]
            },
            {
              title: "Rear Delts & Traps",
              icon: "🏋️",
              exercises: [
                { name: "Face Pull",     sets: "3 × 15–20", equipment: "Cable",   rest: "45s", mechanic: "isolation", muscles: ["shoulders"], tip: "Rope to face, elbows high. Key for posture, shoulder health, and rear delt mass." },
                { name: "Barbell Shrug", sets: "3 × 12–15", equipment: "Barbell", rest: "60s", mechanic: "isolation", muscles: ["traps"],     tip: "Drive shoulders straight up — no rolling. Hold 1s at the top. Heavy." },
              ]
            },
            {
              title: "Biceps",
              icon: "💪",
              exercises: [
                { name: "Barbell Curl",        sets: "3 × 8–10",  equipment: "Barbell",  rest: "75s", mechanic: "isolation", muscles: ["biceps"], tip: "Elbows pinned to sides. Full extension at the bottom every rep." },
                { name: "Hammer Curl",         sets: "3 × 10–12", equipment: "Dumbbell", rest: "60s", mechanic: "isolation", muscles: ["biceps"], tip: "Neutral grip. Hits brachialis — gives arms depth and thickness." },
                { name: "Incline Dumbbell Curl",sets: "3 × 10–12",equipment: "Dumbbell", rest: "60s", mechanic: "isolation", muscles: ["biceps"], tip: "Arms hang behind you for full stretch of the long head. Huge stretch = huge pump." },
              ]
            },
          ]
        },

        {
          key: "legs",
          label: "Legs",
          tag: "Quads · Hamstrings · Glutes · Calves",
          sections: [
            {
              title: "Quads & Glutes",
              icon: "🦵",
              exercises: [
                { name: "Back Squat",           sets: "4 × 5–8",   equipment: "Barbell",  rest: "2–3 min", mechanic: "compound",  muscles: ["quads","glutes","lower-back"], tip: "Knees track over toes. Break parallel. Chest tall the whole way." },
                { name: "Leg Press",            sets: "3 × 10–12", equipment: "Machine",  rest: "90s",     mechanic: "compound",  muscles: ["quads","glutes"],               tip: "Feet hip-width, full range of motion — don't lock knees at the top." },
                { name: "Bulgarian Split Squat",sets: "3 × 10ea",  equipment: "Dumbbell", rest: "90s",     mechanic: "compound",  muscles: ["quads","glutes"],               tip: "Front foot far forward. Sink straight down. Squeeze glute at the top." },
                { name: "Leg Extension",        sets: "3 × 12–15", equipment: "Machine",  rest: "60s",     mechanic: "isolation", muscles: ["quads"],                       tip: "Great quad isolation finisher. Slow negative. Hold 1s contracted at top." },
              ]
            },
            {
              title: "Hamstrings",
              icon: "🔗",
              exercises: [
                { name: "Romanian Deadlift", sets: "4 × 8–10",  equipment: "Barbell", rest: "90s", mechanic: "compound",  muscles: ["hamstrings","glutes","lower-back"],tip: "Push hips back — bar stays close to legs. Deep hamstring stretch each rep." },
                { name: "Lying Leg Curl",    sets: "3 × 10–12", equipment: "Machine", rest: "60s", mechanic: "isolation", muscles: ["hamstrings"],                      tip: "Point toes slightly down. Full range of motion, hold 1s at the top." },
                { name: "Nordic Curl",       sets: "3 × 5–8",   equipment: "Bodyweight",rest:"90s", mechanic: "compound",  muscles: ["hamstrings"],                      tip: "The hardest bodyweight hamstring exercise. Lower slowly — pure eccentric strength." },
              ]
            },
            {
              title: "Calves",
              icon: "🦷",
              exercises: [
                { name: "Standing Calf Raise", sets: "4 × 15–20", equipment: "Machine",    rest: "45s", mechanic: "isolation", muscles: ["calves"], tip: "Full range — deep stretch at bottom, hard squeeze at top. Slow tempo." },
                { name: "Seated Calf Raise",   sets: "3 × 15–20", equipment: "Machine",    rest: "45s", mechanic: "isolation", muscles: ["calves"], tip: "Hits the soleus underneath. Essential for full calf development." },
              ]
            },
            {
              title: "Cardio Finisher",
              icon: "🏃",
              exercises: [
                { name: "Stationary Bike", sets: "15 min", equipment: "Machine", rest: "—", mechanic: "cardio", muscles: [], tip: "Post-leg day cardio is brutal but effective. Easy pace — just keep moving. Aids recovery." },
              ]
            },
          ]
        },
      ]
    },
  };

  // ── State ─────────────────────────────────────────────────────────────────
  let selectedMuscle  = null;
  let currentSession  = { exercises: [], muscles: new Set() };
  let pendingLogExercise = null;
  let activePlanType  = "fullbody";
  let activeDayIndex  = 0;
  let planViewActive  = false;  // track whether plan view is rendered

  // ── Workout Log Storage ───────────────────────────────────────────────────
  const loadWorkoutLog = () => {
    try { return JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY) || "[]"); }
    catch { return []; }
  };
  const saveWorkoutLog = (log) => {
    localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(log.slice(-120)));
  };

  // ── Render exercise cards (muscle map panel) ──────────────────────────────
  const renderExercises = (muscleKey) => {
    const data = EXERCISES[muscleKey];
    if (!data) return;

    const panel = document.getElementById("muscle-exercises");
    if (!panel) return;

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

  // ── Render a workout day plan (programs panel) ────────────────────────────
  const renderDayPlan = (planType, dayIndex) => {
    const plan = WORKOUT_PLANS[planType];
    if (!plan) return;
    const day = plan.days[dayIndex];
    if (!day) return;

    planViewActive = true;
    const content = document.getElementById("plan-content");
    if (!content) return;

    const loggedNames = new Set(currentSession.exercises.map(e => e.name));

    content.innerHTML = day.sections.map(section => {
      const isCardioSection = section.exercises.every(ex => ex.mechanic === "cardio");
      return `
        <div class="plan-section">
          <div class="plan-section-header">
            <span class="plan-section-icon">${section.icon}</span>
            <div class="plan-section-title-wrap">
              <span class="plan-section-title">${section.title}</span>
              <span class="plan-section-count">${section.exercises.length} exercise${section.exercises.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div class="exercise-grid${isCardioSection ? " exercise-grid--cardio" : ""}">
            ${section.exercises.map(ex => {
              const isCardio = ex.mechanic === "cardio";
              const isLogged = loggedNames.has(ex.name);
              const primaryMuscle = (ex.muscles && ex.muscles[0]) || "abs";
              const mechanicClass = `ex-tag--${ex.mechanic}`;
              return `
                <div class="exercise-card${isLogged ? " exercise-logged" : ""}${isCardio ? " exercise-card--cardio" : ""}"
                     data-exercise="${ex.name.replace(/"/g, "&quot;")}"
                     data-sets="${ex.sets.replace(/"/g, "&quot;")}"
                     data-muscle="${primaryMuscle}">
                  <div class="exercise-card-top">
                    <span class="exercise-name">${ex.name}</span>
                    <span class="exercise-sets-badge">${ex.sets}</span>
                  </div>
                  <div class="exercise-card-meta">
                    <span class="exercise-equip">${ex.equipment}</span>
                    ${ex.rest && ex.rest !== "—" ? `<span class="ex-tag ex-tag--rest">⏱ ${ex.rest}</span>` : ""}
                    <span class="ex-tag ${mechanicClass}">${ex.mechanic}</span>
                  </div>
                  <p class="exercise-tip">💡 ${ex.tip}</p>
                  ${!isCardio ? `
                    <button class="log-exercise-btn${isLogged ? " log-exercise-btn--done" : ""}">
                      ${isLogged ? "✓ Logged" : "+ Log"}
                    </button>
                  ` : `
                    <div class="cardio-note">🕐 Track on your machine or phone timer</div>
                  `}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");

    // Highlight muscles on body map
    const allMuscles = new Set();
    day.sections.forEach(s => s.exercises.forEach(ex => (ex.muscles || []).forEach(m => allMuscles.add(m))));
    highlightPlanMuscles(allMuscles);
  };

  // ── Plan tabs init ────────────────────────────────────────────────────────
  const initPlanTabs = () => {
    const planTypeTabs  = document.getElementById("plan-type-tabs");
    const planDayTabsEl = document.getElementById("plan-day-tabs");
    const planDesc      = document.getElementById("plan-description");

    const renderDayTabs = (planType) => {
      const plan = WORKOUT_PLANS[planType];
      if (!planDayTabsEl || !plan) return;
      planDayTabsEl.innerHTML = plan.days.map((day, i) => `
        <button class="plan-day-tab${i === activeDayIndex ? " active" : ""}" data-day="${i}" type="button">
          <span class="plan-day-tab-label">${day.label}</span>
          ${day.tag ? `<span class="plan-day-tab-tag">${day.tag}</span>` : ""}
        </button>
      `).join("");

      planDayTabsEl.querySelectorAll(".plan-day-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          activeDayIndex = parseInt(tab.dataset.day);
          planDayTabsEl.querySelectorAll(".plan-day-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          renderDayPlan(activePlanType, activeDayIndex);
        });
      });
    };

    if (planDesc) planDesc.textContent = WORKOUT_PLANS[activePlanType].description;

    planTypeTabs?.querySelectorAll(".plan-type-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        activePlanType = tab.dataset.plan;
        activeDayIndex = 0;
        planTypeTabs.querySelectorAll(".plan-type-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        if (planDesc) planDesc.textContent = WORKOUT_PLANS[activePlanType].description;
        renderDayTabs(activePlanType);
        renderDayPlan(activePlanType, 0);
      });
    });

    renderDayTabs(activePlanType);
    renderDayPlan(activePlanType, 0);
  };

  // ── Select a muscle (body map) ────────────────────────────────────────────
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

  // ── Highlight muscles from plan ───────────────────────────────────────────
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

  // ── Log Exercise Modal ────────────────────────────────────────────────────
  const openLogModal = (exerciseName, defaultSets, muscleKey) => {
    pendingLogExercise = { name: exerciseName, muscleKey };
    const modal = document.getElementById("log-exercise-modal");
    if (!modal) return;

    const nameEl = document.getElementById("log-ex-name");
    if (nameEl) nameEl.textContent = exerciseName;

    const setsNum  = parseInt(defaultSets) || 3;
    const repsPart = defaultSets.includes("×") ? defaultSets.split("×")[1].trim() : "10";
    const setsInput  = document.getElementById("log-ex-sets");
    const repsInput  = document.getElementById("log-ex-reps");
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

    // Re-render whichever view is active
    if (planViewActive) {
      renderDayPlan(activePlanType, activeDayIndex);
    } else if (selectedMuscle) {
      renderExercises(selectedMuscle);
    }
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
    const muscles   = [...currentSession.muscles];
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
    const muscles  = [...currentSession.muscles];
    const exercises = currentSession.exercises;

    const log = loadWorkoutLog();
    log.push({
      id:             Date.now(),
      date:           today,
      name,
      duration,
      muscles,
      exercises,
      caloriesBurned: Math.round(duration * 6),
    });
    saveWorkoutLog(log);

    currentSession = { exercises: [], muscles: new Set() };
    updateSessionBar();
    closeSaveModal();
    renderWorkoutHistory();
    highlightTrainedThisWeek();
    planViewActive = false;
    if (selectedMuscle) renderExercises(selectedMuscle);
    renderDayPlan(activePlanType, activeDayIndex);

    // ── 🎉 Celebration popup ───────────────────────────────────────────────
    if (typeof showWorkoutComplete === "function") {
      const muscleLabels = muscles.map(m => EXERCISES[m]?.label || m);
      setTimeout(() => showWorkoutComplete({ name, duration, muscles: muscleLabels, exercises }), 300);
    } else {
      const statusEl = document.getElementById("workout-status-msg");
      if (statusEl) {
        statusEl.textContent = `✓ ${name} saved — ${duration} min, ~${Math.round(duration * 6)} kcal burned`;
        statusEl.hidden = false;
        setTimeout(() => { statusEl.hidden = true; }, 5000);
      }
    }
  };

  // ── Workout History ───────────────────────────────────────────────────────
  const calcStreak = (log) => {
    if (!log.length) return 0;
    const dates = [...new Set(log.map(w => w.date))].sort().reverse();
    let streak = 0;
    let d = new Date();
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

    const badge = document.getElementById("workout-streak-badge");
    if (badge) {
      if (streak > 0) {
        badge.textContent = `🔥 ${streak} day${streak !== 1 ? "s" : ""}`;
        badge.removeAttribute("hidden");
      } else {
        badge.setAttribute("hidden", "");
      }
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const thisWeek = allLog.filter(w => w.date >= cutoff.toISOString().slice(0, 10)).length;
    const weekEl = document.getElementById("workouts-this-week");
    if (weekEl) weekEl.textContent = thisWeek;

    if (log.length === 0) {
      list.innerHTML = `<p class="muted" style="font-size:0.85rem;padding:12px 0">No workouts logged yet. Choose a plan below, then hit <strong>+ Log</strong> on any exercise.</p>`;
      return;
    }

    list.innerHTML = log.map(w => {
      const dateLabel = formatHistoryDate(w.date);
      const exCount   = w.exercises?.length || 0;
      const stats     = [];
      if (w.duration)      stats.push(`${w.duration} min`);
      if (exCount)         stats.push(`${exCount} ex`);
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
    // Body map clicks
    document.querySelectorAll(".muscle-group").forEach(el => {
      el.addEventListener("click", () => {
        const muscle = el.getAttribute("data-muscle");
        if (muscle) {
          planViewActive = false;
          selectMuscle(muscle);
        }
      });
    });

    updateLegend(new Set());
    highlightTrainedThisWeek();
    renderWorkoutHistory();

    // Init plan tabs
    initPlanTabs();

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
          planViewActive = false;
          if (selectedMuscle) renderExercises(selectedMuscle);
          renderDayPlan(activePlanType, activeDayIndex);
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
