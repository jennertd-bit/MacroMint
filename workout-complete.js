// workout-complete.js — Workout completion celebration modal
// Shows glowing body image with teal muscle overlays + motivational quote

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

  // ── Muscle → SVG zone IDs map ─────────────────────────────────────────────
  const MUSCLE_SVG_MAP = {
    chest:        ["svg-chest-l", "svg-chest-r"],
    shoulders:    ["svg-shoulder-l", "svg-shoulder-r"],
    traps:        ["svg-trap-l", "svg-trap-r"],
    lats:         ["svg-lat-l", "svg-lat-r"],
    "lower-back": ["svg-lower-back"],
    biceps:       ["svg-bicep-l", "svg-bicep-r"],
    triceps:      ["svg-tricep-l", "svg-tricep-r"],
    forearms:     ["svg-forearm-l", "svg-forearm-r"],
    abs:          ["svg-abs"],
    obliques:     ["svg-oblique-l", "svg-oblique-r"],
    glutes:       ["svg-glute-l", "svg-glute-r"],
    quads:        ["svg-quad-l", "svg-quad-r"],
    hamstrings:   ["svg-ham-l", "svg-ham-r"],
    calves:       ["svg-calf-l", "svg-calf-r"],
    cardio:       ["svg-quad-l", "svg-quad-r", "svg-ham-l", "svg-ham-r", "svg-calf-l", "svg-calf-r"],
  };

  // ── Current state ──────────────────────────────────────────────────────────
  let currentView = "front";   // "front" | "back"
  let lastMuscleKeys = [];     // remember for view toggle re-activation

  // ── Front view SVG zones (mapped to body-front.png) ───────────────────────
  const FRONT_ZONES = `
    <path id="svg-trap-l"      class="muscle-zone" d="M41,22 L35,25 L39,28 L44,25Z"/>
    <path id="svg-trap-r"      class="muscle-zone" d="M59,22 L65,25 L61,28 L56,25Z"/>
    <path id="svg-shoulder-l"  class="muscle-zone" d="M28,25 C25,28 24,33 26,37 C28,39 32,39 35,36 C37,33 37,29 35,26 C33,24 30,24 28,25Z"/>
    <path id="svg-shoulder-r"  class="muscle-zone" d="M72,25 C75,28 76,33 74,37 C72,39 68,39 65,36 C63,33 63,29 65,26 C67,24 70,24 72,25Z"/>
    <path id="svg-chest-l"     class="muscle-zone" d="M35,28 C33,32 33,38 35,42 C37,45 41,47 45,46 C48,44 50,40 50,36 C50,32 47,28 43,27 C40,26 37,26 35,28Z"/>
    <path id="svg-chest-r"     class="muscle-zone" d="M65,28 C67,32 67,38 65,42 C63,45 59,47 55,46 C52,44 50,40 50,36 C50,32 53,28 57,27 C60,26 63,26 65,28Z"/>
    <path id="svg-lat-l"       class="muscle-zone" d="M30,37 C28,43 28,51 29,57 C30,62 32,65 35,63 C37,61 38,55 37,48 C36,42 34,37 31,36Z"/>
    <path id="svg-lat-r"       class="muscle-zone" d="M70,37 C72,43 72,51 71,57 C70,62 68,65 65,63 C63,61 62,55 63,48 C64,42 66,37 69,36Z"/>
    <path id="svg-bicep-l"     class="muscle-zone" d="M24,30 C22,35 21,42 23,48 C25,53 28,55 30,52 C32,48 32,42 30,36 C28,31 26,28 24,30Z"/>
    <path id="svg-bicep-r"     class="muscle-zone" d="M76,30 C78,35 79,42 77,48 C75,53 72,55 70,52 C68,48 68,42 70,36 C72,31 74,28 76,30Z"/>
    <path id="svg-tricep-l"    class="muscle-zone" d="M26,30 C24,36 23,43 24,49 C22,46 21,40 22,34 C23,30 25,28 26,30Z"/>
    <path id="svg-tricep-r"    class="muscle-zone" d="M74,30 C76,36 77,43 76,49 C78,46 79,40 78,34 C77,30 75,28 74,30Z"/>
    <path id="svg-forearm-l"   class="muscle-zone" d="M22,54 C20,60 20,67 22,72 C24,76 27,77 28,74 C29,70 29,64 27,58 C26,54 24,52 22,54Z"/>
    <path id="svg-forearm-r"   class="muscle-zone" d="M78,54 C80,60 80,67 78,72 C76,76 73,77 72,74 C71,70 71,64 73,58 C74,54 76,52 78,54Z"/>
    <path id="svg-abs"         class="muscle-zone" d="M42,46 C41,50 41,56 42,62 C43,66 45,68 50,68 C55,68 57,66 58,62 C59,56 59,50 58,46 C56,43 44,43 42,46Z"/>
    <path id="svg-oblique-l"   class="muscle-zone" d="M33,50 C31,56 31,64 33,70 C35,74 38,75 40,72 C41,68 41,62 40,56 C39,51 36,48 33,50Z"/>
    <path id="svg-oblique-r"   class="muscle-zone" d="M67,50 C69,56 69,64 67,70 C65,74 62,75 60,72 C59,68 59,62 60,56 C61,51 64,48 67,50Z"/>
    <path id="svg-lower-back"  class="muscle-zone" d="M40,66 C39,70 40,74 42,76 C45,78 55,78 58,76 C60,74 61,70 60,66 C57,63 43,63 40,66Z"/>
    <path id="svg-glute-l"     class="muscle-zone" d="M34,75 C31,80 31,86 34,90 C37,93 42,93 45,89 C47,85 47,80 45,76 C43,73 38,73 34,75Z"/>
    <path id="svg-glute-r"     class="muscle-zone" d="M66,75 C69,80 69,86 66,90 C63,93 58,93 55,89 C53,85 53,80 55,76 C57,73 62,73 66,75Z"/>
    <path id="svg-quad-l"      class="muscle-zone" d="M33,90 C30,97 29,107 30,116 C31,122 34,126 38,126 C42,126 45,122 46,116 C47,108 46,98 43,91 C40,87 36,87 33,90Z"/>
    <path id="svg-quad-r"      class="muscle-zone" d="M67,90 C70,97 71,107 70,116 C69,122 66,126 62,126 C58,126 55,122 54,116 C53,108 54,98 57,91 C60,87 64,87 67,90Z"/>
    <path id="svg-ham-l"       class="muscle-zone" d="M43,92 C46,100 47,112 46,120 C45,126 42,128 39,126 C36,122 34,112 35,102 C36,96 39,90 43,92Z"/>
    <path id="svg-ham-r"       class="muscle-zone" d="M57,92 C54,100 53,112 54,120 C55,126 58,128 61,126 C64,122 66,112 65,102 C64,96 61,90 57,92Z"/>
    <path id="svg-calf-l"      class="muscle-zone" d="M30,128 C28,134 28,140 30,145 C32,148 35,149 38,147 C40,144 41,138 40,132 C39,128 36,126 33,126Z"/>
    <path id="svg-calf-r"      class="muscle-zone" d="M70,128 C72,134 72,140 70,145 C68,148 65,149 62,147 C60,144 59,138 60,132 C61,128 64,126 67,126Z"/>`;

  // ── Back view SVG zones (mapped to body-back.png) ─────────────────────────
  const BACK_ZONES = `
    <path id="svg-trap-l"      class="muscle-zone" d="M39,20 C35,22 30,25 28,29 C32,32 38,30 42,27 C44,24 42,21 39,20Z"/>
    <path id="svg-trap-r"      class="muscle-zone" d="M61,20 C65,22 70,25 72,29 C68,32 62,30 58,27 C56,24 58,21 61,20Z"/>
    <path id="svg-shoulder-l"  class="muscle-zone" d="M28,25 C25,28 24,33 26,37 C28,39 32,39 35,36 C37,33 37,29 35,26 C33,24 30,24 28,25Z"/>
    <path id="svg-shoulder-r"  class="muscle-zone" d="M72,25 C75,28 76,33 74,37 C72,39 68,39 65,36 C63,33 63,29 65,26 C67,24 70,24 72,25Z"/>
    <path id="svg-lat-l"       class="muscle-zone" d="M30,30 C27,38 26,48 27,58 C28,66 31,72 36,70 C40,68 42,60 41,50 C40,40 37,32 33,28Z"/>
    <path id="svg-lat-r"       class="muscle-zone" d="M70,30 C73,38 74,48 73,58 C72,66 69,72 64,70 C60,68 58,60 59,50 C60,40 63,32 67,28Z"/>
    <path id="svg-lower-back"  class="muscle-zone" d="M38,60 C36,66 37,74 40,78 C44,82 56,82 60,78 C63,74 64,66 62,60 C58,55 42,55 38,60Z"/>
    <path id="svg-tricep-l"    class="muscle-zone" d="M24,30 C21,38 20,48 22,56 C24,62 28,64 30,60 C32,54 32,44 30,36 C28,30 26,28 24,30Z"/>
    <path id="svg-tricep-r"    class="muscle-zone" d="M76,30 C79,38 80,48 78,56 C76,62 72,64 70,60 C68,54 68,44 70,36 C72,30 74,28 76,30Z"/>
    <path id="svg-forearm-l"   class="muscle-zone" d="M22,58 C20,64 20,72 22,78 C24,82 27,83 28,80 C29,76 29,68 27,62 C26,58 24,56 22,58Z"/>
    <path id="svg-forearm-r"   class="muscle-zone" d="M78,58 C80,64 80,72 78,78 C76,82 73,83 72,80 C71,76 71,68 73,62 C74,58 76,56 78,58Z"/>
    <path id="svg-glute-l"     class="muscle-zone" d="M33,78 C29,84 28,92 31,98 C34,103 40,104 44,100 C47,96 48,88 46,82 C44,77 38,75 33,78Z"/>
    <path id="svg-glute-r"     class="muscle-zone" d="M67,78 C71,84 72,92 69,98 C66,103 60,104 56,100 C53,96 52,88 54,82 C56,77 62,75 67,78Z"/>
    <path id="svg-ham-l"       class="muscle-zone" d="M30,100 C27,108 26,120 28,130 C30,138 34,142 38,140 C42,138 44,130 43,120 C42,110 39,102 35,98Z"/>
    <path id="svg-ham-r"       class="muscle-zone" d="M70,100 C73,108 74,120 72,130 C70,138 66,142 62,140 C58,138 56,130 57,120 C58,110 61,102 65,98Z"/>
    <path id="svg-calf-l"      class="muscle-zone" d="M28,142 C26,148 26,156 28,162 C30,166 34,167 37,164 C39,160 40,152 38,146 C36,142 32,140 28,142Z"/>
    <path id="svg-calf-r"      class="muscle-zone" d="M72,142 C74,148 74,156 72,162 C70,166 66,167 63,164 C61,160 60,152 62,146 C64,142 68,140 72,142Z"/>`;

  // ── Build the body visual ─────────────────────────────────────────────────
  function buildMuscleSVG(view) {
    const img  = view === "back" ? "body-back.png" : "body-front.png";
    const zones = view === "back" ? BACK_ZONES : FRONT_ZONES;
    return `<div class="wc-body-container">
      <button class="wc-view-toggle" id="wc-view-toggle" type="button">
        ${view === "front" ? "↻ Back" : "↻ Front"}
      </button>
      <img src="${img}" alt="" class="wc-body-img" draggable="false"/>
      <svg class="wc-body-zones" viewBox="0 0 100 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        ${zones}
      </svg>
    </div>`;
  }

  // ── Toggle front / back ───────────────────────────────────────────────────
  function toggleView() {
    currentView = currentView === "front" ? "back" : "front";
    const wrap = document.getElementById("wc-svg-wrap");
    if (wrap) {
      wrap.innerHTML = buildMuscleSVG(currentView);
      wireToggleBtn();
      // Re-activate the same muscles on new view
      setTimeout(() => activateMuscles(lastMuscleKeys), 100);
    }
  }

  function wireToggleBtn() {
    document.getElementById("wc-view-toggle")?.addEventListener("click", toggleView);
  }

  // ── Activate muscles with teal glow ────────────────────────────────────────
  function activateMuscles(muscleKeys) {
    lastMuscleKeys = muscleKeys; // remember for view toggle
    document.querySelectorAll(".muscle-zone").forEach(el => {
      el.classList.remove("muscle-active");
    });

    const allIds = new Set();
    muscleKeys.forEach(key => {
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

    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const quoteEl  = document.getElementById("wc-quote");
    const authorEl = document.getElementById("wc-author");
    if (quoteEl)  quoteEl.textContent  = `"${q.text}"`;
    if (authorEl) authorEl.textContent = `— ${q.author}`;

    const nameEl = document.getElementById("wc-name");
    const statEl = document.getElementById("wc-stats");
    if (nameEl) nameEl.textContent = name || "Workout Complete";
    if (statEl) {
      const kcal = Math.round((duration || 45) * 6);
      statEl.textContent = `${duration || 45} min · ~${kcal} kcal burned`;
    }

    const musclesEl = document.getElementById("wc-muscles");
    if (musclesEl) {
      musclesEl.textContent = muscles?.length ? muscles.join(" · ") : "Full Body";
    }

    currentView = "front"; // always start on front

    const svgWrap = document.getElementById("wc-svg-wrap");
    if (svgWrap) {
      svgWrap.innerHTML = buildMuscleSVG(currentView);
      wireToggleBtn();
    }

    modal.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add("wc-open");
        setTimeout(() => activateMuscles(muscles || []), 500);
      });
    });

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
        const type   = Math.floor(Math.random() * 4);
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

    addBurst(W * 0.5, H * 0.42, 130, 1.2);
    setTimeout(() => addBurst(W * 0.22, H * 0.38, 50, 0.9), 180);
    setTimeout(() => addBurst(W * 0.78, H * 0.38, 50, 0.9), 300);
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          particles.push({
            x: Math.random() * W, y: -12,
            vx: (Math.random() - 0.5) * 2.5,
            vy: 1.5 + Math.random() * 3.5,
            size: 4 + Math.random() * 7,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            type: Math.floor(Math.random() * 3),
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.18,
            life: 1, decay: 0.003 + Math.random() * 0.004, drag: 0.992,
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
        case 0: ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65); break;
        case 1: ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); break;
        case 2: ctx.fillRect(-p.size * 0.22, -p.size / 2, p.size * 0.44, p.size); break;
        case 3:
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0); ctx.lineTo(p.size, 0);
          ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size);
          ctx.moveTo(-p.size * 0.68, -p.size * 0.68); ctx.lineTo(p.size * 0.68, p.size * 0.68);
          ctx.moveTo(p.size * 0.68, -p.size * 0.68); ctx.lineTo(-p.size * 0.68, p.size * 0.68);
          ctx.stroke(); break;
      }
      ctx.restore();
    }

    let frame;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of particles) {
        p.life -= p.decay; p.vx *= p.drag; p.vy *= p.drag;
        p.vy += 0.16; p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        if (p.life > 0.02) { alive++; drawParticle(p); }
      }
      if (alive > 0) frame = requestAnimationFrame(tick);
    };
    tick();
    setTimeout(() => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, W, H); }, 5500);
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
