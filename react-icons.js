module.exports = (name) => {
  const prefix = "@react-icons/all-files";
  const iconsPrefix = {
    ai: "Ai",
    bi: "Bi",
    bs: "Bs",
    cg: "Cg",
    di: "Di",
    fa: "Fa",
    fc: "Fc",
    fi: "Fi",
    gi: "Gi",
    go: "Go",
    gr: "Gr",
    hi: "Hi",
    im: "Im",
    io: "IoIos",
    io5: "Io",
    md: "Md",
    ri: "Ri",
    si: "Si",
    ti: "Ti",
    vsc: "Vsc",
    wi: "Wi",
  };
  for (let dir in iconsPrefix) {
    if (name.indexOf(iconsPrefix[dir]) === 0) {
      return prefix + `/${dir}/` + name + ".js";
    }
  }
  return prefix;
};
