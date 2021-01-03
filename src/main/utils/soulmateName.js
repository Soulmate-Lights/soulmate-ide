import { emojify } from "@twuni/emojify";

const soulmateName = (soulmate) => {
  if (soulmate.config?.name) return emojify(soulmate.config?.name);
  return "New Soulmate";
};

export default soulmateName;
