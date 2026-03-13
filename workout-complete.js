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

  // ── Build the muscle SVG ───────────────────────────────────────────────────
  function buildMuscleSVG() {
    return `
    <svg id="muscle-svg" viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:220px;filter:drop-shadow(0 0 18px rgba(0,229,204,0.15))">
      <defs>
        <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="grad-teal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00e5cc" stop-opacity="1"/>
          <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.7"/>
        </radialGradient>
        <radialGradient id="grad-orange" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f97316" stop-opacity="1"/>
          <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.7"/>
        </radialGradient>
      </defs>

      <!-- ── Body silhouette ── -->
      <!-- Head -->
      <ellipse cx="100" cy="35" rx="22" ry="25" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <!-- Neck -->
      <rect x="91" y="57" width="18" height="18" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <!-- Torso -->
      <path d="M58 75 Q50 95 48 130 Q46 170 52 200 Q60 210 100 212 Q140 210 148 200 Q154 170 152 130 Q150 95 142 75 Q122 68 100 68 Q78 68 58 75Z" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <!-- Hips -->
      <path d="M58 200 Q55 215 58 230 Q70 240 100 242 Q130 240 142 230 Q145 215 142 200Z" fill="#1a2235" stroke="#334155" stroke-width="1"/>
      <!-- Left Upper Arm -->
      <path d="M58 78 Q42 85 38 115 Q36 130 42 142 Q50 148 58 140 Q62 128 62 110 Q63 92 58 78Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
      <!-- Right Upper Arm -->
      <path d="M142 78 Q158 85 162 115 Q164 130 158 142 Q150 148 142 140 Q138 128 138 110 Q137 92 142 78Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
      <!-- Left Forearm -->
      <path d="M42 144 Q36 158 36 178 Q37 192 44 196 Q52 198 56 188 Q60 175 58 158 Q58 148 52 144Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
      <!-- Right Forearm -->
      <path d="M158 144 Q164 158 164 178 Q163 192 156 196 Q148 198 144 188 Q140 175 142 158 Q142 148 148 144Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
      <!-- Left Thigh -->
      <path d="M60 230 Q55 255 56 285 Q58 310 65 318 Q76 324 84 316 Q90 305 88 280 Q86 255 84 230Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
      <!-- Right Thigh -->
      <path d="M140 230 Q145 255 144 285 Q142 310 135 318 Q124 324 116 316 Q110 305 112 280 Q114 255 116 230Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
      <!-- Left Calf -->
      <path d="M65 320 Q62 340 63 360 Q65 378 70 384 Q78 390 84 382 Q88 370 88 352 Q88 334 86 320Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
      <!-- Right Calf -->
      <path d="M135 320 Q138 340 137 360 Q135 378 130 384 Q122 390 116 382 Q112 370 112 352 Q112 334 114 320Z" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>

      <!-- ── MUSCLE GROUPS (start all dim, glow when active) ── -->

      <!-- Traps -->
      <path id="svg-trap-l" class="muscle-part" d="M82 68 Q72 72 64 80 Q70 88 80 85 Q88 80 88 72Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <path id="svg-trap-r" class="muscle-part" d="M118 68 Q128 72 136 80 Q130 88 120 85 Q112 80 112 72Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Shoulders -->
      <ellipse id="svg-shoulder-l" class="muscle-part" cx="53" cy="85" rx="11" ry="9" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1" transform="rotate(-15,53,85)"/>
      <ellipse id="svg-shoulder-r" class="muscle-part" cx="147" cy="85" rx="11" ry="9" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1" transform="rotate(15,147,85)"/>

      <!-- Chest (pecs) -->
      <path id="svg-chest-l" class="muscle-part" d="M72 82 Q62 88 60 105 Q60 118 68 122 Q80 124 88 115 Q92 105 90 90 Q84 80 72 82Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <path id="svg-chest-r" class="muscle-part" d="M128 82 Q138 88 140 105 Q140 118 132 122 Q120 124 112 115 Q108 105 110 90 Q116 80 128 82Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Lats -->
      <path id="svg-lat-l" class="muscle-part" d="M56 100 Q50 120 50 145 Q54 160 62 162 Q70 162 72 148 Q74 130 70 108 Q66 96 56 100Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <path id="svg-lat-r" class="muscle-part" d="M144 100 Q150 120 150 145 Q146 160 138 162 Q130 162 128 148 Q126 130 130 108 Q134 96 144 100Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Biceps -->
      <ellipse id="svg-bicep-l" class="muscle-part" cx="48" cy="112" rx="7" ry="14" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1" transform="rotate(-10,48,112)"/>
      <ellipse id="svg-bicep-r" class="muscle-part" cx="152" cy="112" rx="7" ry="14" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1" transform="rotate(10,152,112)"/>

      <!-- Triceps (visible from front as outer arm) -->
      <path id="svg-tricep-l" class="muscle-part" d="M42 100 Q36 112 36 128 Q38 140 44 140 Q50 138 52 126 Q54 112 50 100Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <path id="svg-tricep-r" class="muscle-part" d="M158 100 Q164 112 164 128 Q162 140 156 140 Q150 138 148 126 Q146 112 150 100Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Forearms -->
      <ellipse id="svg-forearm-l" class="muscle-part" cx="44" cy="170" rx="7" ry="16" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1" transform="rotate(-5,44,170)"/>
      <ellipse id="svg-forearm-r" class="muscle-part" cx="156" cy="170" rx="7" ry="16" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1" transform="rotate(5,156,170)"/>

      <!-- Abs (6-pack: 3 rows × 2 cols) -->
      <rect id="svg-abs-1" class="muscle-part" x="83" y="128" width="13" height="12" rx="4" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <rect id="svg-abs-2" class="muscle-part" x="104" y="128" width="13" height="12" rx="4" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <rect id="svg-abs-3" class="muscle-part" x="83" y="143" width="13" height="12" rx="4" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <rect id="svg-abs-4" class="muscle-part" x="104" y="143" width="13" height="12" rx="4" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <rect id="svg-abs-5" class="muscle-part" x="84" y="158" width="12" height="10" rx="3" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <rect id="svg-abs-6" class="muscle-part" x="104" y="158" width="12" height="10" rx="3" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Obliques -->
      <path id="svg-oblique-l" class="muscle-part" d="M70 128 Q62 140 60 160 Q62 175 68 178 Q74 176 76 162 Q78 148 74 132Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <path id="svg-oblique-r" class="muscle-part" d="M130 128 Q138 140 140 160 Q138 175 132 178 Q126 176 124 162 Q122 148 126 132Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Lower Back -->
      <path id="svg-lower-back" class="muscle-part" d="M84 185 Q84 200 100 202 Q116 200 116 185 Q108 180 100 180 Q92 180 84 185Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Glutes -->
      <path id="svg-glute-l" class="muscle-part" d="M62 202 Q58 215 60 228 Q68 238 84 238 Q90 235 90 224 Q88 210 82 202Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <path id="svg-glute-r" class="muscle-part" d="M138 202 Q142 215 140 228 Q132 238 116 238 Q110 235 110 224 Q112 210 118 202Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Quads -->
      <path id="svg-quad-l" class="muscle-part" d="M62 238 Q56 260 58 285 Q62 310 72 315 Q82 316 86 304 Q88 282 86 258 Q84 240 76 236Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <path id="svg-quad-r" class="muscle-part" d="M138 238 Q144 260 142 285 Q138 310 128 315 Q118 316 114 304 Q112 282 114 258 Q116 240 124 236Z" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>

      <!-- Hamstrings (shown on inner thigh from front) -->
      <path id="svg-ham-l" class="muscle-part" d="M82 238 Q86 258 86 282 Q84 306 80 316 Q72 318 68 310 Q64 295 64 270 Q64 248 68 238Z" fill="#152a3a" stroke="#1e4a5a" stroke-width="0.8"/>
      <path id="svg-ham-r" class="muscle-part" d="M118 238 Q114 258 114 282 Q116 306 120 316 Q128 318 132 310 Q136 295 136 270 Q136 248 132 238Z" fill="#152a3a" stroke="#1e4a5a" stroke-width="0.8"/>

      <!-- Calves -->
      <ellipse id="svg-calf-l" class="muscle-part" cx="74" cy="350" rx="10" ry="24" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
      <ellipse id="svg-calf-r" class="muscle-part" cx="126" cy="350" rx="10" ry="24" fill="#1e3a4a" stroke="#1e4a5a" stroke-width="1"/>
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
