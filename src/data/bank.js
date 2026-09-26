// Loads the JSON question bank. To add questions, edit the files in ./questions
// and run `npm run validate`.
import categories from "./questions/categories.json";
import mathLogic from "./questions/math_logic.json";
import verbal from "./questions/verbal.json";
import spatial from "./questions/spatial.json";

export const CATEGORIES = {
  math_logic: { ...categories.math_logic, color: "#3B82F6", bgColor: "#EFF6FF" },
  verbal: { ...categories.verbal, color: "#10B981", bgColor: "#ECFDF5" },
  spatial: { ...categories.spatial, color: "#8B5CF6", bgColor: "#F5F3FF" },
};

const files = { math_logic: mathLogic, verbal, spatial };

export const QUESTIONS = Object.entries(files).flatMap(([category, list]) =>
  list.map((q) => ({ ...q, category }))
);

export const QUESTIONS_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

export function typeLabel(category, type) {
  return CATEGORIES[category]?.types[type] ?? type;
}

export const ALL_TYPES = Object.entries(CATEGORIES).flatMap(([category, info]) =>
  Object.keys(info.types).map((type) => ({ category, type, label: info.types[type] }))
);
