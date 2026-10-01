export type TransmissionEditorial = {
  updatedOn: string;
  nowBuilding: {
    headline: string;
    supportingText: string;
    destination: string;
  };
  nextExperiment: {
    headline: string;
    supportingText: string;
  };
};

/** Editable launch drafts; update the date when revising the manual signals. */
export const currentTransmission: TransmissionEditorial = {
  updatedOn: "2026-09-30",
  nowBuilding: {
    headline: "BIRDSVIEW",
    supportingText: "Explore a 3D globe, bird's-eye views, and surprising geography facts.",
    destination: "https://github.com/msmele345/birdsview",
  },
  nextExperiment: {
    headline: "PIRATE WORLD",
    supportingText: "Exploring a 3D pirate adventure for players of all ages.",
  },
};
