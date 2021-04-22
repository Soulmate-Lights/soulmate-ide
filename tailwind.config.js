const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    enabled: false,
  },
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  variants: {
    animation: ["motion-safe"]
  },
  theme: {
    extend: {
      fontSize: {
        "2xs": ".6rem",
      },
      screens: {
        "light-mode": { raw: "(prefers-color-scheme: light)" },
        "dark-mode": { raw: "(prefers-color-scheme: dark)" },
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        fadeIn: "fadeIn 0.5s ease forwards"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, position: 'relative', top: 40 },
          "100%": { opacity: 1, position: 'relative', top: 0 }
        }
      },
      transitionDuration: {
        0: "0ms",
        2000: "2000ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/ui")({
      layout: "sidebar",
    }),
    require("@tailwindcss/forms"),
  ],
};
