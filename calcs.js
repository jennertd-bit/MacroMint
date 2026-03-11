const MacroMintCalcs = (() => {
  const toNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const toMetric = ({ unit, heightFt, heightIn, heightCm, weightLb, weightKg }) => {
    const safeUnit = unit === "metric" ? "metric" : "us";
    let heightCmValue = toNumber(heightCm);
    let weightKgValue = toNumber(weightKg);

    if (safeUnit === "us") {
      const feet = toNumber(heightFt);
      const inches = toNumber(heightIn);
      const pounds = toNumber(weightLb);

      if (feet !== null && inches !== null) {
        heightCmValue = (feet * 12 + inches) * 2.54;
      }
      if (pounds !== null) {
        weightKgValue = pounds / 2.20462;
      }
    }

    return {
      heightCm: heightCmValue,
      weightKg: weightKgValue,
      ready: Number.isFinite(heightCmValue) && Number.isFinite(weightKgValue),
    };
  };

  const bmrMifflin = ({ sex, age, heightCm, weightKg }) => {
    if (!Number.isFinite(age) || !Number.isFinite(heightCm) || !Number.isFinite(weightKg)) {
      return null;
    }
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === "female" ? base - 161 : base + 5;
  };

  const tdee = ({ bmr, activity }) => {
    if (!Number.isFinite(bmr) || !Number.isFinite(activity)) return null;
    return bmr * activity;
  };

  const target = ({ tdeeValue, adjustment }) => {
    if (!Number.isFinite(tdeeValue)) return null;
    return tdeeValue + (Number.isFinite(adjustment) ? adjustment : 0);
  };

  /**
   * Exponential Moving Average for body weight.
   * alpha = 2 / (period + 1). Default period = 10 days → alpha ≈ 0.182.
   * Returns entries sorted ascending with a `trend` field added.
   * @param {Array<{date: string, weightKg: number}>} sortedEntries
   * @param {number} alpha  smoothing factor (0–1)
   */
  const weightEma = (sortedEntries, alpha = 0.182) => {
    if (!sortedEntries || sortedEntries.length === 0) return [];
    const result = [];
    let emaValue = sortedEntries[0].weightKg;
    for (const entry of sortedEntries) {
      emaValue = alpha * entry.weightKg + (1 - alpha) * emaValue;
      result.push({ date: entry.date, weightKg: entry.weightKg, trend: Math.round(emaValue * 100) / 100 });
    }
    return result;
  };

  /**
   * Adaptive TDEE estimation (MacroFactor-style).
   * Uses actual calorie intake and weight trend change to back-calculate true expenditure.
   * Formula: adaptive_tdee = avg_daily_intake − (weight_trend_change_kg × 7700 / days)
   * 7700 kcal ≈ 1 kg of body tissue (weighted average fat/lean)
   *
   * @param {Array<{date: string, weightKg: number}>} weightEntries  raw weight entries
   * @param {Array<{date: string, calories: number}>} intakeEntries   daily calorie totals
   * @returns {number|null}
   */
  const adaptiveTdee = (weightEntries, intakeEntries) => {
    if (!weightEntries || weightEntries.length < 4) return null;
    if (!intakeEntries || intakeEntries.length < 4) return null;

    const sorted = [...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const trendData = weightEma(sorted);
    if (trendData.length < 2) return null;

    const startTrend = trendData[0].trend;
    const endTrend = trendData[trendData.length - 1].trend;

    const daySpan =
      (new Date(sorted[sorted.length - 1].date) - new Date(sorted[0].date)) / (1000 * 60 * 60 * 24);
    if (daySpan < 3) return null;

    const totalIntake = intakeEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
    const avgDailyIntake = totalIntake / intakeEntries.length;

    const weightChangeKg = endTrend - startTrend;
    const dailyWeightChangeCals = (weightChangeKg * 7700) / daySpan;

    const estimated = avgDailyIntake - dailyWeightChangeCals;
    return Number.isFinite(estimated) ? Math.round(estimated) : null;
  };

  /**
   * Weekly coaching: compare actual weight trend rate vs goal rate.
   * Returns a recommendation and message for the weekly check-in.
   *
   * @param {object} opts
   * @param {Array<{date:string, trend:number}>} opts.trendData  output of weightEma()
   * @param {string}  opts.goalPreset
   * @param {number}  opts.currentTarget  current daily calorie target
   * @param {number|null} opts.adaptiveTdeeValue
   */
  const weeklyCoaching = ({ trendData, goalPreset, currentTarget, adaptiveTdeeValue }) => {
    const GOAL_RATES_KG_WEEK = {
      maintain: 0,
      diet: -0.25,
      lose: -0.5,
      shred: -0.75,
      gain: 0.25,
      bulk: 0.5,
      custom: 0,
    };

    const goalRate = GOAL_RATES_KG_WEEK[goalPreset] ?? 0;

    if (!trendData || trendData.length < 7) {
      return {
        status: "insufficient_data",
        message: "Log your weight daily for at least 7 days to unlock weekly coaching.",
        recommendation: 0,
        goalRateKgPerWeek: goalRate,
        actualRateKgPerWeek: null,
        suggestedTarget: currentTarget,
        adaptiveTdee: adaptiveTdeeValue,
      };
    }

    const recent = trendData.slice(-7);
    const actualRateKgPerWeek =
      ((recent[recent.length - 1].trend - recent[0].trend) / recent.length) * 7;

    const rateDiff = actualRateKgPerWeek - goalRate;
    let recommendation = 0;
    let message = "";

    const KCAL_PER_KG = 7700;
    const tolerance = 0.08; // kg/week

    if (Math.abs(rateDiff) <= tolerance) {
      message = "On track! Your progress matches your goal rate perfectly.";
    } else if (["diet", "lose", "shred"].includes(goalPreset)) {
      if (rateDiff > tolerance) {
        recommendation = -Math.round((rateDiff * KCAL_PER_KG) / 7);
        message = `Losing slower than planned. Try reducing by ~${Math.abs(recommendation)} kcal/day.`;
      } else {
        recommendation = Math.round((Math.abs(rateDiff) * KCAL_PER_KG) / 7);
        message = `Losing faster than planned. Add ~${recommendation} kcal/day to protect muscle.`;
      }
    } else if (["gain", "bulk"].includes(goalPreset)) {
      if (rateDiff < -tolerance) {
        recommendation = Math.round((Math.abs(rateDiff) * KCAL_PER_KG) / 7);
        message = `Not gaining as planned. Add ~${recommendation} kcal/day.`;
      } else {
        recommendation = -Math.round((rateDiff * KCAL_PER_KG) / 7);
        message = `Gaining faster than planned. Reduce by ~${Math.abs(recommendation)} kcal/day.`;
      }
    } else {
      if (rateDiff > tolerance) {
        recommendation = -Math.round((rateDiff * KCAL_PER_KG) / 7);
        message = `Trending up. Reduce by ~${Math.abs(recommendation)} kcal/day to maintain.`;
      } else {
        recommendation = Math.round((Math.abs(rateDiff) * KCAL_PER_KG) / 7);
        message = `Trending down. Add ~${recommendation} kcal/day to maintain.`;
      }
    }

    return {
      status: "ok",
      message,
      recommendation,
      goalRateKgPerWeek: Math.round(goalRate * 100) / 100,
      actualRateKgPerWeek: Math.round(actualRateKgPerWeek * 100) / 100,
      suggestedTarget: Math.round(currentTarget + recommendation),
      adaptiveTdee: adaptiveTdeeValue,
    };
  };

  /**
   * Build an OpenAI prompt for a personalised workout plan.
   * Returns the prompt string to send to the /api/workout endpoint.
   */
  const buildWorkoutPrompt = ({ sex, age, weightKg, heightCm, tdeeValue, goalPreset, activityLevel, adaptiveTdeeValue }) => {
    const goalDescriptions = {
      maintain: "maintain current weight and improve fitness",
      diet: "lose weight gradually while preserving muscle (light cut)",
      lose: "lose weight steadily (moderate cut)",
      shred: "aggressive fat loss while retaining lean mass",
      gain: "build lean muscle (steady lean bulk)",
      bulk: "maximize muscle gain (caloric surplus bulk)",
      custom: "reach their custom nutrition goal",
    };

    const activityLabels = {
      1.2: "sedentary (desk job, little movement)",
      1.375: "lightly active (1–3 days exercise per week)",
      1.55: "moderately active (3–5 days exercise per week)",
      1.725: "very active (6–7 days exercise per week)",
      1.9: "extremely active (athlete, twice-daily training)",
    };

    const goalDesc = goalDescriptions[goalPreset] || goalDescriptions.maintain;
    const activityDesc = activityLabels[String(activityLevel)] || "moderately active";
    const tdeeDisplay = adaptiveTdeeValue || tdeeValue;

    return `You are an expert certified personal trainer and sports nutritionist. Create a personalised weekly workout plan for a client with the following profile:

- Sex: ${sex || "unspecified"}
- Age: ${age || "unspecified"} years
- Weight: ${weightKg ? `${weightKg} kg (${Math.round(weightKg * 2.20462)} lb)` : "unspecified"}
- Height: ${heightCm ? `${heightCm} cm (${Math.floor(heightCm / 30.48)}ft ${Math.round((heightCm % 30.48) / 2.54)}in)` : "unspecified"}
- TDEE: ${tdeeDisplay ? `${tdeeDisplay} kcal/day` : "not yet calculated"}
- Activity level: ${activityDesc}
- Goal: ${goalDesc}

Provide:
1. A 7-day workout schedule (specific exercises, sets, reps, and rest periods)
2. Recommended training split (e.g. Push/Pull/Legs, Upper/Lower, Full Body)
3. Cardio recommendation aligned with their TDEE and goal
4. Two key nutrition tips tied to their calorie target and goal
5. One recovery tip

Format clearly with headings and bullet points. Be specific and practical.`;
  };

  return {
    toMetric,
    bmrMifflin,
    tdee,
    target,
    weightEma,
    adaptiveTdee,
    weeklyCoaching,
    buildWorkoutPrompt,
  };
})();

window.MacroMintCalcs = MacroMintCalcs;
