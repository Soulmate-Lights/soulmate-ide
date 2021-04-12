export const canStream = (soulmate) => {
  return parseInt(soulmate.config?.version) >= 8 && soulmate.type !== "usb";
};

export const isLoaded = (soulmate) => {
  return !!soulmate.config;
};
