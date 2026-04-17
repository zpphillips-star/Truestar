import { colors } from "./brand";

export const CATEGORIES = [
  { id: "food",     label: "Food Quality",  emoji: "🍽️", color: colors.red,    desc: "Taste, cooking, ingredients" },
  { id: "price",    label: "Price & Value", emoji: "💰", color: colors.forest, desc: "Worth the money, portions" },
  { id: "service",  label: "Service",       emoji: "🤝", color: "#1a4a8a",     desc: "Staff, attentiveness" },
  { id: "ambiance", label: "Ambiance",      emoji: "✨", color: colors.plum,   desc: "Vibe, decor, atmosphere" },
];

export const DEFAULT_WEIGHTS = { food: 70, price: 30, service: 0, ambiance: 0 };
