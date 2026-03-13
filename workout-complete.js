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

  // ── Build the muscle SVG — neon hologram athletic body ────────────────────
  function buildMuscleSVG() {
    return `<svg id="muscle-svg" viewBox="0 0 100 242" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;display:block;filter:drop-shadow(0 0 6px rgba(0,160,255,0.65)) drop-shadow(0 0 18px rgba(0,80,220,0.32)) drop-shadow(0 0 36px rgba(0,50,180,0.16))">

      <!-- BASE BODY — neon hologram fill + glowing cyan outline -->
      <g fill="rgba(10,45,130,0.72)" stroke="rgba(60,170,255,0.92)" stroke-width="0.9" stroke-linejoin="round">
        <ellipse cx="50" cy="11" rx="10" ry="11"/>
        <path d="M46,21 C46,25 54,25 54,21 L54,28 C54,31 46,31 46,28Z"/>
        <path d="M10,32 C7,37 6,43 9,49 C11,55 14,65 15,77 C16,89 16,103 16,115 C16,125 17,135 18,143 C19,151 20,157 21,163 L44,163 L56,163 L79,163 C80,157 81,151 82,143 C83,135 84,125 84,115 C84,103 84,89 85,77 C86,65 89,55 91,49 C94,43 93,37 90,32 C82,27 66,24 50,24 C34,24 18,27 10,32Z"/>
        <path d="M6,34 C2,44 1,58 2,70 C3,82 5,94 8,100 C11,106 15,107 18,101 C20,93 20,81 18,69 C16,55 13,43 10,35Z"/>
        <path d="M94,34 C98,44 99,58 98,70 C97,82 95,94 92,100 C89,106 85,107 82,101 C80,93 80,81 82,69 C84,55 87,43 90,35Z"/>
        <path d="M3,102 C0,114 0,129 2,139 C4,147 7,151 11,150 C14,148 16,141 15,131 C14,120 12,107 9,102Z"/>
        <path d="M97,102 C100,114 100,129 98,139 C96,147 93,151 89,150 C86,148 85,141 85,131 C86,120 88,107 91,102Z"/>
        <path d="M18,164 C13,178 12,198 13,214 C14,228 18,238 24,240 C30,242 36,240 40,233 C43,224 44,210 43,194 C41,178 38,164 32,161Z"/>
        <path d="M82,164 C87,178 88,198 87,214 C86,228 82,238 76,240 C70,242 64,240 60,233 C57,224 56,210 57,194 C59,178 62,164 68,161Z"/>
        <path d="M13,240 C10,252 10,263 12,269 C14,274 18,277 22,275 C26,274 28,268 28,259 C28,250 26,241 23,239Z"/>
        <path d="M87,240 C90,252 90,263 88,269 C86,274 82,277 78,275 C74,274 72,268 72,259 C72,250 74,241 77,239Z"/>
      </g>

      <!-- MUSCLE ZONES — transparent at rest, intense teal when active -->
      <g fill="rgba(25,80,200,0.14)" stroke="rgba(100,200,255,0.25)" stroke-width="0.45">
        <path id="svg-trap-l"     class="muscle-part" d="M46,24 C40,26 30,28 14,34 C20,38 30,36 40,32 C43,30 45,27 46,24Z"/>
        <path id="svg-trap-r"     class="muscle-part" d="M54,24 C60,26 70,28 86,34 C80,38 70,36 60,32 C57,30 55,27 54,24Z"/>
        <path id="svg-shoulder-l" class="muscle-part" d="M7,34 C3,40 2,49 4,56 C6,62 10,64 14,60 C18,56 19,47 17,41 C15,35 10,32 7,34Z"/>
        <path id="svg-shoulder-r" class="muscle-part" d="M93,34 C97,40 98,49 96,56 C94,62 90,64 86,60 C82,56 81,47 83,41 C85,35 90,32 93,34Z"/>
        <path id="svg-chest-l"    class="muscle-part" d="M10,36 C8,45 8,57 10,67 C12,76 17,81 23,81 C29,81 33,75 34,67 C35,58 33,47 30,39 C26,33 18,31 12,33 C11,33 10,34 10,36Z"/>
        <path id="svg-chest-r"    class="muscle-part" d="M90,36 C92,45 92,57 90,67 C88,76 83,81 77,81 C71,81 67,75 66,67 C65,58 67,47 70,39 C74,33 82,31 88,33 C89,33 90,34 90,36Z"/>
        <path id="svg-lat-l"      class="muscle-part" d="M9,49 C7,61 7,75 8,89 C9,103 10,115 9,125 C9,133 8,139 10,143 C14,145 19,143 22,135 C25,125 25,111 23,95 C22,79 18,63 14,53 C11,46 9,46 9,49Z"/>
        <path id="svg-lat-r"      class="muscle-part" d="M91,49 C93,61 93,75 92,89 C91,103 90,115 91,125 C91,133 92,139 90,143 C86,145 81,143 78,135 C75,125 75,111 77,95 C78,79 82,63 86,53 C89,46 91,46 91,49Z"/>
        <path id="svg-bicep-l"    class="muscle-part" d="M2,38 C-1,50 -1,65 1,77 C3,87 7,93 11,93 C15,93 17,87 17,77 C17,64 14,50 11,39 C8,33 4,33 2,38Z"/>
        <path id="svg-bicep-r"    class="muscle-part" d="M98,38 C101,50 101,65 99,77 C97,87 93,93 89,93 C85,93 83,87 83,77 C83,64 86,50 89,39 C92,33 96,33 98,38Z"/>
        <path id="svg-tricep-l"   class="muscle-part" d="M5,36 C2,46 1,59 2,71 C3,81 6,89 9,91 C6,85 4,75 4,65 C4,53 6,42 9,36Z"/>
        <path id="svg-tricep-r"   class="muscle-part" d="M95,36 C98,46 99,59 98,71 C97,81 94,89 91,91 C94,85 96,75 96,65 C96,53 94,42 91,36Z"/>
        <path id="svg-forearm-l"  class="muscle-part" d="M4,104 C1,116 1,131 3,141 C5,149 8,152 11,150 C14,149 16,141 16,131 C16,119 13,106 10,103Z"/>
        <path id="svg-forearm-r"  class="muscle-part" d="M96,104 C99,116 99,131 97,141 C95,149 92,152 89,150 C86,149 84,141 84,131 C84,119 87,106 90,103Z"/>
        <path id="svg-abs-1"      class="muscle-part" d="M37,83 C36,88 36,93 38,97 C40,100 44,101 47,98 C50,95 50,90 48,86 C46,81 42,80 39,81 C38,81 37,82 37,83Z"/>
        <path id="svg-abs-2"      class="muscle-part" d="M50,83 C49,88 49,93 52,97 C54,100 58,101 61,98 C64,95 64,90 62,86 C60,81 56,80 53,81 C51,81 50,82 50,83Z"/>
        <path id="svg-abs-3"      class="muscle-part" d="M37,100 C36,105 36,110 38,114 C40,117 44,118 47,115 C50,112 50,107 48,103 C46,98 42,97 39,98 C38,98 37,99 37,100Z"/>
        <path id="svg-abs-4"      class="muscle-part" d="M50,100 C49,105 49,110 52,114 C54,117 58,118 61,115 C64,112 64,107 62,103 C60,98 56,97 53,98 C51,98 50,99 50,100Z"/>
        <path id="svg-abs-5"      class="muscle-part" d="M38,116 C36,121 36,126 39,130 C41,133 45,134 48,131 C51,128 51,123 50,119 C48,114 44,113 41,114 C39,114 38,115 38,116Z"/>
        <path id="svg-abs-6"      class="muscle-part" d="M50,116 C49,121 49,126 52,130 C54,133 58,134 61,131 C64,128 64,123 63,119 C61,114 57,113 54,114 C52,114 50,115 50,116Z"/>
        <path id="svg-oblique-l"  class="muscle-part" d="M10,104 C8,114 9,126 11,136 C13,144 17,149 21,145 C25,141 26,131 24,120 C22,109 18,102 14,103 C11,103 10,103 10,104Z"/>
        <path id="svg-oblique-r"  class="muscle-part" d="M90,104 C92,114 91,126 89,136 C87,144 83,149 79,145 C75,141 74,131 76,120 C78,109 82,102 86,103 C89,103 90,103 90,104Z"/>
        <path id="svg-lower-back" class="muscle-part" d="M33,136 C31,142 31,150 34,156 C37,160 44,163 50,163 C56,163 63,160 66,156 C69,150 69,142 67,136 C63,131 37,131 33,136Z"/>
        <path id="svg-glute-l"    class="muscle-part" d="M19,157 C14,167 13,179 16,189 C18,197 24,201 31,199 C38,197 43,191 44,181 C45,171 43,161 38,157 C34,153 24,153 19,157Z"/>
        <path id="svg-glute-r"    class="muscle-part" d="M81,157 C86,167 87,179 84,189 C82,197 76,201 69,199 C62,197 57,191 56,181 C55,171 57,161 62,157 C66,153 76,153 81,157Z"/>
        <path id="svg-quad-l"     class="muscle-part" d="M18,164 C13,178 12,198 14,214 C16,228 20,238 26,240 C32,242 38,240 42,233 C45,225 46,211 44,195 C42,179 38,164 32,161Z"/>
        <path id="svg-quad-r"     class="muscle-part" d="M82,164 C87,178 88,198 86,214 C84,228 80,238 74,240 C68,242 62,240 58,233 C55,225 54,211 56,195 C58,179 62,164 68,161Z"/>
        <path id="svg-ham-l"      class="muscle-part" d="M42,165 C46,179 48,199 46,215 C44,229 40,239 35,241 C30,237 27,225 27,209 C27,193 31,173 37,163Z"/>
        <path id="svg-ham-r"      class="muscle-part" d="M58,165 C54,179 52,199 54,215 C56,229 60,239 65,241 C70,237 73,225 73,209 C73,193 69,173 63,163Z"/>
        <path id="svg-calf-l"     class="muscle-part" d="M13,241 C9,253 9,265 11,271 C13,276 17,279 21,277 C25,276 28,270 28,261 C28,252 26,241 23,239Z"/>
        <path id="svg-calf-r"     class="muscle-part" d="M87,241 C91,253 91,265 89,271 C87,276 83,279 79,277 C75,276 72,270 72,261 C72,252 74,241 77,239Z"/>
      </g>

      <!-- ANATOMY GUIDE LINES (ultra subtle) -->
      <g stroke="rgba(80,180,255,0.11)" stroke-width="0.4" fill="none" stroke-dasharray="1.5,3" pointer-events="none">
        <line x1="50" y1="30" x2="50" y2="162"/>
        <path d="M12,77 C20,83 32,83 34,79"/>
        <path d="M88,77 C80,83 68,83 66,79"/>
      </g>
    </svg>`;
  }

  // ── Activate muscles with glow ─────────────────────────────────────────────
  function activateMuscles(muscleKeys) {
    document.querySelectorAll(".muscle-part").forEach(el => {
      el.classList.remove("muscle-active");
    });

    const allIds = new Set();
    muscleKeys.forEach(key => {
      // Try exact key, then lowercase (handles "Chest" → "chest")
      const ids = MUSCLE_SVG_MAP[key] || MUSCLE_SVG_MAP[key.toLowerCase()] || [];
      ids.forEach(id => allIds.add(id));
    });

    [...allIds].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.classList.add("muscle-active"), i * 70);
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
      statEl.textContent = `${duration || 45} min · ~${kcal} kcal burned`;
    }

    // Muscles
    const musclesEl = document.getElementById("wc-muscles");
    if (musclesEl) {
      musclesEl.textContent = muscles?.length ? muscles.join(" · ") : "Full Body";
    }

    // Build SVG
    const svgWrap = document.getElementById("wc-svg-wrap");
    if (svgWrap) svgWrap.innerHTML = buildMuscleSVG();

    // Show modal
    modal.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add("wc-open");
        setTimeout(() => activateMuscles(muscles || []), 500);
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

  // ── Confetti — explosive multi-burst celebration ───────────────────────────
  function spawnConfetti() {
    const canvas = document.getElementById("wc-confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width  = window.innerWidth  || 400;
    const H = canvas.height = window.innerHeight || 700;

    const COLORS = [
      "#00e5cc", "#f97316", "#8b5cf6", "#fbbf24",
      "#10b981", "#ec4899", "#3b82f6", "#ef4444",
      "#ffffff", "#ffd700", "#ff6b6b", "#4ecdc4",
    ];

    const particles = [];

    function addBurst(ox, oy, count, speedScale) {
      for (let i = 0; i < count; i++) {
        const angle  = Math.random() * Math.PI * 2;
        const speed  = (2 + Math.random() * 11) * speedScale;
        const type   = Math.floor(Math.random() * 4); // 0=square 1=circle 2=ribbon 3=sparkle
        particles.push({
          x: ox + (Math.random() - 0.5) * 30,
          y: oy + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 4,
          size:  type === 3 ? 2 + Math.random() * 4 : 4 + Math.random() * 9,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          type,
          rot:  Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.28,
          life: 1,
          decay: 0.0035 + Math.random() * 0.006,
          drag:  0.975 + Math.random() * 0.018,
        });
      }
    }

    // Main blast from center
    addBurst(W * 0.5, H * 0.42, 130, 1.2);
    // Side bursts
    setTimeout(() => addBurst(W * 0.22, H * 0.38, 50, 0.9), 180);
    setTimeout(() => addBurst(W * 0.78, H * 0.38, 50, 0.9), 300);
    // Top waterfall
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          particles.push({
            x: Math.random() * W,
            y: -12,
            vx: (Math.random() - 0.5) * 2.5,
            vy: 1.5 + Math.random() * 3.5,
            size: 4 + Math.random() * 7,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            type: Math.floor(Math.random() * 3),
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.18,
            life: 1,
            decay: 0.003 + Math.random() * 0.004,
            drag: 0.992,
          });
        }, i * 80);
      }
    }, 350);

    function drawParticle(p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle   = p.color;
      ctx.strokeStyle = p.color;
      switch (p.type) {
        case 0: // square/rect
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
          break;
        case 1: // circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 2: // ribbon
          ctx.fillRect(-p.size * 0.22, -p.size / 2, p.size * 0.44, p.size);
          break;
        case 3: // sparkle / star burst
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);     ctx.lineTo(p.size, 0);
          ctx.moveTo(0, -p.size);     ctx.lineTo(0, p.size);
          ctx.moveTo(-p.size * 0.68, -p.size * 0.68);
          ctx.lineTo( p.size * 0.68,  p.size * 0.68);
          ctx.moveTo( p.size * 0.68, -p.size * 0.68);
          ctx.lineTo(-p.size * 0.68,  p.size * 0.68);
          ctx.stroke();
          break;
      }
      ctx.restore();
    }

    let frame;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of particles) {
        p.life -= p.decay;
        p.vx   *= p.drag;
        p.vy   *= p.drag;
        p.vy   += 0.16; // gravity
        p.x    += p.vx;
        p.y    += p.vy;
        p.rot  += p.rotV;
        if (p.life > 0.02) { alive++; drawParticle(p); }
      }
      if (alive > 0) frame = requestAnimationFrame(tick);
    };
    tick();
    setTimeout(() => {
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);
    }, 5500);
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
