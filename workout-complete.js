// workout-complete.js — Workout completion celebration modal
// Shows animated glowing muscle figure + motivational quote

(function () {

  // ── Motivational quotes — conversational, like a friend who gets it ────────
  const QUOTES = [
    { text: "See? That was worth it.", author: "MacroMint" },
    { text: "Glad you made it happen today. Seriously.", author: "MacroMint" },
    { text: "You showed up. That's already half the battle won.", author: "MacroMint" },
    { text: "Future you is already saying thank you.", author: "MacroMint" },
    { text: "Didn't feel like it and did it anyway. That's the whole game.", author: "MacroMint" },
    { text: "Look at you. Consistent. That's a whole personality trait now.", author: "MacroMint" },
    { text: "That's another one in the bank. Keep stacking.", author: "MacroMint" },
    { text: "Nobody can take that session away from you. It's yours.", author: "MacroMint" },
    { text: "The version of you that skipped? They're watching. Keep going.", author: "MacroMint" },
    { text: "You're building something real here. One session at a time.", author: "MacroMint" },
    { text: "Not bad for someone who almost didn't come.", author: "MacroMint" },
    { text: "This is what discipline looks like up close. You just lived it.", author: "MacroMint" },
    { text: "Every time you finish, you get a little harder to stop.", author: "MacroMint" },
    { text: "Progress doesn't always feel like progress. But it is. Trust it.", author: "MacroMint" },
    { text: "You're not the same person who started. Not even a little bit.", author: "MacroMint" },
    { text: "That feeling right now? Remember it next time you don't want to go.", author: "MacroMint" },
    { text: "Resting now hits different when you've earned it.", author: "MacroMint" },
    { text: "You made time for it. That says everything about where you're headed.", author: "MacroMint" },
    { text: "The hard part's done. Now go eat something good.", author: "MacroMint" },
    { text: "Someone else made an excuse today. You didn't. That's the difference.", author: "MacroMint" },
    { text: "You could've sat this one out. You didn't. That matters more than you think.", author: "MacroMint" },
    { text: "Momentum is a real thing. You just added to yours.", author: "MacroMint" },
    { text: "The grind is quiet, but the results aren't.", author: "MacroMint" },
    { text: "Today's effort is tomorrow's body. Keep making deposits.", author: "MacroMint" },
    { text: "There's a version of you that gave up. You just made sure it wasn't this one.", author: "MacroMint" },
    { text: "Done is better than perfect. And you're done. Go recover.", author: "MacroMint" },
    { text: "You felt tired before you started. Finished anyway. That's character.", author: "MacroMint" },
    { text: "The people who look like they have it figured out just showed up more times.", author: "MacroMint" },
    { text: "Be honest — that felt good. Even the hard parts.", author: "MacroMint" },
    { text: "You didn't just work out. You built a habit. Big difference.", author: "MacroMint" },
    { text: "Your body just got a little better at existing. Wild, right?", author: "MacroMint" },
    { text: "Consistency over intensity. Every time. And you're consistent.", author: "MacroMint" },
    { text: "Some days training is joy. Some days it's discipline. Both count equally.", author: "MacroMint" },
    { text: "The version of you six months from now is going to thank today's you.", author: "MacroMint" },
    { text: "You're literally rewriting your default. Rep by rep.", author: "MacroMint" },
    { text: "Showing up is a skill. You're getting better at it every time.", author: "MacroMint" },
    { text: "Hard to be tired and proud at the same time. Enjoy both.", author: "MacroMint" },
    { text: "You're allowed to be proud of yourself. Actually. For real.", author: "MacroMint" },
    { text: "Eat. Sleep. Train. Repeat. You're doing it.", author: "MacroMint" },
    { text: "This is the long game. And you're still playing it. That's rare.", author: "MacroMint" },
  ];

  // ── Muscle → SVG IDs map ──────────────────────────────────────────────────
  // Keys match workouts.js EXERCISES keys
  const MUSCLE_SVG_MAP = {
    chest:        ["svg-chest-l", "svg-chest-r"],
    shoulders:    ["svg-shoulder-l", "svg-shoulder-r"],
    traps:        ["svg-trap-l", "svg-trap-r"],
    lats:         ["svg-lat-l", "svg-lat-r"],
    "lower-back": ["svg-lower-back"],
    biceps:       ["svg-bicep-l", "svg-bicep-r"],
    triceps:      ["svg-tricep-l", "svg-tricep-r"],
    forearms:     ["svg-forearm-l", "svg-forearm-r"],
    abs:          ["svg-abs-1", "svg-abs-2", "svg-abs-3", "svg-abs-4", "svg-abs-5", "svg-abs-6"],
    obliques:     ["svg-oblique-l", "svg-oblique-r"],
    glutes:       ["svg-glute-l", "svg-glute-r"],
    quads:        ["svg-quad-l", "svg-quad-r"],
    hamstrings:   ["svg-ham-l", "svg-ham-r"],
    calves:       ["svg-calf-l", "svg-calf-r"],
    cardio:       ["svg-quad-l", "svg-quad-r", "svg-ham-l", "svg-ham-r", "svg-calf-l", "svg-calf-r"],
  };

  // ── Build the muscle SVG — modern athletic silhouette ─────────────────────
  function buildMuscleSVG() {
    return `
    <svg id="muscle-svg" viewBox="0 0 160 380" xmlns="http://www.w3.org/2000/svg"
         style="width:100%;max-width:190px;filter:drop-shadow(0 0 20px rgba(0,229,204,0.12))">
      <defs>
        <filter id="glow-teal" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="body-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1a2535"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="grad-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#00e5cc"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>

      <!-- ── BASE SILHOUETTE ─────────────────────────────────────────── -->

      <!-- Head -->
      <ellipse cx="80" cy="22" rx="16" ry="19" fill="#1e2d3d" stroke="#2d4057" stroke-width="1.2"/>
      <!-- Neck -->
      <path d="M73 38 C73 44 87 44 87 38 L87 48 C87 52 73 52 73 48Z" fill="#1a2535" stroke="#2d4057" stroke-width="1"/>

      <!-- Torso — V-taper shape -->
      <path d="M47 56 C40 68 36 90 35 115 C34 140 36 165 40 185 C44 200 58 208 80 210 C102 208 116 200 120 185 C124 165 126 140 125 115 C124 90 120 68 113 56 C104 52 56 52 47 56Z"
            fill="url(#body-base)" stroke="#2d4057" stroke-width="1.2"/>

      <!-- Hips / pelvis -->
      <path d="M43 200 C42 212 44 224 48 232 C58 242 80 244 80 244 C80 244 102 242 112 232 C116 224 118 212 117 200Z"
            fill="#151f2e" stroke="#2d4057" stroke-width="1"/>

      <!-- Left upper arm -->
      <path d="M47 58 C38 62 32 78 30 98 C28 114 30 128 36 136 C42 142 50 140 54 132 C58 120 58 102 56 84 C55 70 52 58 47 58Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1.1"/>
      <!-- Right upper arm -->
      <path d="M113 58 C122 62 128 78 130 98 C132 114 130 128 124 136 C118 142 110 140 106 132 C102 120 102 102 104 84 C105 70 108 58 113 58Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1.1"/>

      <!-- Left forearm -->
      <path d="M36 138 C30 150 28 166 30 180 C32 192 38 198 44 196 C50 194 54 184 54 172 C54 158 52 144 46 138Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1"/>
      <!-- Right forearm -->
      <path d="M124 138 C130 150 132 166 130 180 C128 192 122 198 116 196 C110 194 106 184 106 172 C106 158 108 144 114 138Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1"/>

      <!-- Left thigh -->
      <path d="M46 232 C40 250 38 274 40 296 C42 314 50 326 60 328 C70 330 78 320 80 306 C80 290 78 266 74 246 C70 232 60 228 46 232Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1.1"/>
      <!-- Right thigh -->
      <path d="M114 232 C120 250 122 274 120 296 C118 314 110 326 100 328 C90 330 82 320 80 306 C80 290 82 266 86 246 C90 232 100 228 114 232Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1.1"/>

      <!-- Left calf -->
      <path d="M40 330 C37 346 38 362 41 372 C45 380 56 382 62 376 C68 370 70 356 68 340 C66 328 58 324 50 326 C44 328 42 330 40 330Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1"/>
      <!-- Right calf -->
      <path d="M120 330 C123 346 122 362 119 372 C115 380 104 382 98 376 C92 370 90 356 92 340 C94 328 102 324 110 326 C116 328 118 330 120 330Z"
            fill="#1a2535" stroke="#2d4057" stroke-width="1"/>


      <!-- ── MUSCLE GROUPS — clean organic shapes ────────────────────── -->

      <!-- Traps — diamond ridge at neck base -->
      <path id="svg-trap-l" class="muscle-part"
            d="M68 50 C62 54 54 60 50 68 C56 72 66 70 72 64 C74 60 72 54 68 50Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-trap-r" class="muscle-part"
            d="M92 50 C98 54 106 60 110 68 C104 72 94 70 88 64 C86 60 88 54 92 50Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Shoulders — rounded cap over deltoid -->
      <path id="svg-shoulder-l" class="muscle-part"
            d="M46 58 C38 60 30 68 28 80 C28 90 34 96 42 92 C50 88 54 76 54 66 C54 60 50 56 46 58Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-shoulder-r" class="muscle-part"
            d="M114 58 C122 60 130 68 132 80 C132 90 126 96 118 92 C110 88 106 76 106 66 C106 60 110 56 114 58Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Chest — left pec -->
      <path id="svg-chest-l" class="muscle-part"
            d="M50 64 C42 70 38 84 40 98 C42 110 50 116 60 114 C70 112 76 102 76 90 C76 76 68 62 56 62 C54 62 52 62 50 64Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <!-- Chest — right pec -->
      <path id="svg-chest-r" class="muscle-part"
            d="M110 64 C118 70 122 84 120 98 C118 110 110 116 100 114 C90 112 84 102 84 90 C84 76 92 62 104 62 C106 62 108 62 110 64Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Lats — sweeping wing from armpit -->
      <path id="svg-lat-l" class="muscle-part"
            d="M42 84 C36 100 34 124 36 148 C38 160 44 166 52 162 C58 160 62 148 62 134 C62 116 58 96 50 84 C46 78 44 80 42 84Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-lat-r" class="muscle-part"
            d="M118 84 C124 100 126 124 124 148 C122 160 116 166 108 162 C102 160 98 148 98 134 C98 116 102 96 110 84 C114 78 116 80 118 84Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Biceps — peak on upper arm front -->
      <path id="svg-bicep-l" class="muscle-part"
            d="M32 88 C28 100 28 116 32 128 C36 138 44 140 50 134 C54 126 54 112 50 100 C46 90 38 84 32 88Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-bicep-r" class="muscle-part"
            d="M128 88 C132 100 132 116 128 128 C124 138 116 140 110 134 C106 126 106 112 110 100 C114 90 122 84 128 88Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Triceps — outer horseshoe of upper arm -->
      <path id="svg-tricep-l" class="muscle-part"
            d="M36 72 C30 84 28 104 30 120 C32 130 38 134 44 130 C48 126 50 114 48 100 C46 86 42 72 36 72Z"
            fill="#192f42" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-tricep-r" class="muscle-part"
            d="M124 72 C130 84 132 104 130 120 C128 130 122 134 116 130 C112 126 110 114 112 100 C114 86 118 72 124 72Z"
            fill="#192f42" stroke="#264560" stroke-width="0.8"/>

      <!-- Forearms — tapered lower arm -->
      <path id="svg-forearm-l" class="muscle-part"
            d="M30 142 C26 156 26 172 28 184 C30 194 36 198 42 196 C48 194 52 184 52 172 C52 158 48 144 42 140 C36 138 32 140 30 142Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-forearm-r" class="muscle-part"
            d="M130 142 C134 156 134 172 132 184 C130 194 124 198 118 196 C112 194 108 184 108 172 C108 158 112 144 118 140 C124 138 128 140 130 142Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Abs — 3 pairs of defined blocks -->
      <path id="svg-abs-1" class="muscle-part"
            d="M66 118 C64 124 65 132 68 136 C72 138 76 136 77 130 C78 124 76 118 72 116 C69 115 67 116 66 118Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-abs-2" class="muscle-part"
            d="M94 118 C96 124 95 132 92 136 C88 138 84 136 83 130 C82 124 84 118 88 116 C91 115 93 116 94 118Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-abs-3" class="muscle-part"
            d="M65 140 C63 147 64 155 68 159 C72 161 76 159 77 153 C78 146 76 140 72 138 C69 137 66 138 65 140Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-abs-4" class="muscle-part"
            d="M95 140 C97 147 96 155 92 159 C88 161 84 159 83 153 C82 146 84 140 88 138 C91 137 94 138 95 140Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-abs-5" class="muscle-part"
            d="M66 163 C64 170 65 177 69 180 C73 182 77 179 78 173 C78 167 76 161 72 160 C69 159 67 161 66 163Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-abs-6" class="muscle-part"
            d="M94 163 C96 170 95 177 91 180 C87 182 83 179 82 173 C82 167 84 161 88 160 C91 159 93 161 94 163Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Obliques — flanks -->
      <path id="svg-oblique-l" class="muscle-part"
            d="M40 120 C36 134 36 156 38 172 C40 182 46 186 52 182 C56 178 58 166 56 152 C54 136 50 122 44 118 C42 117 40 118 40 120Z"
            fill="#192f42" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-oblique-r" class="muscle-part"
            d="M120 120 C124 134 124 156 122 172 C120 182 114 186 108 182 C104 178 102 166 104 152 C106 136 110 122 116 118 C118 117 120 118 120 120Z"
            fill="#192f42" stroke="#264560" stroke-width="0.8"/>

      <!-- Lower back -->
      <path id="svg-lower-back" class="muscle-part"
            d="M66 188 C64 196 65 206 68 210 C72 214 88 214 92 210 C95 206 96 196 94 188 C90 184 70 184 66 188Z"
            fill="#192f42" stroke="#264560" stroke-width="0.8"/>

      <!-- Glutes -->
      <path id="svg-glute-l" class="muscle-part"
            d="M44 200 C40 214 40 228 44 238 C50 246 62 248 70 242 C76 236 78 224 76 212 C74 200 66 194 56 194 C50 194 46 196 44 200Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-glute-r" class="muscle-part"
            d="M116 200 C120 214 120 228 116 238 C110 246 98 248 90 242 C84 236 82 224 84 212 C86 200 94 194 104 194 C110 194 114 196 116 200Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Quads — sweeping front thigh -->
      <path id="svg-quad-l" class="muscle-part"
            d="M44 236 C38 256 36 280 38 302 C40 318 50 328 62 326 C72 324 78 312 78 296 C78 276 74 254 66 238 C60 228 50 228 44 236Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-quad-r" class="muscle-part"
            d="M116 236 C122 256 124 280 122 302 C120 318 110 328 98 326 C88 324 82 312 82 296 C82 276 86 254 94 238 C100 228 110 228 116 236Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- Hamstrings — inner thigh visible -->
      <path id="svg-ham-l" class="muscle-part"
            d="M62 238 C66 256 68 278 66 300 C64 316 58 326 52 324 C44 322 40 308 40 290 C40 268 46 248 54 238 C58 234 62 236 62 238Z"
            fill="#172840" stroke="#264560" stroke-width="0.7"/>
      <path id="svg-ham-r" class="muscle-part"
            d="M98 238 C94 256 92 278 94 300 C96 316 102 326 108 324 C116 322 120 308 120 290 C120 268 114 248 106 238 C102 234 98 236 98 238Z"
            fill="#172840" stroke="#264560" stroke-width="0.7"/>

      <!-- Calves — defined gastrocnemius shape -->
      <path id="svg-calf-l" class="muscle-part"
            d="M40 332 C36 348 36 364 40 374 C44 382 54 384 62 378 C68 372 70 358 68 344 C66 330 58 324 50 326 C44 328 42 330 40 332Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>
      <path id="svg-calf-r" class="muscle-part"
            d="M120 332 C124 348 124 364 120 374 C116 382 106 384 98 378 C92 372 90 358 92 344 C94 330 102 324 110 326 C116 328 118 330 120 332Z"
            fill="#1e3548" stroke="#264560" stroke-width="0.8"/>

      <!-- ── Muscle definition lines (subtle anatomy strokes) ── -->
      <!-- Chest centre line -->
      <line x1="80" y1="64" x2="80" y2="115" stroke="#2d4057" stroke-width="0.8" stroke-dasharray="2,3"/>
      <!-- Abs centre line -->
      <line x1="80" y1="116" x2="80" y2="186" stroke="#2d4057" stroke-width="0.8" stroke-dasharray="2,3"/>
      <!-- Pec lower edge L -->
      <path d="M42 112 C52 118 68 118 76 112" stroke="#2d4057" stroke-width="0.7" fill="none"/>
      <!-- Pec lower edge R -->
      <path d="M118 112 C108 118 92 118 84 112" stroke="#2d4057" stroke-width="0.7" fill="none"/>
      <!-- Quad sweep L -->
      <path d="M52 240 C48 260 46 288 48 308" stroke="#2d4057" stroke-width="0.7" fill="none"/>
      <!-- Quad sweep R -->
      <path d="M108 240 C112 260 114 288 112 308" stroke="#2d4057" stroke-width="0.7" fill="none"/>
    </svg>`;
  }

  // ── Activate muscles with glow ─────────────────────────────────────────────
  function activateMuscles(muscleKeys) {
    // Reset all first
    document.querySelectorAll(".muscle-part").forEach(el => {
      el.classList.remove("muscle-active", "muscle-active-secondary");
    });

    const allIds = new Set();
    muscleKeys.forEach(key => {
      const ids = MUSCLE_SVG_MAP[key] || [];
      ids.forEach(id => allIds.add(id));
    });

    allIds.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.classList.add("muscle-active"), i * 60);
      }
    });
  }

  // ── Show celebration modal ─────────────────────────────────────────────────
  window.showWorkoutComplete = function ({ name, duration, muscles, exercises }) {
    const modal = document.getElementById("workout-complete-modal");
    if (!modal) return;

    // Random quote
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const quoteEl  = document.getElementById("wc-quote");
    const authorEl = document.getElementById("wc-author");
    if (quoteEl)  quoteEl.textContent  = `"${q.text}"`;
    if (authorEl) authorEl.textContent = `— ${q.author}`;

    // Session stats
    const nameEl = document.getElementById("wc-name");
    const statEl = document.getElementById("wc-stats");
    if (nameEl) nameEl.textContent = name || "Workout Complete";
    if (statEl) {
      const kcal = Math.round((duration || 45) * 6);
      const muscleLabelEl = document.getElementById("wc-muscles");
      if (muscleLabelEl) {
        muscleLabelEl.textContent = muscles?.length
          ? muscles.join(" · ")
          : "Full Body";
      }
      statEl.textContent = `${duration || 45} min · ~${kcal} kcal burned`;
    }

    // Build SVG
    const svgWrap = document.getElementById("wc-svg-wrap");
    if (svgWrap) svgWrap.innerHTML = buildMuscleSVG();

    // Show modal
    modal.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add("wc-open");
        // Stagger muscle glow after modal animates in
        setTimeout(() => activateMuscles(muscles || []), 400);
      });
    });

    // Confetti burst
    spawnConfetti();
  };

  // ── Close ──────────────────────────────────────────────────────────────────
  function closeWorkoutComplete() {
    const modal = document.getElementById("workout-complete-modal");
    if (!modal) return;
    modal.classList.remove("wc-open");
    setTimeout(() => { modal.hidden = true; }, 400);
  }
  window.closeWorkoutComplete = closeWorkoutComplete;

  // ── Simple confetti ────────────────────────────────────────────────────────
  function spawnConfetti() {
    const canvas = document.getElementById("wc-confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth  || 360;
    canvas.height = canvas.offsetHeight || 600;

    const COLORS = ["#00e5cc", "#f97316", "#8b5cf6", "#fbbf24", "#10b981", "#ec4899"];
    const pieces = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 80,
      r: 4 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
      alpha: 1,
    }));

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      pieces.forEach(p => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.rotV;
        p.vy  += 0.05; // gravity
        if (p.y < canvas.height) {
          alive++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
          ctx.restore();
        }
      });
      if (alive > 0) frame = requestAnimationFrame(draw);
    };
    draw();
    setTimeout(() => cancelAnimationFrame(frame), 3500);
  }

  // ── Wire close button ──────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("wc-close-btn")?.addEventListener("click", closeWorkoutComplete);
    document.getElementById("wc-backdrop")?.addEventListener("click", closeWorkoutComplete);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeWorkoutComplete();
    });
  });

})();
