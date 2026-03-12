// recipes.js — Recipe data for all LOCAL_MEALS entries
// Keys must match meal names exactly (used for lookup in meal modal)

const MEAL_RECIPES = {

  // ── BREAKFAST ──────────────────────────────────────────────────────────────

  "Oatmeal with banana & peanut butter": {
    time:"10 min", img:"🥣",
    ingredients:[
      {qty:"1",unit:"cup",item:"rolled oats",group:"starch"},
      {qty:"1",unit:"medium",item:"banana, sliced",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"peanut butter",group:"sauce"},
      {qty:"1",unit:"cup",item:"unsweetened almond milk",group:null},
      {qty:"1",unit:"tsp",item:"cinnamon",group:null},
      {qty:"1",unit:"tsp",item:"honey",group:null},
    ],
    steps:[
      "Bring almond milk to a simmer. Stir in oats and cook 3–5 min until thick.",
      "Pour into a bowl and top with banana slices.",
      "Drizzle peanut butter and honey; dust with cinnamon.",
    ],
    swaps:{protein:["almond butter","cashew butter","sunflower seed butter","tahini"],starch:["steel-cut oats","quinoa flakes","buckwheat groats","millet"],veggie:["blueberries","strawberry slices","diced mango","pear"],sauce:["honey","maple syrup","date syrup","agave nectar"]},
  },

  "Scrambled eggs & whole wheat toast": {
    time:"8 min", img:"🍳",
    ingredients:[
      {qty:"3",unit:"large",item:"eggs",group:"protein"},
      {qty:"2",unit:"slices",item:"whole wheat bread, toasted",group:"starch"},
      {qty:"1",unit:"tsp",item:"unsalted butter",group:"sauce"},
      {qty:"2",unit:"tbsp",item:"milk or cream",group:null},
      {qty:"¼",unit:"tsp",item:"sea salt & black pepper",group:null},
    ],
    steps:[
      "Whisk eggs with milk, salt, and pepper until fully combined.",
      "Melt butter in a non-stick pan over medium-low heat.",
      "Add eggs and gently fold with a spatula until just set — don't overcook.",
      "Serve immediately on toasted whole wheat bread.",
    ],
    swaps:{protein:["egg whites (6)","tofu scramble","smoked salmon","turkey sausage crumbles"],starch:["sourdough toast","rye bread","English muffin","whole grain bagel thin"],veggie:["sautéed spinach","diced tomato","sliced avocado","roasted peppers"],sauce:["hot sauce","salsa","everything bagel seasoning","herb cream cheese"]},
  },

  "Greek yogurt parfait with granola & berries": {
    time:"5 min", img:"🍓",
    ingredients:[
      {qty:"1",unit:"cup",item:"plain Greek yogurt",group:"protein"},
      {qty:"¼",unit:"cup",item:"granola",group:"starch"},
      {qty:"½",unit:"cup",item:"mixed berries",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"honey",group:"sauce"},
      {qty:"1",unit:"tbsp",item:"chia seeds",group:null},
    ],
    steps:[
      "Spoon yogurt into a bowl or glass.",
      "Layer berries and granola on top.",
      "Drizzle with honey and sprinkle chia seeds.",
    ],
    swaps:{protein:["plain skyr","cottage cheese","coconut yogurt","kefir"],starch:["muesli","puffed quinoa","crushed walnuts","bran flakes"],veggie:["blueberries","sliced strawberries","diced peach","kiwi chunks"],sauce:["honey","maple syrup","pomegranate molasses","agave"]},
  },

  "Protein smoothie — banana, milk & whey protein": {
    time:"5 min", img:"🥤",
    ingredients:[
      {qty:"1",unit:"scoop",item:"whey protein powder",group:"protein"},
      {qty:"1",unit:"medium",item:"banana, frozen",group:"veggie"},
      {qty:"1",unit:"cup",item:"whole milk",group:null},
      {qty:"½",unit:"cup",item:"ice cubes",group:null},
      {qty:"1",unit:"tbsp",item:"peanut butter",group:"sauce"},
    ],
    steps:[
      "Add all ingredients to blender.",
      "Blend on high 30–45 seconds until smooth and creamy.",
      "Pour and drink immediately.",
    ],
    swaps:{protein:["plant-based protein powder","collagen peptides","Greek yogurt (½ cup)","cottage cheese (¼ cup)"],starch:["rolled oats (¼ cup)","frozen mango","medjool date","sweet potato (¼ cup cooked)"],veggie:["frozen spinach handful","frozen berries","frozen peach","kale handful"],sauce:["almond butter","sunflower butter","cacao powder","vanilla extract"]},
  },

  "Avocado toast with 2 fried eggs": {
    time:"10 min", img:"🥑",
    ingredients:[
      {qty:"2",unit:"large",item:"eggs",group:"protein"},
      {qty:"2",unit:"slices",item:"sourdough bread, toasted",group:"starch"},
      {qty:"½",unit:"medium",item:"ripe avocado",group:"veggie"},
      {qty:"1",unit:"tsp",item:"olive oil",group:"sauce"},
      {qty:"¼",unit:"tsp",item:"red pepper flakes",group:null},
      {qty:"1",unit:"pinch",item:"sea salt & lemon juice",group:null},
    ],
    steps:[
      "Toast bread until golden and firm.",
      "Mash avocado with a pinch of salt and a squeeze of lemon.",
      "Fry eggs in olive oil over medium heat to desired doneness.",
      "Spread avocado on toast, top with eggs, flakes, and sea salt.",
    ],
    swaps:{protein:["poached eggs","smoked salmon","turkey slices","soft-boiled eggs"],starch:["whole wheat toast","rye bread","multigrain bread","rice cakes"],veggie:["sliced tomato","arugula","microgreens","cucumber ribbons"],sauce:["everything bagel seasoning","hot sauce","balsamic glaze","pesto"]},
  },

  "Overnight oats with chia seeds & honey": {
    time:"5 min prep + overnight", img:"🌙",
    ingredients:[
      {qty:"½",unit:"cup",item:"rolled oats",group:"starch"},
      {qty:"2",unit:"tbsp",item:"chia seeds",group:null},
      {qty:"¾",unit:"cup",item:"unsweetened almond milk",group:null},
      {qty:"1",unit:"tbsp",item:"honey",group:"sauce"},
      {qty:"½",unit:"cup",item:"berries, for topping",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"plain Greek yogurt",group:"protein"},
    ],
    steps:[
      "Combine oats, chia, almond milk, and honey in a jar. Stir well.",
      "Cover and refrigerate overnight (at least 6 hours).",
      "In the morning, stir and top with yogurt and berries.",
    ],
    swaps:{protein:["skyr","cottage cheese","protein powder (½ scoop)","hemp seeds"],starch:["gluten-free oats","muesli","quinoa flakes","amaranth flakes"],veggie:["sliced banana","diced mango","kiwi","pear chunks"],sauce:["honey","maple syrup","date paste","agave"]},
  },

  "Cottage cheese bowl with fruit & almonds": {
    time:"3 min", img:"🫙",
    ingredients:[
      {qty:"1",unit:"cup",item:"low-fat cottage cheese",group:"protein"},
      {qty:"½",unit:"cup",item:"mixed fresh fruit",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"sliced almonds",group:"starch"},
      {qty:"1",unit:"tsp",item:"honey",group:"sauce"},
      {qty:"1",unit:"pinch",item:"cinnamon",group:null},
    ],
    steps:[
      "Spoon cottage cheese into a bowl.",
      "Arrange fresh fruit on top.",
      "Scatter almonds, drizzle honey, dust with cinnamon.",
    ],
    swaps:{protein:["plain Greek yogurt","plain skyr","ricotta","quark"],starch:["walnuts","pumpkin seeds","granola","puffed rice"],veggie:["sliced peach","pineapple chunks","blueberries","sliced strawberries"],sauce:["honey","jam (1 tsp)","maple syrup","pomegranate seeds"]},
  },

  "Veggie omelette with feta & spinach": {
    time:"12 min", img:"🫑",
    ingredients:[
      {qty:"3",unit:"large",item:"eggs",group:"protein"},
      {qty:"1",unit:"cup",item:"fresh spinach",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"crumbled feta",group:"sauce"},
      {qty:"¼",unit:"cup",item:"diced bell pepper",group:"veggie"},
      {qty:"1",unit:"tsp",item:"olive oil",group:null},
      {qty:"¼",unit:"tsp",item:"black pepper",group:null},
    ],
    steps:[
      "Sauté pepper and spinach in olive oil 2 min until wilted.",
      "Whisk eggs with black pepper; pour over veggies.",
      "Cook 3–4 min until edges set, then add feta and fold.",
      "Slide onto plate and serve immediately.",
    ],
    swaps:{protein:["egg whites (6)","tofu (silken, crumbled)","smoked salmon flakes","turkey crumbles"],starch:["whole grain toast (side)","sliced avocado","roasted potatoes","rice cakes"],veggie:["mushrooms","cherry tomatoes","kale","asparagus spears"],sauce:["goat cheese","shredded mozzarella","nutritional yeast","herbed cream cheese"]},
  },

  "Açaí bowl with granola, banana & honey": {
    time:"5 min", img:"🫐",
    ingredients:[
      {qty:"1",unit:"packet",item:"frozen açaí purée (100g)",group:"protein"},
      {qty:"½",unit:"medium",item:"banana",group:"veggie"},
      {qty:"¼",unit:"cup",item:"granola",group:"starch"},
      {qty:"¼",unit:"cup",item:"mixed berries",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"honey",group:"sauce"},
    ],
    steps:[
      "Blend açaí packet with ½ banana and a splash of almond milk until thick.",
      "Pour into a bowl — consistency should be thicker than a smoothie.",
      "Top with remaining banana slices, berries, granola, and honey.",
    ],
    swaps:{protein:["pitaya (dragon fruit) purée","plain Greek yogurt base","blueberry-banana purée","mixed berry purée"],starch:["muesli","hemp granola","puffed quinoa","crushed raw nuts"],veggie:["kiwi slices","mango chunks","pineapple","passion fruit"],sauce:["honey","coconut flakes","cacao nibs","hemp seeds"]},
  },

  "Peanut butter & banana overnight oats": {
    time:"5 min prep + overnight", img:"🥜",
    ingredients:[
      {qty:"½",unit:"cup",item:"rolled oats",group:"starch"},
      {qty:"1",unit:"medium",item:"banana, mashed",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"natural peanut butter",group:"sauce"},
      {qty:"¾",unit:"cup",item:"oat milk",group:null},
      {qty:"1",unit:"tbsp",item:"chia seeds",group:null},
      {qty:"1",unit:"tsp",item:"vanilla extract",group:null},
    ],
    steps:[
      "Mash banana into a jar; stir in oats, chia, oat milk, and vanilla.",
      "Swirl in peanut butter — don't over-mix, leave ribbons.",
      "Seal and refrigerate overnight. Stir and eat cold or microwave 90 sec.",
    ],
    swaps:{protein:["almond butter","sunflower butter","protein powder","tahini"],starch:["gluten-free oats","quinoa flakes","buckwheat groats","muesli"],veggie:["sliced banana (topping)","blueberries","chopped dates","diced apple"],sauce:["cacao powder","honey drizzle","maple syrup","cinnamon"]},
  },

  "Smoked salmon & cream cheese on rye toast": {
    time:"5 min", img:"🍞",
    ingredients:[
      {qty:"3",unit:"oz",item:"smoked salmon",group:"protein"},
      {qty:"2",unit:"slices",item:"rye bread, toasted",group:"starch"},
      {qty:"2",unit:"tbsp",item:"light cream cheese",group:"sauce"},
      {qty:"¼",unit:"cup",item:"sliced cucumber",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"capers",group:null},
      {qty:"1",unit:"tsp",item:"lemon juice & dill",group:null},
    ],
    steps:[
      "Toast rye bread until crisp.",
      "Spread cream cheese evenly on each slice.",
      "Layer salmon, cucumber, and capers on top.",
      "Finish with lemon juice and fresh dill.",
    ],
    swaps:{protein:["canned tuna","smoked trout","sliced turkey breast","hard-boiled eggs"],starch:["sourdough toast","whole grain crispbreads","pumpernickel","whole wheat bagel"],veggie:["thinly sliced radish","red onion rings","arugula","avocado slices"],sauce:["herbed cream cheese","hummus","Greek yogurt dill dip","guacamole"]},
  },

  "Whole grain waffles with fresh berries": {
    time:"15 min", img:"🧇",
    ingredients:[
      {qty:"2",unit:"medium",item:"whole grain waffles",group:"starch"},
      {qty:"1",unit:"cup",item:"mixed fresh berries",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"plain Greek yogurt",group:"protein"},
      {qty:"1",unit:"tbsp",item:"honey",group:"sauce"},
      {qty:"1",unit:"tsp",item:"vanilla extract",group:null},
    ],
    steps:[
      "Toast waffles per package or cook in waffle iron.",
      "Mix yogurt with vanilla in a small bowl.",
      "Top waffles with dollop of yogurt and pile of berries.",
      "Drizzle with honey to finish.",
    ],
    swaps:{protein:["cottage cheese","cream cheese","nut butter","protein yogurt"],starch:["buckwheat waffles","almond flour waffles","whole grain pancakes","French toast"],veggie:["sliced banana","peach compote","warm blueberries","apple cinnamon topping"],sauce:["honey","pure maple syrup","berry jam","date syrup"]},
  },

  "Breakfast burrito — eggs, black beans & salsa": {
    time:"15 min", img:"🌯",
    ingredients:[
      {qty:"3",unit:"large",item:"eggs, scrambled",group:"protein"},
      {qty:"½",unit:"cup",item:"black beans, rinsed",group:"starch"},
      {qty:"1",unit:"large",item:"whole wheat tortilla",group:"starch"},
      {qty:"3",unit:"tbsp",item:"fresh salsa",group:"sauce"},
      {qty:"¼",unit:"cup",item:"diced bell pepper",group:"veggie"},
      {qty:"¼",unit:"tsp",item:"cumin & chili powder",group:null},
    ],
    steps:[
      "Sauté pepper in a skillet 2 min; season with cumin and chili.",
      "Add beans; heat through 1 min.",
      "Scramble eggs into the pan until just set.",
      "Warm tortilla, fill with egg mixture, top with salsa, roll tight.",
    ],
    swaps:{protein:["egg whites","tofu scramble","turkey sausage","chicken strips"],starch:["pinto beans","corn tortilla","whole grain wrap","spinach tortilla"],veggie:["sautéed spinach","roasted zucchini","diced tomato","jalapeño slices"],sauce:["pico de gallo","guacamole","Greek yogurt (sour cream sub)","hot sauce"]},
  },

  "Egg white scramble with mushrooms & peppers": {
    time:"10 min", img:"🍄",
    ingredients:[
      {qty:"5",unit:"large",item:"egg whites",group:"protein"},
      {qty:"½",unit:"cup",item:"sliced mushrooms",group:"veggie"},
      {qty:"½",unit:"cup",item:"diced bell pepper",group:"veggie"},
      {qty:"1",unit:"tsp",item:"olive oil",group:"sauce"},
      {qty:"¼",unit:"tsp",item:"garlic powder, salt & pepper",group:null},
    ],
    steps:[
      "Sauté mushrooms and pepper in olive oil 4–5 min until golden.",
      "Season with garlic powder, salt, and pepper.",
      "Pour in egg whites; fold gently until set but still moist.",
      "Serve immediately.",
    ],
    swaps:{protein:["whole eggs (3)","tofu (firm, crumbled)","liquid egg substitute","cottage cheese"],starch:["whole grain toast","roasted sweet potato cubes","brown rice cakes","avocado"],veggie:["baby spinach","diced onion","cherry tomatoes","asparagus pieces"],sauce:["hot sauce","salsa verde","pesto","fresh herbs"]},
  },

  "Baked oatmeal with blueberries & walnuts": {
    time:"35 min", img:"🫐",
    ingredients:[
      {qty:"1.5",unit:"cups",item:"rolled oats",group:"starch"},
      {qty:"1",unit:"cup",item:"fresh blueberries",group:"veggie"},
      {qty:"¼",unit:"cup",item:"chopped walnuts",group:"protein"},
      {qty:"1",unit:"cup",item:"unsweetened almond milk",group:null},
      {qty:"1",unit:"tbsp",item:"maple syrup",group:"sauce"},
      {qty:"1",unit:"tsp",item:"vanilla & cinnamon",group:null},
    ],
    steps:[
      "Preheat oven to 375°F. Combine oats, cinnamon in baking dish.",
      "Scatter blueberries and walnuts over oats.",
      "Whisk milk, maple syrup, and vanilla; pour over evenly.",
      "Bake 30–35 min until golden on top. Serve warm.",
    ],
    swaps:{protein:["sliced almonds","pecans","pumpkin seeds","hemp hearts"],starch:["gluten-free oats","quinoa flakes","muesli","steel-cut oats"],veggie:["raspberries","sliced banana","diced apple","dried cherries"],sauce:["maple syrup","honey","date syrup","brown sugar (1 tsp)"]},
  },

  "Sweet potato & egg breakfast hash": {
    time:"25 min", img:"🍠",
    ingredients:[
      {qty:"1",unit:"medium",item:"sweet potato, diced small",group:"starch"},
      {qty:"2",unit:"large",item:"eggs",group:"protein"},
      {qty:"½",unit:"cup",item:"diced bell pepper & onion",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"½",unit:"tsp",item:"smoked paprika & cumin",group:null},
      {qty:"¼",unit:"tsp",item:"garlic powder",group:null},
    ],
    steps:[
      "Heat oil in a cast-iron skillet. Add sweet potato, cook 10 min, stirring.",
      "Add pepper and onion; cook 5 more min until tender.",
      "Season with paprika, cumin, garlic. Make 2 wells in hash.",
      "Crack an egg into each well; cover and cook 3–4 min.",
    ],
    swaps:{protein:["egg whites (4)","turkey sausage","smoked salmon","tempeh crumbles"],starch:["russet potato","butternut squash","parsnip","beets"],veggie:["mushrooms","zucchini","kale","cherry tomatoes"],sauce:["hot sauce","avocado slices","Greek yogurt","salsa"]},
  },

  "Chia seed pudding with mango & coconut": {
    time:"5 min + 4 hr chill", img:"🥭",
    ingredients:[
      {qty:"3",unit:"tbsp",item:"chia seeds",group:"starch"},
      {qty:"1",unit:"cup",item:"light coconut milk",group:null},
      {qty:"½",unit:"cup",item:"diced fresh mango",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"toasted coconut flakes",group:"sauce"},
      {qty:"1",unit:"tsp",item:"vanilla extract",group:null},
      {qty:"1",unit:"tsp",item:"maple syrup",group:null},
    ],
    steps:[
      "Whisk chia seeds, coconut milk, vanilla, and maple syrup.",
      "Refrigerate at least 4 hours, stirring once after 30 min.",
      "Top with fresh mango and toasted coconut before serving.",
    ],
    swaps:{protein:["hemp protein powder (1 tbsp)","Greek yogurt layer","cottage cheese layer","silken tofu blend"],starch:["ground flaxseed","psyllium husk","oat milk base","almond milk base"],veggie:["pineapple chunks","passion fruit","kiwi","papaya"],sauce:["toasted coconut flakes","cacao nibs","granola","bee pollen"]},
  },

  "Buckwheat pancakes with fresh berries": {
    time:"20 min", img:"🥞",
    ingredients:[
      {qty:"¾",unit:"cup",item:"buckwheat flour",group:"starch"},
      {qty:"1",unit:"large",item:"egg",group:"protein"},
      {qty:"¾",unit:"cup",item:"buttermilk",group:null},
      {qty:"1",unit:"cup",item:"fresh mixed berries",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"pure maple syrup",group:"sauce"},
      {qty:"½",unit:"tsp",item:"baking powder & vanilla",group:null},
    ],
    steps:[
      "Whisk flour, baking powder; mix in egg, buttermilk, vanilla.",
      "Cook ¼-cup portions on medium skillet 2–3 min per side.",
      "Top with fresh berries and a drizzle of maple syrup.",
    ],
    swaps:{protein:["protein powder (1 scoop in batter)","egg whites (2)","flax egg","Greek yogurt topping"],starch:["oat flour","almond flour blend","whole wheat flour","spelt flour"],veggie:["blueberries","sliced strawberries","banana slices","warm peach compote"],sauce:["pure maple syrup","honey","nut butter drizzle","berry coulis"]},
  },

  "Turkey & egg white breakfast wrap": {
    time:"10 min", img:"🌮",
    ingredients:[
      {qty:"4",unit:"large",item:"egg whites",group:"protein"},
      {qty:"2",unit:"oz",item:"lean sliced turkey breast",group:"protein"},
      {qty:"1",unit:"large",item:"whole wheat tortilla",group:"starch"},
      {qty:"¼",unit:"cup",item:"baby spinach",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"salsa",group:"sauce"},
      {qty:"¼",unit:"tsp",item:"black pepper",group:null},
    ],
    steps:[
      "Scramble egg whites in a non-stick pan until just set.",
      "Warm tortilla 30 sec. Layer turkey and spinach.",
      "Add egg whites and top with salsa. Roll and serve.",
    ],
    swaps:{protein:["whole eggs (2)","smoked salmon","chicken strips","tofu scramble"],starch:["corn tortilla","spinach wrap","lettuce wrap (low-carb)","whole grain flatbread"],veggie:["arugula","sliced tomato","roasted peppers","avocado slices"],sauce:["salsa","hot sauce","guacamole","Greek yogurt"]},
  },

  "Quinoa breakfast bowl with poached egg & avocado": {
    time:"20 min", img:"🍳",
    ingredients:[
      {qty:"½",unit:"cup",item:"cooked quinoa",group:"starch"},
      {qty:"2",unit:"large",item:"eggs, poached",group:"protein"},
      {qty:"½",unit:"medium",item:"ripe avocado, sliced",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"¼",unit:"tsp",item:"sea salt, red pepper flakes",group:null},
      {qty:"1",unit:"tsp",item:"lemon juice",group:null},
    ],
    steps:[
      "Reheat quinoa with a splash of water.",
      "Bring a pot of water to gentle simmer; add vinegar. Poach eggs 3–4 min.",
      "Spread quinoa in bowl; fan avocado on top.",
      "Nestle poached eggs on top; drizzle olive oil and lemon.",
    ],
    swaps:{protein:["fried eggs","soft-boiled eggs","smoked salmon","baked tofu"],starch:["brown rice","farro","amaranth","roasted sweet potato"],veggie:["sautéed kale","roasted cherry tomatoes","cucumber slices","microgreens"],sauce:["tahini drizzle","pesto","sriracha mayo","lemon vinaigrette"]},
  },

  "Smoked salmon & cucumber on rye crispbreads": {
    time:"5 min", img:"🥒",
    ingredients:[
      {qty:"3",unit:"oz",item:"smoked salmon",group:"protein"},
      {qty:"3",unit:"pieces",item:"rye crispbreads",group:"starch"},
      {qty:"½",unit:"cup",item:"thinly sliced cucumber",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"cream cheese or labneh",group:"sauce"},
      {qty:"1",unit:"tbsp",item:"fresh dill",group:null},
      {qty:"1",unit:"tsp",item:"lemon juice",group:null},
    ],
    steps:[
      "Spread cream cheese on each crispbread.",
      "Layer cucumber slices, then salmon on top.",
      "Finish with fresh dill and a squeeze of lemon.",
    ],
    swaps:{protein:["canned sardines","smoked trout","sliced turkey","hard-boiled egg slices"],starch:["whole grain crackers","rice cakes","sourdough toast","pumpernickel"],veggie:["sliced radish","red onion rings","arugula","avocado slices"],sauce:["cream cheese","labneh","hummus","tzatziki"]},
  },

  "Plain skyr with fresh berries & hemp seeds": {
    time:"2 min", img:"🍓",
    ingredients:[
      {qty:"¾",unit:"cup",item:"plain Icelandic skyr",group:"protein"},
      {qty:"½",unit:"cup",item:"fresh mixed berries",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"hemp seeds",group:"starch"},
      {qty:"1",unit:"tsp",item:"honey",group:"sauce"},
    ],
    steps:[
      "Spoon skyr into a bowl.",
      "Top with berries and hemp seeds.",
      "Drizzle with honey.",
    ],
    swaps:{protein:["plain Greek yogurt","quark","cottage cheese","plain kefir"],starch:["chia seeds","flaxseed","granola","crushed walnuts"],veggie:["blueberries","sliced strawberries","raspberries","diced mango"],sauce:["honey","maple syrup","pomegranate molasses","fresh lemon zest"]},
  },

  "Almond butter & banana on whole grain toast": {
    time:"5 min", img:"🫙",
    ingredients:[
      {qty:"2",unit:"slices",item:"whole grain bread, toasted",group:"starch"},
      {qty:"2",unit:"tbsp",item:"natural almond butter",group:"protein"},
      {qty:"1",unit:"medium",item:"banana, sliced",group:"veggie"},
      {qty:"1",unit:"tsp",item:"honey",group:"sauce"},
      {qty:"1",unit:"pinch",item:"cinnamon",group:null},
    ],
    steps:[
      "Toast bread to desired crispness.",
      "Spread almond butter generously on each slice.",
      "Layer banana slices; drizzle honey and dust with cinnamon.",
    ],
    swaps:{protein:["peanut butter","cashew butter","sunflower seed butter","hazelnut butter"],starch:["sourdough","rye bread","English muffin","whole grain rice cakes"],veggie:["strawberry slices","apple slices","blueberries","dried figs"],sauce:["honey","maple syrup","chia jam","cacao nibs"]},
  },

  // ── LUNCH ──────────────────────────────────────────────────────────────────

  "Grilled chicken salad with olive oil & lemon": {
    time:"20 min", img:"🥗",
    ingredients:[
      {qty:"5",unit:"oz",item:"chicken breast, grilled & sliced",group:"protein"},
      {qty:"3",unit:"cups",item:"mixed greens",group:"veggie"},
      {qty:"½",unit:"cup",item:"cherry tomatoes, halved",group:"veggie"},
      {qty:"¼",unit:"cup",item:"sliced cucumber",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"extra-virgin olive oil",group:"sauce"},
      {qty:"1",unit:"tbsp",item:"fresh lemon juice",group:null},
    ],
    steps:[
      "Season chicken with salt, pepper, garlic powder. Grill 6–7 min per side.",
      "Rest chicken 5 min, then slice thin.",
      "Toss greens, tomatoes, cucumber with olive oil and lemon.",
      "Arrange chicken on top; season and serve.",
    ],
    swaps:{protein:["grilled shrimp","seared salmon","canned tuna","baked tofu"],starch:["whole grain croutons","chickpeas","roasted sweet potato cubes","quinoa"],veggie:["arugula","romaine","spinach","kale"],sauce:["lemon vinaigrette","balsamic glaze","tahini dressing","Greek dressing"]},
  },

  "Turkey, avocado & spinach wrap": {
    time:"8 min", img:"🌯",
    ingredients:[
      {qty:"4",unit:"oz",item:"sliced lean turkey breast",group:"protein"},
      {qty:"1",unit:"large",item:"whole wheat tortilla",group:"starch"},
      {qty:"½",unit:"medium",item:"avocado, sliced",group:"veggie"},
      {qty:"1",unit:"cup",item:"fresh spinach",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"hummus",group:"sauce"},
      {qty:"1",unit:"tbsp",item:"Dijon mustard",group:null},
    ],
    steps:[
      "Warm tortilla 30 sec in a dry skillet.",
      "Spread hummus and mustard across the center.",
      "Layer turkey, avocado, and spinach.",
      "Roll tightly, tucking sides in, and slice diagonally.",
    ],
    swaps:{protein:["grilled chicken","smoked salmon","roast beef (lean)","baked tempeh"],starch:["spinach tortilla","corn wrap","lettuce wrap","sourdough flatbread"],veggie:["arugula","romaine","mixed greens","cucumber ribbons"],sauce:["hummus","avocado spread","Greek yogurt ranch","tahini"]},
  },

  "Tuna melt on whole wheat bread": {
    time:"12 min", img:"🐟",
    ingredients:[
      {qty:"5",unit:"oz",item:"canned tuna in water, drained",group:"protein"},
      {qty:"2",unit:"slices",item:"whole wheat bread",group:"starch"},
      {qty:"2",unit:"tbsp",item:"light mayo",group:"sauce"},
      {qty:"¼",unit:"cup",item:"diced celery & red onion",group:"veggie"},
      {qty:"1",unit:"slice",item:"part-skim mozzarella",group:null},
      {qty:"1",unit:"tsp",item:"Dijon mustard",group:null},
    ],
    steps:[
      "Mix tuna with mayo, mustard, celery, and onion.",
      "Pile onto bread; top with mozzarella slice.",
      "Toast open-faced under broiler 3–4 min until cheese bubbles.",
    ],
    swaps:{protein:["canned salmon","sardines","shrimp salad","chicken salad"],starch:["sourdough","rye bread","whole grain English muffin","pita"],veggie:["sliced tomato","baby spinach","arugula","sliced cucumber"],sauce:["light mayo","Greek yogurt mayo","avocado mayo","hummus"]},
  },

  "Brown rice bowl with black beans & salsa": {
    time:"15 min", img:"🍚",
    ingredients:[
      {qty:"¾",unit:"cup",item:"cooked brown rice",group:"starch"},
      {qty:"½",unit:"cup",item:"black beans, rinsed",group:"protein"},
      {qty:"¼",unit:"cup",item:"fresh salsa",group:"sauce"},
      {qty:"¼",unit:"medium",item:"avocado, diced",group:"veggie"},
      {qty:"¼",unit:"cup",item:"corn kernels",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"lime juice & cilantro",group:null},
    ],
    steps:[
      "Reheat rice. Warm black beans with a pinch of cumin.",
      "Build bowl: rice base, then beans, corn, and avocado.",
      "Top with salsa, lime, and fresh cilantro.",
    ],
    swaps:{protein:["pinto beans","lentils","grilled chicken","tofu"],starch:["white rice","quinoa","farro","cauliflower rice"],veggie:["roasted peppers","diced tomato","shredded cabbage","jalapeño"],sauce:["fresh salsa","guacamole","hot sauce","Greek yogurt"]},
  },

  "Grilled chicken & quinoa power bowl": {
    time:"30 min", img:"🍗",
    ingredients:[
      {qty:"5",unit:"oz",item:"chicken breast, grilled & diced",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked quinoa",group:"starch"},
      {qty:"1",unit:"cup",item:"roasted broccoli",group:"veggie"},
      {qty:"¼",unit:"cup",item:"shredded carrots",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"lemon-herb vinaigrette",group:"sauce"},
    ],
    steps:[
      "Season and grill chicken 6–7 min per side; dice after resting.",
      "Roast broccoli at 400°F 15 min with olive oil and garlic.",
      "Build bowl: quinoa base, broccoli, carrots, chicken on top.",
      "Drizzle with vinaigrette.",
    ],
    swaps:{protein:["grilled shrimp","baked salmon","chickpeas","baked tofu"],starch:["brown rice","farro","bulgur","sweet potato cubes"],veggie:["roasted zucchini","sautéed kale","snap peas","edamame"],sauce:["lemon-herb vinaigrette","tahini","tzatziki","pesto"]},
  },

  "Lentil soup with whole grain bread": {
    time:"35 min", img:"🥣",
    ingredients:[
      {qty:"1",unit:"cup",item:"red or green lentils, rinsed",group:"protein"},
      {qty:"1",unit:"slice",item:"whole grain bread",group:"starch"},
      {qty:"1",unit:"cup",item:"diced carrots, celery & onion",group:"veggie"},
      {qty:"3",unit:"cups",item:"low-sodium vegetable broth",group:null},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"1",unit:"tsp",item:"cumin, turmeric, smoked paprika",group:null},
    ],
    steps:[
      "Sauté onion, carrots, celery in olive oil 5 min.",
      "Add spices; toast 1 min. Add lentils and broth.",
      "Simmer 25–30 min until lentils are completely soft.",
      "Blend partially for creamy-chunky texture. Serve with bread.",
    ],
    swaps:{protein:["chickpeas","split peas","black beans","white beans"],starch:["sourdough","pita","rye crispbreads","whole grain crackers"],veggie:["diced tomatoes","spinach","sweet potato","kale"],sauce:["olive oil drizzle","lemon squeeze","Greek yogurt dollop","harissa"]},
  },

  "Baked salmon with roasted sweet potato": {
    time:"30 min", img:"🐟",
    ingredients:[
      {qty:"5",unit:"oz",item:"salmon fillet",group:"protein"},
      {qty:"1",unit:"medium",item:"sweet potato, cubed",group:"starch"},
      {qty:"1",unit:"cup",item:"asparagus spears",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"1",unit:"tsp",item:"lemon zest, garlic, dill",group:null},
      {qty:"½",unit:"tsp",item:"sea salt & pepper",group:null},
    ],
    steps:[
      "Preheat oven to 400°F. Toss sweet potato in olive oil; roast 15 min.",
      "Push to one side; add asparagus and salmon.",
      "Season salmon with lemon zest, garlic, dill, and pepper.",
      "Bake 12–15 more min until salmon flakes easily.",
    ],
    swaps:{protein:["cod fillet","tilapia","chicken breast","shrimp"],starch:["baby potatoes","butternut squash","beets","carrots"],veggie:["broccolini","green beans","zucchini","Brussels sprouts"],sauce:["olive oil","lemon-caper sauce","pesto","teriyaki glaze"]},
  },

  "Turkey & hummus sandwich on sourdough": {
    time:"5 min", img:"🥪",
    ingredients:[
      {qty:"4",unit:"oz",item:"lean sliced turkey",group:"protein"},
      {qty:"2",unit:"slices",item:"sourdough bread",group:"starch"},
      {qty:"3",unit:"tbsp",item:"hummus",group:"sauce"},
      {qty:"1",unit:"cup",item:"baby spinach & sliced tomato",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"Dijon mustard",group:null},
    ],
    steps:[
      "Spread hummus on both slices of bread.",
      "Layer turkey, spinach, and tomato.",
      "Add mustard if desired. Press together and serve.",
    ],
    swaps:{protein:["grilled chicken","roast beef (lean)","canned tuna","smoked salmon"],starch:["whole wheat bread","rye bread","ciabatta","whole grain wrap"],veggie:["arugula","cucumber slices","roasted peppers","sliced avocado"],sauce:["hummus","guacamole","pesto mayo","tzatziki"]},
  },

  "Caprese sandwich with fresh mozzarella": {
    time:"8 min", img:"🍅",
    ingredients:[
      {qty:"3",unit:"oz",item:"fresh mozzarella, sliced",group:"protein"},
      {qty:"2",unit:"slices",item:"sourdough bread",group:"starch"},
      {qty:"2",unit:"medium",item:"ripe tomatoes, sliced",group:"veggie"},
      {qty:"8",unit:"leaves",item:"fresh basil",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"balsamic glaze",group:"sauce"},
      {qty:"1",unit:"tsp",item:"extra-virgin olive oil",group:null},
    ],
    steps:[
      "Lightly toast sourdough if desired.",
      "Layer mozzarella and tomato slices alternating on bread.",
      "Tuck in basil leaves; drizzle olive oil and balsamic glaze.",
    ],
    swaps:{protein:["burrata","smoked mozzarella","sliced chicken","grilled halloumi"],starch:["ciabatta roll","whole grain bread","flatbread","grilled focaccia"],veggie:["heirloom tomatoes","roasted red peppers","arugula","thinly sliced zucchini"],sauce:["balsamic glaze","pesto","sun-dried tomato spread","olive tapenade"]},
  },

  "Roasted chicken, wild rice & roasted beet bowl": {
    time:"30 min", img:"🫐",
    ingredients:[
      {qty:"5",unit:"oz",item:"roasted chicken thigh, sliced",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked wild rice blend",group:"starch"},
      {qty:"½",unit:"cup",item:"roasted beets, cubed",group:"veggie"},
      {qty:"2",unit:"cups",item:"arugula",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"balsamic-honey dressing",group:"sauce"},
      {qty:"2",unit:"tbsp",item:"crumbled goat cheese",group:null},
    ],
    steps:[
      "Roast beets at 400°F, 25 min with olive oil until tender.",
      "Slice chicken after resting. Reheat wild rice.",
      "Build bowl: arugula, rice, beets, chicken.",
      "Crumble goat cheese and drizzle with balsamic-honey dressing.",
    ],
    swaps:{protein:["roasted salmon","grilled chicken breast","duck breast","tempeh"],starch:["farro","brown rice","barley","lentils"],veggie:["roasted carrots","butternut squash","Brussels sprouts","radicchio"],sauce:["balsamic-honey","orange vinaigrette","tahini","pomegranate dressing"]},
  },

  "Cobb salad — egg, avocado, turkey & romaine": {
    time:"15 min", img:"🥗",
    ingredients:[
      {qty:"3",unit:"cups",item:"chopped romaine lettuce",group:"veggie"},
      {qty:"3",unit:"oz",item:"sliced turkey breast",group:"protein"},
      {qty:"2",unit:"large",item:"hard-boiled eggs, halved",group:"protein"},
      {qty:"½",unit:"medium",item:"avocado, diced",group:"veggie"},
      {qty:"¼",unit:"cup",item:"cherry tomatoes, halved",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"light ranch or balsamic",group:"sauce"},
    ],
    steps:[
      "Hard-boil eggs 10 min, cool and halve.",
      "Arrange romaine in a wide bowl.",
      "Lay turkey, eggs, avocado, and tomatoes in neat rows.",
      "Drizzle dressing over everything.",
    ],
    swaps:{protein:["grilled chicken","canned tuna","smoked salmon","chickpeas"],starch:["whole grain croutons","chickpeas","corn kernels","cooked quinoa"],veggie:["cucumber","shredded carrot","roasted beets","watercress"],sauce:["light ranch","balsamic vinaigrette","blue cheese dressing","lemon tahini"]},
  },

  "Tuna poke bowl with brown rice & avocado": {
    time:"15 min", img:"🐠",
    ingredients:[
      {qty:"5",unit:"oz",item:"sushi-grade ahi tuna, cubed",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked brown rice",group:"starch"},
      {qty:"½",unit:"medium",item:"avocado, diced",group:"veggie"},
      {qty:"¼",unit:"cup",item:"edamame, shelled",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"low-sodium soy-sesame sauce",group:"sauce"},
      {qty:"1",unit:"tsp",item:"sesame seeds & green onion",group:null},
    ],
    steps:[
      "Toss tuna with soy-sesame sauce; marinate 5 min.",
      "Layer warm rice in bowl.",
      "Top with marinated tuna, avocado, and edamame.",
      "Garnish with sesame seeds and green onion.",
    ],
    swaps:{protein:["salmon (sashimi-grade)","cooked shrimp","canned tuna (cooked option)","baked tofu"],starch:["white sushi rice","quinoa","soba noodles","cauliflower rice"],veggie:["cucumber ribbons","shredded purple cabbage","mango cubes","pickled radish"],sauce:["soy-sesame","ponzu","spicy mayo","miso-ginger dressing"]},
  },

  "Falafel bowl with hummus, cucumber & pita": {
    time:"15 min", img:"🧆",
    ingredients:[
      {qty:"4",unit:"pieces",item:"baked falafel",group:"protein"},
      {qty:"1",unit:"small",item:"whole wheat pita",group:"starch"},
      {qty:"3",unit:"tbsp",item:"hummus",group:"sauce"},
      {qty:"½",unit:"cup",item:"diced cucumber & tomato",group:"veggie"},
      {qty:"2",unit:"cups",item:"mixed greens",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"tahini drizzle",group:null},
    ],
    steps:[
      "Warm falafel in oven or air fryer 5 min.",
      "Warm pita. Build bowl with greens as base.",
      "Add cucumber, tomato. Nestle falafel around edges.",
      "Spread hummus, drizzle tahini, add pita on side.",
    ],
    swaps:{protein:["grilled chicken","lentil patties","roasted chickpeas","halloumi slices"],starch:["brown rice","whole grain cracker","flatbread","cooked bulgur"],veggie:["tabbouleh","pickled onions","roasted peppers","arugula"],sauce:["hummus","tzatziki","tahini","baba ganoush"]},
  },

  "Grilled shrimp tacos x2 on corn tortillas": {
    time:"20 min", img:"🌮",
    ingredients:[
      {qty:"5",unit:"oz",item:"large shrimp, peeled & deveined",group:"protein"},
      {qty:"2",unit:"small",item:"corn tortillas",group:"starch"},
      {qty:"¾",unit:"cup",item:"shredded cabbage slaw",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"chipotle-lime crema",group:"sauce"},
      {qty:"1",unit:"tbsp",item:"cilantro & lime juice",group:null},
      {qty:"½",unit:"tsp",item:"cumin & smoked paprika",group:null},
    ],
    steps:[
      "Season shrimp with cumin and paprika. Grill or sear 2 min per side.",
      "Warm tortillas in dry skillet 30 sec each side.",
      "Pile slaw into tortillas; top with shrimp.",
      "Drizzle crema, squeeze lime, and add cilantro.",
    ],
    swaps:{protein:["grilled chicken","lean ground beef","baked cod","black beans"],starch:["flour tortillas","whole wheat tortillas","lettuce cups","jicama wraps"],veggie:["sliced avocado","mango slaw","diced tomato","pickled red onion"],sauce:["chipotle-lime crema","salsa verde","guacamole","Greek yogurt dip"]},
  },

  "Grilled chicken & veggie panini on whole grain": {
    time:"15 min", img:"🥪",
    ingredients:[
      {qty:"4",unit:"oz",item:"grilled chicken breast, sliced",group:"protein"},
      {qty:"2",unit:"slices",item:"whole grain bread",group:"starch"},
      {qty:"¼",unit:"cup",item:"roasted peppers",group:"veggie"},
      {qty:"¼",unit:"cup",item:"fresh spinach",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"pesto",group:"sauce"},
      {qty:"1",unit:"slice",item:"provolone cheese",group:null},
    ],
    steps:[
      "Spread pesto on both bread slices.",
      "Layer chicken, roasted peppers, spinach, and provolone.",
      "Press in panini press or skillet with heavy pan on top 3–4 min.",
    ],
    swaps:{protein:["sliced turkey","roast beef","smoked salmon","grilled portobello"],starch:["ciabatta","sourdough","whole wheat wrap","rye bread"],veggie:["sun-dried tomatoes","arugula","artichoke hearts","sliced zucchini"],sauce:["pesto","hummus","olive tapenade","balsamic mayo"]},
  },

  "Nicoise salad — tuna, egg, olives & green beans": {
    time:"20 min", img:"🥗",
    ingredients:[
      {qty:"5",unit:"oz",item:"oil-packed tuna, drained",group:"protein"},
      {qty:"2",unit:"large",item:"hard-boiled eggs, halved",group:"protein"},
      {qty:"1",unit:"cup",item:"green beans, blanched",group:"veggie"},
      {qty:"1",unit:"cup",item:"cherry tomatoes",group:"veggie"},
      {qty:"¼",unit:"cup",item:"Kalamata olives",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"Dijon vinaigrette",group:"sauce"},
    ],
    steps:[
      "Blanch green beans 3 min in boiling salted water; cool in ice bath.",
      "Hard-boil eggs 10 min; cool and halve.",
      "Arrange greens, beans, tomatoes, olives, tuna, and eggs on plate.",
      "Drizzle Dijon vinaigrette over everything.",
    ],
    swaps:{protein:["canned salmon","grilled anchovies","seared ahi","boiled chicken"],starch:["fingerling potatoes","whole grain croutons","cannellini beans","chickpeas"],veggie:["artichoke hearts","roasted beets","cucumber","radishes"],sauce:["Dijon vinaigrette","lemon-caper dressing","balsamic","herb oil"]},
  },

  "Sesame tofu bowl with edamame & brown rice": {
    time:"25 min", img:"🥢",
    ingredients:[
      {qty:"6",unit:"oz",item:"extra-firm tofu, cubed & baked",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked brown rice",group:"starch"},
      {qty:"½",unit:"cup",item:"shelled edamame",group:"veggie"},
      {qty:"½",unit:"cup",item:"shredded purple cabbage",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"sesame-ginger sauce",group:"sauce"},
      {qty:"1",unit:"tsp",item:"sesame seeds & green onion",group:null},
    ],
    steps:[
      "Press tofu; cut into cubes. Bake at 400°F 25 min, flipping once.",
      "Toss warm tofu in sesame-ginger sauce.",
      "Build bowl: rice, edamame, cabbage, sauced tofu.",
      "Top with sesame seeds and green onion.",
    ],
    swaps:{protein:["tempeh","chickpeas","edamame patty","grilled chicken"],starch:["white rice","soba noodles","quinoa","cauliflower rice"],veggie:["shredded carrots","snap peas","baby bok choy","sliced cucumber"],sauce:["sesame-ginger","teriyaki","miso-tahini","peanut-lime"]},
  },

  "Turkey meatball sub on whole wheat roll": {
    time:"25 min", img:"🥖",
    ingredients:[
      {qty:"5",unit:"oz",item:"lean turkey meatballs (4–5)",group:"protein"},
      {qty:"1",unit:"whole wheat",item:"hoagie roll",group:"starch"},
      {qty:"⅓",unit:"cup",item:"marinara sauce",group:"sauce"},
      {qty:"1",unit:"slice",item:"part-skim mozzarella",group:null},
      {qty:"¼",unit:"cup",item:"shredded romaine",group:"veggie"},
      {qty:"¼",unit:"tsp",item:"garlic powder & Italian seasoning",group:null},
    ],
    steps:[
      "Mix turkey with garlic powder and Italian seasoning; form balls.",
      "Bake meatballs at 400°F 18 min until cooked through.",
      "Warm marinara; toss meatballs in sauce.",
      "Fill roll, top with mozzarella. Broil 2 min to melt. Add romaine.",
    ],
    swaps:{protein:["beef meatballs (lean)","chicken meatballs","plant-based meatballs","grilled chicken slices"],starch:["sourdough roll","whole grain ciabatta","pita","whole wheat wrap"],veggie:["arugula","roasted peppers","banana peppers","fresh basil"],sauce:["marinara","arrabbiata","pesto","roasted tomato sauce"]},
  },

  "Egg salad on whole grain with mixed greens": {
    time:"15 min", img:"🥚",
    ingredients:[
      {qty:"3",unit:"large",item:"hard-boiled eggs, chopped",group:"protein"},
      {qty:"2",unit:"slices",item:"whole grain bread",group:"starch"},
      {qty:"1",unit:"tbsp",item:"light mayo",group:"sauce"},
      {qty:"1",unit:"tsp",item:"Dijon mustard",group:null},
      {qty:"1",unit:"cup",item:"mixed greens",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"diced celery & chives",group:null},
    ],
    steps:[
      "Hard-boil eggs 10 min; cool and chop.",
      "Mix eggs with mayo, mustard, celery, and chives. Season.",
      "Pile egg salad on bread and top with mixed greens.",
    ],
    swaps:{protein:["egg whites only","chickpea salad (mashed)","avocado-egg blend","tuna"],starch:["sourdough","rye bread","whole grain crackers","lettuce wrap"],veggie:["arugula","spinach","watercress","sliced tomato"],sauce:["light mayo","Greek yogurt","avocado mayo","hummus"]},
  },

  "White bean & kale soup with sourdough": {
    time:"30 min", img:"🥣",
    ingredients:[
      {qty:"1",unit:"cup",item:"white cannellini beans, rinsed",group:"protein"},
      {qty:"1",unit:"slice",item:"sourdough bread",group:"starch"},
      {qty:"2",unit:"cups",item:"chopped kale",group:"veggie"},
      {qty:"1",unit:"cup",item:"diced onion, carrot & celery",group:"veggie"},
      {qty:"3",unit:"cups",item:"low-sodium chicken or veg broth",group:null},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
    ],
    steps:[
      "Sauté onion, carrot, celery in olive oil 5 min.",
      "Add beans and broth; bring to simmer.",
      "Stir in kale; cook 8–10 min until wilted and beans are tender.",
      "Season with salt, pepper, and a squeeze of lemon. Serve with bread.",
    ],
    swaps:{protein:["chickpeas","lentils","navy beans","grilled chicken strips"],starch:["whole grain baguette","rye bread","whole grain croutons","pasta"],veggie:["spinach","chard","escarole","broccoli rabe"],sauce:["olive oil drizzle","pesto swirl","lemon juice","parmesan grating"]},
  },

  "Greek salad with grilled chicken & tzatziki": {
    time:"20 min", img:"🥗",
    ingredients:[
      {qty:"5",unit:"oz",item:"chicken breast, grilled & sliced",group:"protein"},
      {qty:"2",unit:"cups",item:"chopped romaine & cucumber",group:"veggie"},
      {qty:"½",unit:"cup",item:"cherry tomatoes & Kalamata olives",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"crumbled feta",group:null},
      {qty:"3",unit:"tbsp",item:"tzatziki",group:"sauce"},
      {qty:"1",unit:"tbsp",item:"olive oil & lemon juice",group:null},
    ],
    steps:[
      "Grill chicken 6–7 min per side; let rest, then slice.",
      "Toss romaine, cucumber, tomatoes, and olives with olive oil and lemon.",
      "Plate salad; top with chicken and crumbled feta.",
      "Serve tzatziki on the side or drizzled over.",
    ],
    swaps:{protein:["grilled shrimp","baked salmon","chickpeas","grilled halloumi"],starch:["whole wheat pita (side)","warm farro","chickpeas","roasted potatoes"],veggie:["bell peppers","artichoke hearts","roasted beets","radishes"],sauce:["tzatziki","hummus","tahini-lemon","Greek vinaigrette"]},
  },

  "Spelt wrap with roasted veggies & goat cheese": {
    time:"25 min", img:"🌯",
    ingredients:[
      {qty:"1",unit:"large",item:"spelt or whole grain tortilla",group:"starch"},
      {qty:"2",unit:"oz",item:"crumbled goat cheese",group:"protein"},
      {qty:"1",unit:"cup",item:"roasted zucchini, peppers & onion",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"sun-dried tomato pesto",group:"sauce"},
      {qty:"½",unit:"cup",item:"arugula",group:"veggie"},
    ],
    steps:[
      "Toss vegetables in olive oil; roast at 425°F 20 min until caramelized.",
      "Warm tortilla. Spread pesto across center.",
      "Layer arugula, roasted veggies, and goat cheese. Roll tight.",
    ],
    swaps:{protein:["hummus","feta cheese","baked tofu","grilled halloumi"],starch:["whole wheat wrap","spinach tortilla","flatbread","lettuce wrap"],veggie:["roasted eggplant","artichoke hearts","roasted mushrooms","broccolini"],sauce:["sun-dried tomato pesto","classic pesto","balsamic glaze","tapenade"]},
  },

  // ── DINNER ─────────────────────────────────────────────────────────────────

  "Grilled salmon, asparagus & brown rice": {
    time:"25 min", img:"🐟",
    ingredients:[
      {qty:"6",unit:"oz",item:"salmon fillet",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked brown rice",group:"starch"},
      {qty:"8",unit:"spears",item:"asparagus",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"1",unit:"tsp",item:"lemon zest & fresh dill",group:null},
      {qty:"½",unit:"tsp",item:"sea salt & black pepper",group:null},
    ],
    steps:[
      "Heat grill to medium-high. Rub salmon with olive oil, salt, and pepper.",
      "Grill salmon 4–5 min per side until internal temp reaches 145°F.",
      "Toss asparagus in olive oil; grill 3–4 min alongside salmon.",
      "Serve over warm brown rice; top with lemon zest and dill.",
    ],
    swaps:{protein:["grilled cod","seared halibut","chicken breast","tempeh"],starch:["quinoa","wild rice","farro","roasted sweet potato"],veggie:["broccolini","green beans","snap peas","zucchini"],sauce:["olive oil & lemon","teriyaki glaze","miso butter","herb pesto"]},
  },

  "Lean beef & broccoli stir-fry with white rice": {
    time:"20 min", img:"🥦",
    ingredients:[
      {qty:"5",unit:"oz",item:"lean flank steak, thinly sliced",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked white rice",group:"starch"},
      {qty:"2",unit:"cups",item:"broccoli florets",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"low-sodium stir-fry sauce",group:"sauce"},
      {qty:"1",unit:"tsp",item:"sesame oil & ginger",group:null},
      {qty:"2",unit:"cloves",item:"garlic, minced",group:null},
    ],
    steps:[
      "Marinate beef in stir-fry sauce 10 min.",
      "Stir-fry beef in hot skillet or wok 2–3 min; remove.",
      "Add broccoli, garlic, and ginger; stir-fry 4 min.",
      "Return beef; toss together. Serve over rice.",
    ],
    swaps:{protein:["chicken thigh (sliced)","shrimp","firm tofu","pork tenderloin (sliced)"],starch:["brown rice","fried rice","noodles","cauliflower rice"],veggie:["snap peas","bok choy","bell peppers","mushrooms"],sauce:["stir-fry sauce","teriyaki","oyster sauce","hoisin"]},
  },

  "Turkey & veggie sheet-pan bake": {
    time:"35 min", img:"🍗",
    ingredients:[
      {qty:"6",unit:"oz",item:"lean turkey breast cutlet",group:"protein"},
      {qty:"1",unit:"cup",item:"roasted sweet potato cubes",group:"starch"},
      {qty:"1",unit:"cup",item:"broccoli & bell pepper",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"1",unit:"tsp",item:"garlic powder, rosemary & thyme",group:null},
    ],
    steps:[
      "Preheat oven to 400°F. Toss all veggies in olive oil and seasoning.",
      "Spread on sheet pan; add turkey cutlet to center.",
      "Season turkey with garlic, herbs, salt, and pepper.",
      "Bake 25–30 min until turkey is 165°F and veggies are caramelized.",
    ],
    swaps:{protein:["chicken breast","pork tenderloin","salmon fillet","portobello caps"],starch:["baby potatoes","butternut squash","parsnips","beets"],veggie:["Brussels sprouts","zucchini","asparagus","green beans"],sauce:["olive oil","honey-Dijon glaze","pesto","chimichurri"]},
  },

  "Lean ground turkey tacos x3 (corn shells)": {
    time:"20 min", img:"🌮",
    ingredients:[
      {qty:"5",unit:"oz",item:"lean ground turkey",group:"protein"},
      {qty:"3",unit:"small",item:"corn taco shells",group:"starch"},
      {qty:"½",unit:"cup",item:"shredded lettuce & diced tomato",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"plain Greek yogurt (sour cream sub)",group:"sauce"},
      {qty:"1",unit:"tsp",item:"taco seasoning",group:null},
      {qty:"¼",unit:"cup",item:"salsa",group:null},
    ],
    steps:[
      "Brown turkey in skillet; add taco seasoning and 3 tbsp water.",
      "Cook 5 min until liquid absorbs.",
      "Warm taco shells. Fill with turkey, lettuce, tomato.",
      "Top with Greek yogurt and salsa.",
    ],
    swaps:{protein:["ground chicken","lean ground beef","black beans","plant-based ground"],starch:["flour tortillas","lettuce cups","jicama shells","whole wheat tortillas"],veggie:["shredded cabbage","diced avocado","pickled jalapeños","corn salsa"],sauce:["Greek yogurt","guacamole","chipotle mayo","salsa verde"]},
  },

  "Whole wheat pasta with marinara & lean beef": {
    time:"30 min", img:"🍝",
    ingredients:[
      {qty:"3",unit:"oz",item:"whole wheat pasta (dry)",group:"starch"},
      {qty:"5",unit:"oz",item:"lean ground beef (90%)",group:"protein"},
      {qty:"¾",unit:"cup",item:"marinara sauce",group:"sauce"},
      {qty:"½",unit:"cup",item:"diced onion & garlic",group:"veggie"},
      {qty:"¼",unit:"cup",item:"fresh spinach",group:"veggie"},
      {qty:"1",unit:"tsp",item:"Italian seasoning",group:null},
    ],
    steps:[
      "Cook pasta per package until al dente; reserve ¼ cup pasta water.",
      "Brown beef with onion and garlic; drain fat.",
      "Add marinara and Italian seasoning; simmer 5 min.",
      "Toss pasta and spinach in sauce; add pasta water to loosen.",
    ],
    swaps:{protein:["ground turkey","Italian chicken sausage","lentils","plant-based beef"],starch:["chickpea pasta","lentil pasta","regular pasta","spaghetti squash"],veggie:["zucchini","mushrooms","roasted bell peppers","cherry tomatoes"],sauce:["marinara","arrabbiata","roasted tomato","pesto"]},
  },

  "Shrimp stir-fry with jasmine rice & vegetables": {
    time:"20 min", img:"🍤",
    ingredients:[
      {qty:"5",unit:"oz",item:"large shrimp, peeled & deveined",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked jasmine rice",group:"starch"},
      {qty:"1",unit:"cup",item:"snap peas & bell peppers",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"garlic-ginger stir-fry sauce",group:"sauce"},
      {qty:"1",unit:"tsp",item:"sesame oil",group:null},
      {qty:"2",unit:"cloves",item:"garlic, minced",group:null},
    ],
    steps:[
      "Heat wok or skillet over high. Add sesame oil and garlic.",
      "Add veggies; stir-fry 3–4 min until crisp-tender.",
      "Push to sides; add shrimp, cook 1–2 min per side.",
      "Toss everything with sauce. Serve over rice.",
    ],
    swaps:{protein:["chicken breast strips","lean beef strips","firm tofu","scallops"],starch:["brown rice","fried rice","rice noodles","cauliflower rice"],veggie:["bok choy","broccoli","snow peas","baby corn"],sauce:["garlic-ginger sauce","teriyaki","hoisin","sweet chili"]},
  },

  "Pork tenderloin with roasted root vegetables": {
    time:"40 min", img:"🥕",
    ingredients:[
      {qty:"6",unit:"oz",item:"pork tenderloin",group:"protein"},
      {qty:"1",unit:"cup",item:"diced parsnips & carrots",group:"starch"},
      {qty:"1",unit:"cup",item:"Brussels sprouts, halved",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"1",unit:"tsp",item:"rosemary, thyme & garlic",group:null},
    ],
    steps:[
      "Preheat oven to 425°F. Rub tenderloin with herbs, salt, and pepper.",
      "Toss vegetables in olive oil; arrange on sheet pan.",
      "Sear tenderloin in oven-safe skillet 2 min per side.",
      "Transfer to pan with veggies; roast 20–25 min until 145°F.",
    ],
    swaps:{protein:["chicken thighs","turkey breast","lamb loin","salmon fillet"],starch:["sweet potato","fingerling potatoes","beets","turnips"],veggie:["asparagus","green beans","zucchini","broccoli"],sauce:["olive oil & herbs","honey-Dijon glaze","apple cider glaze","chimichurri"]},
  },

  "Tofu & vegetable curry with basmati rice": {
    time:"30 min", img:"🍛",
    ingredients:[
      {qty:"6",unit:"oz",item:"extra-firm tofu, cubed",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked basmati rice",group:"starch"},
      {qty:"1",unit:"cup",item:"diced sweet potato & bell pepper",group:"veggie"},
      {qty:"½",unit:"cup",item:"light coconut milk",group:null},
      {qty:"2",unit:"tbsp",item:"yellow curry paste",group:"sauce"},
      {qty:"1",unit:"cup",item:"spinach",group:"veggie"},
    ],
    steps:[
      "Press and cube tofu; pan-fry until golden, 5 min per side.",
      "Sauté sweet potato and pepper 5 min; add curry paste, toast 1 min.",
      "Pour in coconut milk; simmer 10 min. Add tofu and spinach.",
      "Stir until spinach wilts. Serve over basmati rice.",
    ],
    swaps:{protein:["chickpeas","chicken breast","shrimp","lentils"],starch:["jasmine rice","brown rice","quinoa","naan bread"],veggie:["cauliflower","green beans","peas","zucchini"],sauce:["yellow curry paste","red curry paste","green curry paste","tikka masala paste"]},
  },

  "Pulled chicken with slaw & brown rice": {
    time:"35 min", img:"🍗",
    ingredients:[
      {qty:"6",unit:"oz",item:"chicken breast, slow-cooked & pulled",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked brown rice",group:"starch"},
      {qty:"1",unit:"cup",item:"apple-cider vinegar slaw",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"smoky BBQ sauce (low sugar)",group:"sauce"},
      {qty:"½",unit:"tsp",item:"garlic powder & smoked paprika",group:null},
    ],
    steps:[
      "Season chicken; bake at 375°F 25 min. Pull apart with forks.",
      "Toss shredded chicken with BBQ sauce.",
      "Mix cabbage, carrot, and green onion with cider vinegar.",
      "Serve chicken over brown rice; pile slaw on top.",
    ],
    swaps:{protein:["pulled pork (lean)","shredded turkey","jackfruit","grilled chicken strips"],starch:["white rice","whole wheat roll","sweet potato","cauliflower rice"],veggie:["mango slaw","cabbage slaw","pickled jalapeños","roasted corn"],sauce:["BBQ sauce","honey mustard","chipotle sauce","teriyaki"]},
  },

  "Seared tuna with edamame & miso rice": {
    time:"20 min", img:"🐟",
    ingredients:[
      {qty:"6",unit:"oz",item:"ahi tuna steak",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked rice with white miso",group:"starch"},
      {qty:"½",unit:"cup",item:"shelled edamame",group:"veggie"},
      {qty:"½",unit:"cup",item:"sliced cucumber & avocado",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"soy-sesame dressing",group:"sauce"},
      {qty:"1",unit:"tsp",item:"sesame seeds & green onion",group:null},
    ],
    steps:[
      "Mix 1 tbsp white miso into warm cooked rice.",
      "Sear tuna in very hot skillet 90 sec per side (rare center).",
      "Slice tuna across the grain.",
      "Bowl up rice, edamame, cucumber, avocado, and tuna; drizzle dressing.",
    ],
    swaps:{protein:["grilled salmon","baked cod","chicken breast","grilled shrimp"],starch:["soba noodles","brown rice","cauliflower rice","quinoa"],veggie:["shredded cabbage","snap peas","radish slices","pickled ginger"],sauce:["soy-sesame","ponzu","miso-ginger","spicy mayo"]},
  },

  "Lamb kofta with tzatziki & whole grain couscous": {
    time:"30 min", img:"🫕",
    ingredients:[
      {qty:"5",unit:"oz",item:"lean ground lamb",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked whole grain couscous",group:"starch"},
      {qty:"¼",unit:"cup",item:"tzatziki sauce",group:"sauce"},
      {qty:"1",unit:"cup",item:"diced cucumber & tomato salad",group:"veggie"},
      {qty:"1",unit:"tsp",item:"cumin, coriander & cinnamon",group:null},
      {qty:"2",unit:"tbsp",item:"fresh parsley",group:null},
    ],
    steps:[
      "Mix lamb with spices, parsley, salt, and pepper; form into logs on skewers.",
      "Grill or broil kofta 8–10 min, turning once.",
      "Fluff couscous with fork; season with lemon and olive oil.",
      "Serve kofta over couscous with cucumber-tomato salad and tzatziki.",
    ],
    swaps:{protein:["ground turkey kofta","beef kofta","chicken kofta","lentil kofta"],starch:["pita bread","brown rice","quinoa tabbouleh","orzo"],veggie:["roasted peppers","arugula salad","pickled red onion","hummus"],sauce:["tzatziki","hummus","tahini","baba ganoush"]},
  },

  "Black bean & sweet potato enchiladas (x2)": {
    time:"40 min", img:"🫔",
    ingredients:[
      {qty:"½",unit:"cup",item:"black beans, mashed",group:"protein"},
      {qty:"2",unit:"large",item:"corn tortillas",group:"starch"},
      {qty:"½",unit:"medium",item:"sweet potato, roasted & mashed",group:"starch"},
      {qty:"½",unit:"cup",item:"enchilada sauce",group:"sauce"},
      {qty:"¼",unit:"cup",item:"part-skim shredded cheese",group:null},
      {qty:"½",unit:"cup",item:"diced onion & peppers",group:"veggie"},
    ],
    steps:[
      "Preheat oven 375°F. Roast sweet potato cubes 20 min.",
      "Mix mashed sweet potato with black beans, onion, and cumin.",
      "Fill tortillas; roll and place seam-down in baking dish.",
      "Pour enchilada sauce over; top with cheese. Bake 20 min.",
    ],
    swaps:{protein:["pinto beans","chicken","ground turkey","lentils"],starch:["flour tortillas","whole wheat tortillas","corn tortillas","zucchini boats"],veggie:["roasted corn","bell peppers","spinach","poblano peppers"],sauce:["red enchilada","green enchilada","mole sauce","salsa roja"]},
  },

  "Chicken tikka masala with basmati rice": {
    time:"35 min", img:"🍛",
    ingredients:[
      {qty:"6",unit:"oz",item:"chicken breast, cubed",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked basmati rice",group:"starch"},
      {qty:"½",unit:"cup",item:"tikka masala sauce",group:"sauce"},
      {qty:"½",unit:"cup",item:"diced tomatoes & onion",group:"veggie"},
      {qty:"¼",unit:"cup",item:"plain Greek yogurt (marinade)",group:null},
      {qty:"1",unit:"tsp",item:"garam masala, ginger & garlic",group:null},
    ],
    steps:[
      "Marinate chicken in yogurt, garam masala, ginger, garlic 15 min.",
      "Sear chicken in skillet 5–6 min; set aside.",
      "Sauté onion, add tikka masala sauce; simmer 5 min.",
      "Add chicken back; cook 5 more min. Serve over rice.",
    ],
    swaps:{protein:["shrimp","paneer","chickpeas","lamb cubes"],starch:["jasmine rice","brown rice","naan","cauliflower rice"],veggie:["bell peppers","spinach","peas","eggplant"],sauce:["tikka masala sauce","butter chicken sauce","korma sauce","vindaloo paste"]},
  },

  "Sesame noodles with edamame & soft-boiled egg": {
    time:"20 min", img:"🍜",
    ingredients:[
      {qty:"2",unit:"large",item:"eggs, soft-boiled",group:"protein"},
      {qty:"3",unit:"oz",item:"soba noodles, cooked",group:"starch"},
      {qty:"½",unit:"cup",item:"shelled edamame",group:"veggie"},
      {qty:"½",unit:"cup",item:"shredded cucumber & scallion",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"sesame-peanut sauce",group:"sauce"},
      {qty:"1",unit:"tsp",item:"sesame seeds & chili flakes",group:null},
    ],
    steps:[
      "Cook noodles per package; rinse with cold water.",
      "Soft-boil eggs 6 min; peel and halve.",
      "Toss noodles with sesame-peanut sauce.",
      "Bowl up noodles with edamame, cucumber, scallion, and egg halves.",
    ],
    swaps:{protein:["grilled chicken","tofu","shrimp","lean beef strips"],starch:["rice noodles","whole wheat noodles","udon","ramen"],veggie:["shredded carrot","snap peas","bok choy","spinach"],sauce:["sesame-peanut","miso-tahini","spicy gochujang","ginger-lime"]},
  },

  "Baked cod with lemon, capers & roasted broccoli": {
    time:"25 min", img:"🐟",
    ingredients:[
      {qty:"6",unit:"oz",item:"cod fillet",group:"protein"},
      {qty:"2",unit:"cups",item:"broccoli florets",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"2",unit:"tbsp",item:"capers, rinsed",group:null},
      {qty:"1",unit:"whole",item:"lemon, zest & juice",group:null},
      {qty:"½",unit:"tsp",item:"garlic powder & dill",group:null},
    ],
    steps:[
      "Preheat oven to 400°F. Toss broccoli in olive oil; spread on sheet pan.",
      "Roast broccoli 10 min. Push aside; add seasoned cod.",
      "Top cod with capers, lemon zest, and lemon juice.",
      "Bake 12–15 more min until cod flakes easily.",
    ],
    swaps:{protein:["tilapia","halibut","salmon","shrimp"],starch:["quinoa","brown rice","roasted potatoes","cauliflower mash"],veggie:["asparagus","green beans","Brussels sprouts","zucchini"],sauce:["lemon-caper butter","herb oil","tahini","salsa verde"]},
  },

  "Chicken & vegetable soup with crusty bread": {
    time:"40 min", img:"🍵",
    ingredients:[
      {qty:"5",unit:"oz",item:"chicken breast, diced",group:"protein"},
      {qty:"1",unit:"slice",item:"whole grain bread",group:"starch"},
      {qty:"2",unit:"cups",item:"diced carrots, celery, onion",group:"veggie"},
      {qty:"1",unit:"cup",item:"chopped zucchini",group:"veggie"},
      {qty:"4",unit:"cups",item:"low-sodium chicken broth",group:null},
      {qty:"1",unit:"tbsp",item:"olive oil",group:"sauce"},
    ],
    steps:[
      "Sauté onion, carrot, celery in olive oil 5 min.",
      "Add chicken; cook 4 min until sealed.",
      "Add broth; bring to simmer. Add zucchini; cook 15 min.",
      "Season with salt, pepper, thyme. Serve with bread.",
    ],
    swaps:{protein:["turkey breast","canned chickpeas","lentils","tofu"],starch:["sourdough","rye bread","whole grain crackers","pasta in soup"],veggie:["spinach","kale","sweet potato","parsnips"],sauce:["olive oil drizzle","fresh pesto spoon","hot sauce","lemon squeeze"]},
  },

  "Pesto chicken with cherry tomatoes & pasta": {
    time:"25 min", img:"🍝",
    ingredients:[
      {qty:"5",unit:"oz",item:"chicken breast, sliced & seared",group:"protein"},
      {qty:"3",unit:"oz",item:"whole wheat pasta (dry)",group:"starch"},
      {qty:"1",unit:"cup",item:"cherry tomatoes",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"basil pesto",group:"sauce"},
      {qty:"1",unit:"tsp",item:"olive oil & garlic",group:null},
    ],
    steps:[
      "Cook pasta al dente; reserve ¼ cup pasta water.",
      "Sear chicken in olive oil 5–6 min per side; slice.",
      "Blister tomatoes 2 min in same pan with garlic.",
      "Toss pasta with pesto; add tomatoes, chicken, and pasta water.",
    ],
    swaps:{protein:["shrimp","Italian chicken sausage","white beans","tofu"],starch:["chickpea pasta","regular pasta","zucchini noodles","gnocchi"],veggie:["sun-dried tomatoes","spinach","arugula","roasted peppers"],sauce:["basil pesto","arugula pesto","sun-dried tomato pesto","marinara"]},
  },

  "Moroccan chickpea stew with whole grain couscous": {
    time:"30 min", img:"🫕",
    ingredients:[
      {qty:"1",unit:"cup",item:"chickpeas, rinsed",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked whole grain couscous",group:"starch"},
      {qty:"1",unit:"cup",item:"diced sweet potato & zucchini",group:"veggie"},
      {qty:"¾",unit:"cup",item:"crushed tomatoes",group:"sauce"},
      {qty:"1",unit:"tsp",item:"ras el hanout (Moroccan spice)",group:null},
      {qty:"½",unit:"cup",item:"spinach",group:"veggie"},
    ],
    steps:[
      "Sauté onion and garlic 3 min. Add ras el hanout; toast 1 min.",
      "Add sweet potato, zucchini, chickpeas, and tomatoes.",
      "Simmer 20 min until sweet potato is tender.",
      "Stir in spinach; serve over fluffy couscous.",
    ],
    swaps:{protein:["lentils","white beans","lamb (lean)","chicken breast"],starch:["brown rice","quinoa","pita bread","bulgur"],veggie:["butternut squash","kale","roasted red peppers","eggplant"],sauce:["crushed tomatoes","harissa sauce","preserved lemon relish","yogurt drizzle"]},
  },

  "Grilled flank steak with chimichurri & peppers": {
    time:"25 min", img:"🥩",
    ingredients:[
      {qty:"6",unit:"oz",item:"lean flank steak",group:"protein"},
      {qty:"1.5",unit:"cups",item:"roasted mixed peppers & onions",group:"veggie"},
      {qty:"¼",unit:"cup",item:"chimichurri sauce",group:"sauce"},
      {qty:"½",unit:"cup",item:"cooked farro or quinoa",group:"starch"},
      {qty:"½",unit:"tsp",item:"sea salt, cumin & garlic",group:null},
    ],
    steps:[
      "Season steak with salt, cumin, and garlic.",
      "Grill over high heat 4–5 min per side for medium-rare; rest 5 min.",
      "Roast peppers and onion at 425°F 20 min.",
      "Slice steak thin against the grain; plate with peppers and chimichurri.",
    ],
    swaps:{protein:["sirloin steak","skirt steak","chicken thighs","portobello mushrooms"],starch:["farro","quinoa","roasted potatoes","corn tortillas"],veggie:["grilled asparagus","zucchini","broccolini","cherry tomatoes"],sauce:["chimichurri","salsa verde","herb oil","pesto"]},
  },

  "Thai green curry with shrimp & jasmine rice": {
    time:"25 min", img:"🍤",
    ingredients:[
      {qty:"5",unit:"oz",item:"large shrimp, peeled",group:"protein"},
      {qty:"¾",unit:"cup",item:"cooked jasmine rice",group:"starch"},
      {qty:"½",unit:"cup",item:"light coconut milk",group:null},
      {qty:"1",unit:"tbsp",item:"green curry paste",group:"sauce"},
      {qty:"1",unit:"cup",item:"snap peas, bell pepper & zucchini",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"fish sauce & lime juice",group:null},
    ],
    steps:[
      "Sauté curry paste in a wok 1 min until fragrant.",
      "Pour in coconut milk; bring to simmer.",
      "Add vegetables; cook 3–4 min.",
      "Add shrimp; cook 2–3 min until pink. Finish with fish sauce and lime.",
    ],
    swaps:{protein:["chicken breast","tofu","scallops","white fish"],starch:["brown rice","rice noodles","cauliflower rice","jasmine rice"],veggie:["eggplant","bok choy","bamboo shoots","broccoli"],sauce:["green curry paste","red curry paste","yellow curry paste","massaman paste"]},
  },

  "Baked chicken thighs with roasted sweet potato": {
    time:"40 min", img:"🍠",
    ingredients:[
      {qty:"2",unit:"medium",item:"skinless chicken thighs (bone-in)",group:"protein"},
      {qty:"1",unit:"large",item:"sweet potato, cubed",group:"starch"},
      {qty:"2",unit:"cups",item:"green beans",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"olive oil",group:"sauce"},
      {qty:"1",unit:"tsp",item:"garlic, smoked paprika & thyme",group:null},
    ],
    steps:[
      "Preheat oven to 425°F. Toss sweet potato in olive oil and paprika.",
      "Roast 15 min. Add seasoned chicken thighs and green beans.",
      "Bake 25 more min until chicken is 165°F and potato is caramelized.",
    ],
    swaps:{protein:["chicken breast","pork chops","salmon fillet","turkey thighs"],starch:["baby potatoes","parsnips","butternut squash","acorn squash"],veggie:["Brussels sprouts","asparagus","broccoli","broccolini"],sauce:["olive oil","honey-Dijon","BBQ glaze","lemon-herb butter"]},
  },

  "Stuffed bell peppers with lean beef & quinoa": {
    time:"45 min", img:"🫑",
    ingredients:[
      {qty:"4",unit:"oz",item:"lean ground beef (90%)",group:"protein"},
      {qty:"½",unit:"cup",item:"cooked quinoa",group:"starch"},
      {qty:"2",unit:"large",item:"bell peppers, halved & seeded",group:"veggie"},
      {qty:"½",unit:"cup",item:"tomato sauce",group:"sauce"},
      {qty:"¼",unit:"cup",item:"diced onion, garlic & tomato",group:"veggie"},
      {qty:"1",unit:"tsp",item:"Italian seasoning",group:null},
    ],
    steps:[
      "Preheat oven to 375°F. Halve and seed peppers; pre-roast 10 min.",
      "Brown beef with onion, garlic, and Italian seasoning.",
      "Mix in quinoa and half the tomato sauce.",
      "Fill peppers; top with remaining sauce. Bake 25 min.",
    ],
    swaps:{protein:["ground turkey","ground chicken","lentils","black beans"],starch:["brown rice","farro","bulgur","cauliflower rice"],veggie:["zucchini boats (sub for peppers)","tomatoes (stuffed)","portobello caps","acorn squash"],sauce:["tomato sauce","marinara","enchilada sauce","pesto"]},
  },

  // ── SNACK ──────────────────────────────────────────────────────────────────

  "Apple with 2 tbsp almond butter": {
    time:"2 min", img:"🍎",
    ingredients:[
      {qty:"1",unit:"medium",item:"apple, sliced",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"natural almond butter",group:"protein"},
      {qty:"1",unit:"pinch",item:"cinnamon",group:null},
    ],
    steps:["Slice apple into wedges.","Serve with almond butter for dipping; dust with cinnamon."],
    swaps:{protein:["peanut butter","cashew butter","sunflower butter","hazelnut butter"],starch:["pear","banana","celery sticks","rice cakes"],veggie:["pear","banana","mango slices","orange wedges"],sauce:["honey drizzle","cacao nibs","granola crumble","hemp seeds"]},
  },

  "Plain Greek yogurt with honey & walnuts": {
    time:"3 min", img:"🥛",
    ingredients:[
      {qty:"¾",unit:"cup",item:"plain Greek yogurt (2%)",group:"protein"},
      {qty:"2",unit:"tbsp",item:"crushed walnuts",group:"starch"},
      {qty:"1",unit:"tbsp",item:"honey",group:"sauce"},
      {qty:"¼",unit:"tsp",item:"cinnamon",group:null},
    ],
    steps:["Spoon yogurt into a bowl.","Top with walnuts; drizzle honey and sprinkle cinnamon."],
    swaps:{protein:["plain skyr","cottage cheese","coconut yogurt","quark"],starch:["almonds","pecans","granola","pumpkin seeds"],veggie:["fresh berries","sliced banana","diced apple","kiwi"],sauce:["honey","maple syrup","jam","date syrup"]},
  },

  "Mixed nuts & dried cranberries (40g)": {
    time:"1 min", img:"🥜",
    ingredients:[
      {qty:"40",unit:"g",item:"mixed nuts (almonds, cashews, walnuts)",group:"protein"},
      {qty:"2",unit:"tbsp",item:"dried cranberries (unsweetened)",group:"veggie"},
    ],
    steps:["Measure into a small bowl or snack bag. Done."],
    swaps:{protein:["trail mix","pumpkin seeds","sunflower seeds","roasted chickpeas"],starch:["rice cakes","whole grain crackers","popcorn","oat clusters"],veggie:["raisins","dried apricots","dried mango","freeze-dried berries"],sauce:["dark chocolate chips (few)","coconut flakes","cacao nibs","hemp seeds"]},
  },

  "Cottage cheese with pineapple chunks": {
    time:"2 min", img:"🍍",
    ingredients:[
      {qty:"¾",unit:"cup",item:"low-fat cottage cheese",group:"protein"},
      {qty:"½",unit:"cup",item:"fresh pineapple chunks",group:"veggie"},
      {qty:"1",unit:"pinch",item:"cinnamon",group:null},
    ],
    steps:["Spoon cottage cheese into a bowl.","Top with pineapple and cinnamon."],
    swaps:{protein:["plain Greek yogurt","plain skyr","ricotta","quark"],starch:["granola","walnuts","hemp seeds","oat clusters"],veggie:["mango chunks","peach slices","mandarin segments","diced strawberries"],sauce:["honey drizzle","cinnamon","vanilla extract","lime zest"]},
  },

  "Rice cakes with peanut butter & banana slices": {
    time:"3 min", img:"🫙",
    ingredients:[
      {qty:"2",unit:"plain",item:"brown rice cakes",group:"starch"},
      {qty:"2",unit:"tbsp",item:"natural peanut butter",group:"protein"},
      {qty:"½",unit:"medium",item:"banana, sliced",group:"veggie"},
      {qty:"1",unit:"tsp",item:"honey",group:"sauce"},
    ],
    steps:["Spread peanut butter on rice cakes.","Layer banana slices; drizzle honey."],
    swaps:{protein:["almond butter","cashew butter","sunflower butter","tahini"],starch:["whole grain crackers","sourdough toast","rice cakes (flavored)","celery sticks"],veggie:["apple slices","strawberry slices","blueberries","pear"],sauce:["honey","cinnamon","cacao nibs","chia jam"]},
  },

  "2 hard-boiled eggs & whole grain crackers": {
    time:"12 min", img:"🥚",
    ingredients:[
      {qty:"2",unit:"large",item:"eggs",group:"protein"},
      {qty:"6",unit:"whole grain",item:"crackers",group:"starch"},
      {qty:"1",unit:"pinch",item:"sea salt & black pepper",group:null},
      {qty:"1",unit:"tsp",item:"hot sauce (optional)",group:"sauce"},
    ],
    steps:["Place eggs in cold water; bring to boil, cook 10 min.","Cool in ice bath; peel and halve.","Serve alongside crackers; season with salt and pepper."],
    swaps:{protein:["deviled eggs","egg whites","mini quiche","edamame"],starch:["rice cakes","whole wheat pita chips","rye crispbreads","cucumber slices"],veggie:["sliced tomato","cucumber","bell pepper strips","radishes"],sauce:["hot sauce","mustard","hummus","everything bagel seasoning"]},
  },

  "Steamed edamame (1 cup) with sea salt": {
    time:"5 min", img:"🫘",
    ingredients:[
      {qty:"1",unit:"cup",item:"edamame in pods, frozen",group:"protein"},
      {qty:"½",unit:"tsp",item:"sea salt or soy sauce",group:"sauce"},
    ],
    steps:["Microwave or steam edamame 3–5 min until heated through.","Sprinkle with sea salt or drizzle soy sauce.","Serve in pods; pop beans out to eat."],
    swaps:{protein:["shelled edamame","roasted chickpeas","mixed nuts","lupini beans"],starch:["rice crackers","corn chips","rice cakes","pita chips"],veggie:["snap peas","sugar snap peas","cucumber","celery"],sauce:["sea salt","soy sauce","chili-lime salt","sesame oil dip"]},
  },

  "Sliced cucumber & bell pepper with hummus": {
    time:"5 min", img:"🥒",
    ingredients:[
      {qty:"½",unit:"medium",item:"cucumber, sliced",group:"veggie"},
      {qty:"½",unit:"medium",item:"bell pepper, strips",group:"veggie"},
      {qty:"3",unit:"tbsp",item:"hummus",group:"protein"},
    ],
    steps:["Slice cucumber and bell pepper into dippable pieces.","Arrange around hummus and dip."],
    swaps:{protein:["tzatziki","baba ganoush","white bean dip","guacamole"],starch:["pita chips","whole grain crackers","rice cakes","celery"],veggie:["carrot sticks","broccoli florets","radishes","snap peas"],sauce:["extra olive oil drizzle","smoked paprika dust","za'atar","chili flakes"]},
  },

  "Turkey & lettuce roll-ups (4 rolls)": {
    time:"5 min", img:"🌿",
    ingredients:[
      {qty:"4",unit:"slices",item:"lean turkey breast",group:"protein"},
      {qty:"4",unit:"large",item:"romaine lettuce leaves",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"hummus or mustard",group:"sauce"},
      {qty:"¼",unit:"cup",item:"shredded carrot & cucumber",group:"veggie"},
    ],
    steps:["Lay turkey on each lettuce leaf.","Spread hummus; add shredded carrot and cucumber.","Roll tightly and secure with toothpick if needed."],
    swaps:{protein:["sliced chicken breast","smoked salmon","roast beef","ham (lean)"],starch:["whole wheat tortilla chips","rice crackers","cucumber rounds","endive leaves"],veggie:["avocado slices","bell pepper strips","spinach","alfalfa sprouts"],sauce:["hummus","Dijon mustard","guacamole","cream cheese thin spread"]},
  },

  "Part-skim string cheese & a small apple": {
    time:"1 min", img:"🧀",
    ingredients:[
      {qty:"1",unit:"stick",item:"part-skim mozzarella string cheese",group:"protein"},
      {qty:"1",unit:"small",item:"apple",group:"veggie"},
    ],
    steps:["Peel string cheese; eat alongside sliced apple."],
    swaps:{protein:["cheddar cheese (1 oz)","babybel cheese","cottage cheese","Greek yogurt"],starch:["whole grain crackers","rice cakes","pretzels (1 oz)","oat clusters"],veggie:["pear","peach","grapes","orange"],sauce:["nut butter dip","honey","cinnamon","dark chocolate (small square)"]},
  },

  "Protein shake with unsweetened oat milk": {
    time:"3 min", img:"🥤",
    ingredients:[
      {qty:"1",unit:"scoop",item:"protein powder",group:"protein"},
      {qty:"1",unit:"cup",item:"unsweetened oat milk",group:null},
      {qty:"½",unit:"cup",item:"ice cubes",group:null},
    ],
    steps:["Blend all ingredients 20–30 sec until smooth.","Drink immediately."],
    swaps:{protein:["whey protein","plant-based protein","collagen peptides","Greek yogurt"],starch:["oat milk","almond milk","cashew milk","whole milk"],veggie:["frozen banana (adds creaminess)","frozen berries","spinach handful","frozen mango"],sauce:["cacao powder","vanilla extract","peanut butter (1 tbsp)","cinnamon"]},
  },

  "Oat & almond energy balls (3)": {
    time:"15 min + chill", img:"⚽",
    ingredients:[
      {qty:"1",unit:"cup",item:"rolled oats",group:"starch"},
      {qty:"3",unit:"tbsp",item:"almond butter",group:"protein"},
      {qty:"2",unit:"tbsp",item:"honey",group:"sauce"},
      {qty:"2",unit:"tbsp",item:"chia seeds",group:null},
      {qty:"2",unit:"tbsp",item:"mini dark chocolate chips",group:null},
    ],
    steps:["Mix all ingredients in a bowl until combined.","Refrigerate mixture 30 min to firm up.","Roll into 12 balls (serve 3). Keep rest in fridge."],
    swaps:{protein:["peanut butter","cashew butter","sunflower butter","tahini"],starch:["oat flour","shredded coconut","granola bits","puffed quinoa"],veggie:["dried cranberries","raisins","freeze-dried berries","dried apricot bits"],sauce:["honey","maple syrup","agave","date paste"]},
  },

  "Banana with 1 tbsp cashew butter": {
    time:"2 min", img:"🍌",
    ingredients:[
      {qty:"1",unit:"medium",item:"banana",group:"veggie"},
      {qty:"1",unit:"tbsp",item:"natural cashew butter",group:"protein"},
    ],
    steps:["Slice banana or eat whole.","Dip into or drizzle cashew butter over slices."],
    swaps:{protein:["peanut butter","almond butter","sunflower butter","tahini"],starch:["rice cake","whole grain toast","oat cracker","apple"],veggie:["banana","apple slices","pear","medjool dates"],sauce:["honey","cinnamon","cacao nibs","dark chocolate drizzle"]},
  },

  "Tuna on whole grain crispbreads (3)": {
    time:"5 min", img:"🐟",
    ingredients:[
      {qty:"3",unit:"oz",item:"canned tuna in water, drained",group:"protein"},
      {qty:"3",unit:"whole grain",item:"crispbreads / Wasa crackers",group:"starch"},
      {qty:"1",unit:"tbsp",item:"light mayo or Greek yogurt",group:"sauce"},
      {qty:"¼",unit:"cup",item:"sliced cucumber",group:"veggie"},
      {qty:"1",unit:"tsp",item:"lemon juice & black pepper",group:null},
    ],
    steps:["Mix tuna with mayo, lemon, and pepper.","Top each crispbread with tuna mixture.","Add cucumber slice on top."],
    swaps:{protein:["canned salmon","sardines","smoked trout","chicken salad"],starch:["rye crispbreads","rice cakes","whole grain crackers","cucumber rounds"],veggie:["sliced radish","cherry tomato half","avocado","arugula"],sauce:["light mayo","Greek yogurt","avocado mayo","mustard"]},
  },

  "Plain skyr with fresh mixed berries": {
    time:"2 min", img:"🫐",
    ingredients:[
      {qty:"¾",unit:"cup",item:"plain Icelandic skyr",group:"protein"},
      {qty:"½",unit:"cup",item:"mixed fresh berries",group:"veggie"},
      {qty:"1",unit:"tsp",item:"honey (optional)",group:"sauce"},
    ],
    steps:["Scoop skyr into bowl.","Top with berries and optional honey drizzle."],
    swaps:{protein:["plain Greek yogurt","cottage cheese","quark","kefir"],starch:["granola","hemp seeds","chia seeds","crushed almonds"],veggie:["blueberries","raspberries","strawberries","blackberries"],sauce:["honey","pomegranate molasses","lemon zest","vanilla extract"]},
  },

  "Walnut & date trail mix (1 oz)": {
    time:"1 min", img:"🥜",
    ingredients:[
      {qty:"½",unit:"oz",item:"raw walnuts",group:"protein"},
      {qty:"2",unit:"whole",item:"Medjool dates, pitted & halved",group:"veggie"},
      {qty:"¼",unit:"oz",item:"pumpkin seeds",group:"starch"},
    ],
    steps:["Combine in a small snack container.","Eat as is for a quick energy boost."],
    swaps:{protein:["almonds","cashews","Brazil nuts","macadamia nuts"],starch:["sunflower seeds","hemp hearts","granola pieces","puffed rice"],veggie:["dried apricots","raisins","dried cherries","dried blueberries"],sauce:["dark chocolate chips","coconut flakes","cacao nibs","sea salt flakes"]},
  },

  "Sliced turkey & cucumber rounds": {
    time:"3 min", img:"🥒",
    ingredients:[
      {qty:"3",unit:"oz",item:"lean sliced turkey breast",group:"protein"},
      {qty:"½",unit:"medium",item:"cucumber, sliced into rounds",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"hummus",group:"sauce"},
    ],
    steps:["Arrange cucumber rounds on a plate.","Add a small dab of hummus to each.","Top with a folded turkey slice."],
    swaps:{protein:["sliced chicken","smoked salmon bites","hard-boiled egg slices","roast beef"],starch:["whole grain crackers","rice cakes","celery","zucchini rounds"],veggie:["radish rounds","bell pepper pieces","endive leaves","romaine boats"],sauce:["hummus","tzatziki","guacamole","cream cheese"]},
  },

  "Roasted chickpeas with sea salt (½ cup)": {
    time:"30 min", img:"🫘",
    ingredients:[
      {qty:"½",unit:"cup",item:"chickpeas, rinsed & dried",group:"protein"},
      {qty:"1",unit:"tsp",item:"olive oil",group:"sauce"},
      {qty:"½",unit:"tsp",item:"sea salt",group:null},
      {qty:"¼",unit:"tsp",item:"smoked paprika or cumin",group:null},
    ],
    steps:["Preheat oven to 400°F. Pat chickpeas completely dry.","Toss with olive oil, salt, and paprika.","Roast 25–30 min, shaking once, until golden and crunchy."],
    swaps:{protein:["lupini beans","edamame","roasted lentils","pumpkin seeds"],starch:["popcorn","rice crackers","corn nuts","whole grain pretzels"],veggie:["roasted broad beans","crispy kale chips","roasted peas","air-popped popcorn"],sauce:["sea salt","chili-lime","cinnamon-sugar (sweet)","everything bagel seasoning"]},
  },

  "Frozen Greek yogurt bark with berries": {
    time:"10 min + freeze", img:"🍓",
    ingredients:[
      {qty:"1",unit:"cup",item:"plain Greek yogurt (2%)",group:"protein"},
      {qty:"½",unit:"cup",item:"mixed berries",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"granola",group:"starch"},
      {qty:"1",unit:"tbsp",item:"honey",group:"sauce"},
    ],
    steps:["Spread yogurt thinly (¼ inch) on lined baking sheet.","Scatter berries and granola on top; drizzle honey.","Freeze at least 2 hours. Break into pieces to serve."],
    swaps:{protein:["coconut yogurt","plain skyr","kefir-based","protein-enhanced yogurt"],starch:["granola","chopped nuts","hemp seeds","shredded coconut"],veggie:["strawberries","blueberries","kiwi slices","mango chunks"],sauce:["honey","maple syrup","cacao nibs","dark chocolate drizzle"]},
  },

  "Celery with natural peanut butter (2 tbsp)": {
    time:"2 min", img:"🥬",
    ingredients:[
      {qty:"3",unit:"stalks",item:"celery, cut into pieces",group:"veggie"},
      {qty:"2",unit:"tbsp",item:"natural peanut butter",group:"protein"},
      {qty:"1",unit:"pinch",item:"sea salt",group:null},
    ],
    steps:["Cut celery into 3-inch sticks.","Fill the center groove with peanut butter.","Eat immediately or refrigerate."],
    swaps:{protein:["almond butter","cashew butter","sunflower butter","tahini"],starch:["whole grain crackers","rice cakes","apple slices","cucumber"],veggie:["carrot sticks","bell pepper strips","cucumber","fennel sticks"],sauce:["nut butter","cream cheese","hummus","tzatziki"]},
  },

  "Chocolate protein shake (1 scoop, water)": {
    time:"2 min", img:"🍫",
    ingredients:[
      {qty:"1",unit:"scoop",item:"chocolate protein powder",group:"protein"},
      {qty:"10",unit:"oz",item:"cold water",group:null},
      {qty:"½",unit:"cup",item:"ice cubes",group:null},
    ],
    steps:["Combine in shaker bottle or blender.","Shake vigorously 20 sec or blend until smooth."],
    swaps:{protein:["chocolate whey","plant-based chocolate protein","cacao-flavored collagen","mocha protein"],starch:["almond milk base","oat milk base","add ½ banana","add 2 tbsp oats"],veggie:["frozen banana","frozen cauliflower rice (tasteless)","frozen spinach","frozen zucchini"],sauce:["peanut butter (1 tbsp)","cacao powder extra","vanilla extract","cinnamon"]},
  },

  "Sliced avocado on whole grain rice cakes": {
    time:"3 min", img:"🥑",
    ingredients:[
      {qty:"2",unit:"plain",item:"whole grain rice cakes",group:"starch"},
      {qty:"½",unit:"medium",item:"ripe avocado, sliced",group:"veggie"},
      {qty:"1",unit:"pinch",item:"sea salt & red pepper flakes",group:null},
      {qty:"1",unit:"tsp",item:"lemon juice",group:"sauce"},
    ],
    steps:["Fan avocado slices over rice cakes.","Squeeze lemon juice; season with salt and red pepper flakes."],
    swaps:{protein:["2 tbsp hummus","cottage cheese layer","smoked salmon","hard-boiled egg slices"],starch:["whole grain toast","rye crispbreads","corn cakes","whole wheat pita"],veggie:["sliced tomato","cucumber","radish slices","arugula"],sauce:["lemon juice","everything bagel seasoning","hot sauce","balsamic glaze"]},
  },

};
