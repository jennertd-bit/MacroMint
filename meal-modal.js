// meal-modal.js — Shared meal detail modal logic
// Requires: recipes.js (MEAL_RECIPES), html2canvas

(function () {

  const SLOT_COLORS = {
    BREAKFAST: { from: "#f97316", to: "#fbbf24" },
    LUNCH:     { from: "#0ea5e9", to: "#10b981" },
    DINNER:    { from: "#8b5cf6", to: "#6366f1" },
    SNACK:     { from: "#ec4899", to: "#f97316" },
    custom:    { from: "#6366f1", to: "#8b5cf6" },
  };

  const SWAP_LABELS = {
    protein: "🥩 Protein",
    starch:  "🌾 Starch",
    veggie:  "🥦 Veggie",
    sauce:   "🫙 Sauce / Dip",
  };

  let currentMeal = null; // { name, slot, kcal, p, c, f }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function el(id) { return document.getElementById(id); }

  function setGradient(slot) {
    const c = SLOT_COLORS[slot] || SLOT_COLORS.custom;
    const header = el("meal-card-header");
    if (header) header.style.background = `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`;
  }

  // ── Open modal ─────────────────────────────────────────────────────────────

  window.openMealModal = function (meal) {
    if (!meal) return;
    currentMeal = meal;

    const modal = el("meal-modal");
    if (!modal) return;

    // Look up recipe — exact match first, then fuzzy (for API-returned meal names)
    let recipe = null;
    if (typeof MEAL_RECIPES !== "undefined") {
      recipe = MEAL_RECIPES[meal.name] || null;
      if (!recipe) {
        // Fuzzy: find the MEAL_RECIPES key whose words overlap most with the meal name
        const nameLower = (meal.name || "").toLowerCase();
        const nameWords = nameLower.split(/[\s,&\-–—]+/).filter(w => w.length > 3);
        let bestScore = 0, bestKey = null;
        Object.keys(MEAL_RECIPES).forEach(key => {
          const keyLower = key.toLowerCase();
          const score = nameWords.filter(w => keyLower.includes(w)).length;
          if (score > bestScore) { bestScore = score; bestKey = key; }
        });
        if (bestScore >= 2) recipe = MEAL_RECIPES[bestKey];
      }
    }

    // Header
    setGradient(meal.slot || "custom");
    el("meal-card-emoji").textContent  = recipe?.img  || "🍽️";
    el("meal-card-badge").textContent  = meal.slot ? meal.slot.charAt(0) + meal.slot.slice(1).toLowerCase() : "Meal";
    el("meal-card-title").textContent  = meal.name;
    el("meal-card-time").textContent   = recipe ? "⏱ " + recipe.time : "";
    el("meal-chip-p").textContent      = "P " + Math.round(meal.p || 0) + "g";
    el("meal-chip-c").textContent      = "C " + Math.round(meal.c || 0) + "g";
    el("meal-chip-f").textContent      = "F " + Math.round(meal.f || 0) + "g";
    el("meal-chip-k").textContent      = Math.round(meal.kcal || 0) + " kcal";

    // Ingredients
    const ingWrap = el("meal-ingredients");
    ingWrap.innerHTML = "";

    if (recipe?.ingredients?.length) {
      recipe.ingredients.forEach(ing => {
        const row = document.createElement("div");
        row.className = "meal-ing-row";

        const qty = document.createElement("span");
        qty.className = "meal-ing-qty";
        qty.textContent = ing.qty + " " + ing.unit;

        const item = document.createElement("span");
        item.className = "meal-ing-item";

        if (ing.group && recipe.swaps?.[ing.group]?.length) {
          // Swap dropdown
          const swapWrap = document.createElement("div");
          swapWrap.className = "meal-ing-swap-wrap";

          const label = document.createElement("span");
          label.className = "meal-ing-group-badge";
          label.textContent = SWAP_LABELS[ing.group] || ing.group;

          const select = document.createElement("select");
          select.className = "meal-ing-select";

          // Current item as first option
          const def = document.createElement("option");
          def.value = ing.item;
          def.textContent = ing.item + " ✓";
          select.appendChild(def);

          recipe.swaps[ing.group].forEach(swap => {
            const opt = document.createElement("option");
            opt.value = swap;
            opt.textContent = swap;
            select.appendChild(opt);
          });

          swapWrap.appendChild(label);
          swapWrap.appendChild(select);
          item.appendChild(swapWrap);
        } else {
          item.textContent = ing.item;
        }

        row.appendChild(qty);
        row.appendChild(item);
        ingWrap.appendChild(row);
      });
    } else {
      const p = document.createElement("p");
      p.className = "meal-no-recipe";
      p.textContent = "Full ingredients not available for this meal. Try using Fridge Magic 🧙 to build a custom recipe!";
      ingWrap.appendChild(p);
    }

    // Steps
    const stepsEl = el("meal-steps");
    stepsEl.innerHTML = "";
    if (recipe?.steps?.length) {
      recipe.steps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsEl.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Use the macros above to guide your meal. Log it when ready!";
      stepsEl.appendChild(li);
    }

    // Show
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modal.classList.add("meal-modal--open"));
  };

  // ── Close modal ────────────────────────────────────────────────────────────

  function closeMealModal() {
    const modal = el("meal-modal");
    if (!modal) return;
    modal.classList.remove("meal-modal--open");
    setTimeout(() => {
      modal.hidden = true;
      document.body.style.overflow = "";
    }, 300);
  }

  // ── Save card as image ─────────────────────────────────────────────────────

  function saveMealCard() {
    const card = el("meal-card-photo");
    if (!card) return;
    const btn = el("meal-save-btn");
    if (btn) { btn.disabled = true; btn.textContent = "⏳ Saving…"; }

    html2canvas(card, {
      backgroundColor: "#0d1117",
      scale: 2,
      useCORS: true,
      logging: false,
    }).then(async canvas => {
      const safeName = (currentMeal?.name || "meal").replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const fileName = "macromint-" + safeName + ".png";
      // iOS: Web Share API → share sheet → "Save Image" goes straight to Photos
      if (navigator.canShare) {
        try {
          const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
          const file = new File([blob], fileName, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: currentMeal?.name || "MacroMint Meal" });
            if (btn) { btn.disabled = false; btn.textContent = "📸 Save Card"; }
            return;
          }
        } catch (e) {
          if (e.name === "AbortError") {
            if (btn) { btn.disabled = false; btn.textContent = "📸 Save Card"; }
            return; // user cancelled share sheet — that's fine
          }
        }
      }
      // Desktop / fallback: regular download
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
      if (btn) { btn.disabled = false; btn.textContent = "📸 Save Card"; }
    }).catch(() => {
      if (btn) { btn.disabled = false; btn.textContent = "📸 Save Card"; }
      alert("Could not save image. Try a screenshot instead.");
    });
  }

  // ── Wire up events ─────────────────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", function () {
    el("meal-close-btn")?.addEventListener("click", closeMealModal);
    el("meal-modal-backdrop")?.addEventListener("click", closeMealModal);
    el("meal-save-btn")?.addEventListener("click", saveMealCard);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMealModal();
    });
  });

})();
