export default () => {
  return !!navigator.userAgent.toLowerCase().includes("soulmate");
};

export const isPackaged = () => {
  return remote?.process.mainModule.filename.indexOf(".asar") !== -1;
};
