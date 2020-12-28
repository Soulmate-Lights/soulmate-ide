import { createContainer } from "unstated-next";

const types = [
  {
    playlists: true,
    label: "Soulmate Square",
    value: "square",
    config: {
      button: 39,
      data: 32,
      clock: 26,
      rows: 14,
      cols: 14,
      milliamps: 4000,
      ledType: "APA102",
      serpentine: true,
    },
  },
  {
    playlists: true,
    label: "Soulmate Tapestry",
    value: "tapestry",
    config: {
      button: 39,
      data: 32,
      clock: 26,
      rows: 70,
      cols: 15,
      milliamps: 8000,
      ledType: "APA102",
      serpentine: true,
    },
  },
  {
    label: "Soulmate Mini",
    value: "mini",
    config: {
      rows: 5,
      cols: 5,
      button: 39,
      data: 27,
      clock: 26,
      milliamps: 100,
      chipType: "atom",
      ledType: "WS2812B",
      serpentine: false,
    },
  },
  {
    label: "Custom",
    value: "custom",
    config: {
      button: 39,
      data: 32,
      clock: 26,
    },
  },
];

const playlistTypes = types.filter((t) => t.playlists);

export default createContainer(() => {
  return {
    types,
    playlistTypes,
  };
});
