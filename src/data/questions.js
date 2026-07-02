// CCAT Question Bank
// Categories: math_logic | verbal | spatial
// Types within:
//   math_logic: number_sequence | word_problem | algebra | logical_deduction
//   verbal: analogy | antonym | sentence_completion | syllogism
//   spatial: matrix | odd_one_out | pattern_series

export const questions = [
  // ─── MATH & LOGIC ───────────────────────────────────────────────────────────

  // Number sequences
  { id: 1, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n2, 4, 8, 16, ___",
    options: ["24", "32", "30", "18"], answer: "32",
    explanation: "Each number is multiplied by 2. 16 × 2 = 32." },

  { id: 2, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n3, 6, 11, 18, 27, ___",
    options: ["36", "38", "37", "40"], answer: "38",
    explanation: "Differences: +3, +5, +7, +9, +11. 27 + 11 = 38." },

  { id: 3, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n81, 27, 9, 3, ___",
    options: ["0", "1", "2", "6"], answer: "1",
    explanation: "Each number is divided by 3. 3 ÷ 3 = 1." },

  { id: 4, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n1, 1, 2, 3, 5, 8, ___",
    options: ["11", "12", "13", "14"], answer: "13",
    explanation: "Fibonacci sequence: each number is the sum of the two before it. 5 + 8 = 13." },

  { id: 5, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n100, 91, 83, 76, 70, ___",
    options: ["63", "64", "65", "66"], answer: "65",
    explanation: "Differences: -9, -8, -7, -6, -5. 70 - 5 = 65." },

  { id: 6, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n2, 6, 12, 20, 30, ___",
    options: ["40", "42", "44", "36"], answer: "42",
    explanation: "Differences: +4, +6, +8, +10, +12. 30 + 12 = 42." },

  { id: 7, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n5, 10, 20, 40, ___",
    options: ["60", "70", "80", "100"], answer: "80",
    explanation: "Each number is multiplied by 2. 40 × 2 = 80." },

  { id: 8, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n7, 14, 21, 28, ___",
    options: ["35", "32", "36", "42"], answer: "35",
    explanation: "Multiples of 7. 28 + 7 = 35." },

  { id: 9, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n144, 121, 100, 81, ___",
    options: ["64", "72", "60", "56"], answer: "64",
    explanation: "Perfect squares in descending order: 12², 11², 10², 9², 8² = 64." },

  { id: 10, category: "math_logic", type: "number_sequence",
    question: "What number comes next in the series?\n3, 7, 15, 31, ___",
    options: ["53", "60", "63", "55"], answer: "63",
    explanation: "Each term: × 2 + 1. 31 × 2 + 1 = 63." },

  // Word problems
  { id: 11, category: "math_logic", type: "word_problem",
    question: "A store sells apples for $0.50 each and oranges for $0.75 each. If Sarah buys 4 apples and 3 oranges, how much does she spend in total?",
    options: ["$3.75", "$4.25", "$3.25", "$4.00"], answer: "$4.25",
    explanation: "(4 × $0.50) + (3 × $0.75) = $2.00 + $2.25 = $4.25." },

  { id: 12, category: "math_logic", type: "word_problem",
    question: "A train travels 240 miles in 4 hours. At the same speed, how many miles will it travel in 7 hours?",
    options: ["360", "400", "420", "380"], answer: "420",
    explanation: "Speed = 240 ÷ 4 = 60 mph. Distance = 60 × 7 = 420 miles." },

  { id: 13, category: "math_logic", type: "word_problem",
    question: "If 5 workers can complete a job in 12 days, how many days will it take 10 workers to complete the same job?",
    options: ["3", "6", "8", "24"], answer: "6",
    explanation: "Inversely proportional: (5 × 12) ÷ 10 = 6 days." },

  { id: 14, category: "math_logic", type: "word_problem",
    question: "A rectangle has a length of 12 cm and a width of 8 cm. What is its area?",
    options: ["40 cm²", "80 cm²", "96 cm²", "88 cm²"], answer: "96 cm²",
    explanation: "Area = length × width = 12 × 8 = 96 cm²." },

  { id: 15, category: "math_logic", type: "word_problem",
    question: "Mark earns $15 per hour. He worked 40 hours this week. After paying 20% in taxes, how much does he take home?",
    options: ["$480", "$420", "$500", "$460"], answer: "$480",
    explanation: "Total = $15 × 40 = $600. After 20% tax: $600 × 0.80 = $480." },

  { id: 16, category: "math_logic", type: "word_problem",
    question: "A car depreciates by 15% each year. If it is worth $20,000 today, what will it be worth after 2 years?",
    options: ["$14,450", "$17,000", "$14,000", "$15,200"], answer: "$14,450",
    explanation: "Year 1: $20,000 × 0.85 = $17,000. Year 2: $17,000 × 0.85 = $14,450." },

  { id: 17, category: "math_logic", type: "word_problem",
    question: "If a shirt originally costs $80 and is on sale for 25% off, what is the sale price?",
    options: ["$20", "$55", "$60", "$65"], answer: "$60",
    explanation: "Discount = 25% × $80 = $20. Sale price = $80 − $20 = $60." },

  { id: 18, category: "math_logic", type: "word_problem",
    question: "A tank is 3/4 full. After using 120 liters, it is 1/4 full. What is the total capacity of the tank?",
    options: ["160 liters", "240 liters", "200 liters", "180 liters"], answer: "240 liters",
    explanation: "3/4 − 1/4 = 1/2 of tank = 120 liters. Full tank = 240 liters." },

  // Algebra
  { id: 19, category: "math_logic", type: "algebra",
    question: "If 3x + 7 = 22, what is the value of x?",
    options: ["3", "4", "5", "6"], answer: "5",
    explanation: "3x = 22 − 7 = 15. x = 15 ÷ 3 = 5." },

  { id: 20, category: "math_logic", type: "algebra",
    question: "Solve for y: 2y − 4 = 10",
    options: ["5", "6", "7", "8"], answer: "7",
    explanation: "2y = 10 + 4 = 14. y = 14 ÷ 2 = 7." },

  { id: 21, category: "math_logic", type: "algebra",
    question: "If x = 3 and y = 4, what is the value of 2x² + y?",
    options: ["22", "26", "30", "18"], answer: "22",
    explanation: "2(3²) + 4 = 2(9) + 4 = 18 + 4 = 22." },

  { id: 22, category: "math_logic", type: "algebra",
    question: "If a = 5 and b = 2, what is (a + b)(a − b)?",
    options: ["21", "25", "14", "10"], answer: "21",
    explanation: "(5 + 2)(5 − 2) = 7 × 3 = 21." },

  { id: 23, category: "math_logic", type: "algebra",
    question: "What is the value of x if 5x − 3 = 2x + 12?",
    options: ["3", "4", "5", "6"], answer: "5",
    explanation: "5x − 2x = 12 + 3 → 3x = 15 → x = 5." },

  // Logical deduction
  { id: 24, category: "math_logic", type: "logical_deduction",
    question: "All mammals are warm-blooded. Whales are mammals. Which conclusion MUST be true?",
    options: [
      "All warm-blooded animals are mammals.",
      "Whales are warm-blooded.",
      "Whales live in the ocean.",
      "Warm-blooded animals are whales."
    ], answer: "Whales are warm-blooded.",
    explanation: "Direct syllogism: All mammals → warm-blooded. Whales → mammals. Therefore whales → warm-blooded." },

  { id: 25, category: "math_logic", type: "logical_deduction",
    question: "No reptiles are mammals. A snake is a reptile. Which conclusion MUST be true?",
    options: [
      "All snakes are dangerous.",
      "A snake is not a mammal.",
      "Some mammals are reptiles.",
      "A snake has no legs."
    ], answer: "A snake is not a mammal.",
    explanation: "No reptiles are mammals → snake (reptile) is not a mammal." },

  { id: 26, category: "math_logic", type: "logical_deduction",
    question: "If it rains, the ground gets wet. The ground is wet. Which conclusion is CORRECT?",
    options: [
      "It definitely rained.",
      "It did not rain.",
      "The ground might be wet for other reasons besides rain.",
      "The ground cannot be wet without rain."
    ], answer: "The ground might be wet for other reasons besides rain.",
    explanation: "This is a logical fallacy (affirming the consequent). Wet ground doesn't guarantee it rained." },

  { id: 27, category: "math_logic", type: "logical_deduction",
    question: "Some engineers are managers. All managers earn high salaries. Which conclusion MUST be true?",
    options: [
      "All engineers earn high salaries.",
      "Some engineers earn high salaries.",
      "No engineers earn high salaries.",
      "All high earners are managers."
    ], answer: "Some engineers earn high salaries.",
    explanation: "Some engineers are managers, and all managers earn high salaries → some engineers earn high salaries." },

  { id: 28, category: "math_logic", type: "logical_deduction",
    question: "Every Friday, Anna goes to the gym. Today is Friday. What can you conclude?",
    options: [
      "Anna went to the gym yesterday.",
      "Anna will go to the gym today.",
      "Anna only goes to the gym on Fridays.",
      "Anna has been to the gym before."
    ], answer: "Anna will go to the gym today.",
    explanation: "The rule states every Friday she goes; today is Friday, so she goes today." },

  // ─── VERBAL REASONING ───────────────────────────────────────────────────────

  // Analogies
  { id: 29, category: "verbal", type: "analogy",
    question: "BOOK is to LIBRARY as painting is to ___",
    options: ["Artist", "Canvas", "Museum", "Frame"], answer: "Museum",
    explanation: "A book is stored/displayed in a library; a painting is stored/displayed in a museum." },

  { id: 30, category: "verbal", type: "analogy",
    question: "DOCTOR is to HOSPITAL as teacher is to ___",
    options: ["Student", "School", "Book", "Lesson"], answer: "School",
    explanation: "A doctor works in a hospital; a teacher works in a school." },

  { id: 31, category: "verbal", type: "analogy",
    question: "FIRE is to HOT as ice is to ___",
    options: ["Water", "Frozen", "Cold", "Solid"], answer: "Cold",
    explanation: "Fire is characterized by being hot; ice is characterized by being cold." },

  { id: 32, category: "verbal", type: "analogy",
    question: "SWORD is to WARRIOR as pen is to ___",
    options: ["Ink", "Paper", "Writer", "Book"], answer: "Writer",
    explanation: "A sword is the tool of a warrior; a pen is the tool of a writer." },

  { id: 33, category: "verbal", type: "analogy",
    question: "CHAPTER is to BOOK as scene is to ___",
    options: ["Actor", "Stage", "Play", "Director"], answer: "Play",
    explanation: "A chapter is a part of a book; a scene is a part of a play." },

  { id: 34, category: "verbal", type: "analogy",
    question: "ARCHITECT is to BLUEPRINT as composer is to ___",
    options: ["Orchestra", "Piano", "Score", "Concert"], answer: "Score",
    explanation: "An architect creates a blueprint; a composer creates a musical score." },

  { id: 35, category: "verbal", type: "analogy",
    question: "MARATHON is to RUNNING as regatta is to ___",
    options: ["Swimming", "Sailing", "Rowing", "Diving"], answer: "Sailing",
    explanation: "A marathon is a competitive running event; a regatta is a competitive sailing event." },

  { id: 36, category: "verbal", type: "analogy",
    question: "MICROSCOPE is to BIOLOGIST as telescope is to ___",
    options: ["Astronomer", "Physicist", "Chemist", "Geologist"], answer: "Astronomer",
    explanation: "A microscope is the key tool for a biologist; a telescope is the key tool for an astronomer." },

  // Antonyms
  { id: 37, category: "verbal", type: "antonym",
    question: "What is the OPPOSITE of BENEVOLENT?",
    options: ["Kind", "Malevolent", "Generous", "Peaceful"], answer: "Malevolent",
    explanation: "Benevolent means well-meaning and kind; malevolent means having evil intentions." },

  { id: 38, category: "verbal", type: "antonym",
    question: "What is the OPPOSITE of VERBOSE?",
    options: ["Wordy", "Talkative", "Concise", "Eloquent"], answer: "Concise",
    explanation: "Verbose means using more words than needed; concise means brief and to the point." },

  { id: 39, category: "verbal", type: "antonym",
    question: "What is the OPPOSITE of EPHEMERAL?",
    options: ["Short-lived", "Temporary", "Permanent", "Fleeting"], answer: "Permanent",
    explanation: "Ephemeral means lasting a very short time; permanent means lasting indefinitely." },

  { id: 40, category: "verbal", type: "antonym",
    question: "What is the OPPOSITE of FRUGAL?",
    options: ["Thrifty", "Extravagant", "Careful", "Modest"], answer: "Extravagant",
    explanation: "Frugal means sparing with money; extravagant means spending excessively." },

  { id: 41, category: "verbal", type: "antonym",
    question: "What is the OPPOSITE of LUCID?",
    options: ["Clear", "Bright", "Confused", "Transparent"], answer: "Confused",
    explanation: "Lucid means clear and easy to understand; confused means unclear or muddled." },

  { id: 42, category: "verbal", type: "antonym",
    question: "What is the OPPOSITE of DILIGENT?",
    options: ["Hardworking", "Lazy", "Focused", "Careful"], answer: "Lazy",
    explanation: "Diligent means showing steady effort; lazy means unwilling to work." },

  // Sentence completion
  { id: 43, category: "verbal", type: "sentence_completion",
    question: "Despite the difficult conditions, the team remained ___ and completed the project on time.",
    options: ["apathetic", "resilient", "hesitant", "incompetent"], answer: "resilient",
    explanation: "Resilient (able to recover quickly) fits the contrast set up by 'despite difficult conditions.'" },

  { id: 44, category: "verbal", type: "sentence_completion",
    question: "The scientist's ___ research led to a breakthrough that changed the entire field.",
    options: ["careless", "superficial", "meticulous", "random"], answer: "meticulous",
    explanation: "Meticulous (showing great attention to detail) best explains why the research led to a breakthrough." },

  { id: 45, category: "verbal", type: "sentence_completion",
    question: "The CEO's decision was ___, as it benefited both the company and its employees.",
    options: ["reckless", "judicious", "impulsive", "arbitrary"], answer: "judicious",
    explanation: "Judicious means having good judgment; a decision that benefits everyone shows good judgment." },

  { id: 46, category: "verbal", type: "sentence_completion",
    question: "The new law was ___ by critics who argued it violated civil liberties.",
    options: ["praised", "endorsed", "applauded", "condemned"], answer: "condemned",
    explanation: "Critics who argue against something condemn it." },

  // Syllogisms
  { id: 47, category: "verbal", type: "syllogism",
    question: "All birds have wings. Penguins are birds. Therefore:",
    options: [
      "Penguins can fly.",
      "Penguins have wings.",
      "All winged animals are birds.",
      "Penguins are not birds."
    ], answer: "Penguins have wings.",
    explanation: "All birds have wings + penguins are birds = penguins have wings. (Note: having wings doesn't imply flying.)" },

  { id: 48, category: "verbal", type: "syllogism",
    question: "All squares are rectangles. All rectangles have four sides. Therefore:",
    options: [
      "All rectangles are squares.",
      "Some four-sided shapes are not rectangles.",
      "All squares have four sides.",
      "Squares have more than four sides."
    ], answer: "All squares have four sides.",
    explanation: "Squares → rectangles → four sides. Therefore squares have four sides." },

  { id: 49, category: "verbal", type: "syllogism",
    question: "No fish are mammals. Dolphins are mammals. Therefore:",
    options: [
      "Dolphins are fish.",
      "Dolphins are not fish.",
      "Some fish are mammals.",
      "Dolphins live on land."
    ], answer: "Dolphins are not fish.",
    explanation: "No fish are mammals; dolphins are mammals → dolphins cannot be fish." },

  { id: 50, category: "verbal", type: "syllogism",
    question: "Some athletes are vegetarians. All vegetarians avoid meat. Therefore:",
    options: [
      "All athletes avoid meat.",
      "No athletes eat meat.",
      "Some athletes avoid meat.",
      "Vegetarians are all athletes."
    ], answer: "Some athletes avoid meat.",
    explanation: "Some athletes are vegetarians, and all vegetarians avoid meat → some athletes avoid meat." },

  { id: 51, category: "verbal", type: "syllogism",
    question: "All politicians give speeches. No shy people give speeches. Therefore:",
    options: [
      "Some politicians are shy.",
      "No politicians are shy.",
      "All shy people are politicians.",
      "Some speeches are given by shy people."
    ], answer: "No politicians are shy.",
    explanation: "Politicians give speeches, shy people don't → no overlap between politicians and shy people." },

  // ─── SPATIAL REASONING ──────────────────────────────────────────────────────
  // Spatial questions use SVG-based visual patterns rendered by the SpatialQuestion component.
  // The 'visual' field describes the pattern structure; rendering logic is in SpatialQuestion.jsx.

  { id: 52, category: "spatial", type: "matrix",
    question: "Which shape completes the 3×3 matrix? Each row contains a circle, triangle, and square. The top row has circle→triangle→square. The middle row has triangle→square→circle.",
    visual: { type: "matrix_shape_rotation", rows: 3, cols: 3,
      grid: ["circle","triangle","square","triangle","square","circle","square","circle","?"],
      options: ["triangle","circle","square","diamond"] },
    options: ["Triangle", "Circle", "Square", "Diamond"], answer: "Triangle",
    explanation: "Each row contains each shape exactly once. The bottom row has square and circle, so the missing shape is triangle." },

  { id: 53, category: "spatial", type: "matrix",
    question: "In the matrix, each row has shapes that increase in size: small→medium→large. Each column has shapes that rotate 45°. What completes the bottom-right cell?",
    visual: { type: "size_rotation_matrix", pattern: "increasing_size_rotating" },
    options: ["Large rotated square", "Small circle", "Medium triangle", "Large circle"], answer: "Large rotated square",
    explanation: "Following the size (large) and rotation pattern of the column." },

  { id: 54, category: "spatial", type: "odd_one_out",
    question: "Four of these five shapes share a common property. Which is the ODD ONE OUT?",
    visual: { type: "odd_one_out", shapes: [
      { sides: 3, filled: true },
      { sides: 4, filled: true },
      { sides: 5, filled: true },
      { sides: 6, filled: true },
      { sides: 4, filled: false }
    ]},
    options: ["Shape A (triangle, filled)", "Shape B (square, filled)", "Shape C (pentagon, filled)", "Shape D (hexagon, filled)", "Shape E (square, unfilled)"],
    answer: "Shape E (square, unfilled)",
    explanation: "Shapes A–D are all filled. Shape E is the only unfilled shape." },

  { id: 55, category: "spatial", type: "odd_one_out",
    question: "Which figure does NOT belong with the others?",
    visual: { type: "odd_one_out_rotation", shapes: ["arrow_up","arrow_right","arrow_down","arrow_left","double_arrow"] },
    options: ["Arrow Up", "Arrow Right", "Arrow Down", "Arrow Left", "Double Arrow"], answer: "Double Arrow",
    explanation: "All other shapes are single directional arrows. The double arrow is different in structure." },

  { id: 56, category: "spatial", type: "pattern_series",
    question: "A square rotates 45° clockwise with each step. If it starts as a square (flat), what does it look like after 3 steps?",
    visual: { type: "rotation_series", shape: "square", step_degrees: 45, steps: 4 },
    options: ["Rotated 135° (diamond-like)", "Flat square", "Rotated 90°", "Rotated 180°"], answer: "Rotated 135° (diamond-like)",
    explanation: "3 steps × 45° = 135° rotation from the original position." },

  { id: 57, category: "spatial", type: "pattern_series",
    question: "Each step adds one dot inside the shape. The first shape has 1 dot, the second has 2 dots, the third has 3 dots. How many dots does the 5th shape have?",
    visual: { type: "dot_series", start: 1, increment: 1, show_steps: 4 },
    options: ["4", "5", "6", "7"], answer: "5",
    explanation: "The pattern adds 1 dot per step. The 5th shape has 5 dots." },

  { id: 58, category: "spatial", type: "matrix",
    question: "Each row of the matrix follows this rule: the third shape is the result of overlapping the first two shapes. Row 1: △ + □ = △□. Row 2: ○ + △ = ○△. What is Row 3: □ + ○ = ?",
    visual: { type: "overlay_matrix", rows: [["triangle","square","triangle_square"],["circle","triangle","circle_triangle"],["square","circle","?"]] },
    options: ["Square only", "Square and Circle overlapping", "Circle only", "Triangle and Square overlapping"],
    answer: "Square and Circle overlapping",
    explanation: "The pattern overlays the first two shapes into the third cell." },

  { id: 59, category: "spatial", type: "odd_one_out",
    question: "Which of the following groups of shapes does NOT follow the same symmetry rule as the others?",
    visual: { type: "symmetry_odd_one_out" },
    options: [
      "A vertically symmetric shape",
      "A horizontally symmetric shape",
      "A rotationally symmetric shape",
      "An asymmetric shape"
    ], answer: "An asymmetric shape",
    explanation: "All other shapes have at least one axis of symmetry. The asymmetric shape has none." },

  { id: 60, category: "spatial", type: "pattern_series",
    question: "A triangle starts pointing UP. Each step it flips horizontally. What direction does it point after 4 steps?",
    visual: { type: "flip_series", shape: "triangle", direction: "horizontal", start: "up", steps: 4 },
    options: ["Up", "Down", "Left", "Right"], answer: "Up",
    explanation: "Flipping horizontally alternates direction. After an even number of flips (4), it returns to UP." },

  // Additional math questions for variety
  { id: 61, category: "math_logic", type: "number_sequence",
    question: "What number comes next?\n4, 9, 16, 25, 36, ___",
    options: ["42", "47", "49", "45"], answer: "49",
    explanation: "These are perfect squares: 2², 3², 4², 5², 6², 7² = 49." },

  { id: 62, category: "math_logic", type: "word_problem",
    question: "A recipe requires 2.5 cups of flour for 12 cookies. How many cups are needed for 30 cookies?",
    options: ["5.5", "6", "6.25", "7"], answer: "6.25",
    explanation: "Ratio: 2.5/12 × 30 = 6.25 cups." },

  { id: 63, category: "math_logic", type: "logical_deduction",
    question: "If today is Wednesday and a meeting happens every 5 days starting today, what day is the next meeting after today?",
    options: ["Monday", "Sunday", "Tuesday", "Saturday"], answer: "Monday",
    explanation: "Wednesday + 5 days = Monday." },

  { id: 64, category: "verbal", type: "analogy",
    question: "WATER is to THIRST as food is to ___",
    options: ["Hunger", "Taste", "Cooking", "Diet"], answer: "Hunger",
    explanation: "Water satisfies thirst; food satisfies hunger." },

  { id: 65, category: "verbal", type: "antonym",
    question: "What is the OPPOSITE of MELANCHOLY?",
    options: ["Sad", "Gloomy", "Joyful", "Pensive"], answer: "Joyful",
    explanation: "Melancholy means deep sadness; joyful means feeling great happiness." },
];

export const CATEGORY_INFO = {
  math_logic: {
    label: "Math & Logic",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    total: 18,
    subtypes: {
      number_sequence: "Number Sequences",
      word_problem: "Word Problems",
      algebra: "Algebra",
      logical_deduction: "Logical Deduction",
    }
  },
  verbal: {
    label: "Verbal Reasoning",
    color: "#10B981",
    bgColor: "#ECFDF5",
    total: 18,
    subtypes: {
      analogy: "Analogies",
      antonym: "Antonyms",
      sentence_completion: "Sentence Completion",
      syllogism: "Syllogisms",
    }
  },
  spatial: {
    label: "Spatial Reasoning",
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    total: 14,
    subtypes: {
      matrix: "Matrices",
      odd_one_out: "Odd One Out",
      pattern_series: "Pattern Series",
    }
  }
};
