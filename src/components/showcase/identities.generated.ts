// Generated from src/components/showcase/identities/ by `npm run registration`; do not edit.
import type { ShowcasePresentation } from "./registration";
import ElevatedBpmArtwork from "./identities/elevated-bpm/Artwork";
import ElevatedBpmTile from "./identities/elevated-bpm/Tile";
import SoundCityArtwork from "./identities/sound-city/Artwork";
import SoundCityTile from "./identities/sound-city/Tile";
import TelescopeArtwork from "./identities/telescope/Artwork";
import TelescopeTile from "./identities/telescope/Tile";
import TerminalOneArtwork from "./identities/terminal-one/Artwork";
import TerminalOneTile from "./identities/terminal-one/Tile";

export const identities: readonly ShowcasePresentation[] = [
  { slug: "elevated-bpm", Tile: ElevatedBpmTile, CaseStudyArtwork: ElevatedBpmArtwork },
  { slug: "sound-city", Tile: SoundCityTile, CaseStudyArtwork: SoundCityArtwork },
  { slug: "telescope", Tile: TelescopeTile, CaseStudyArtwork: TelescopeArtwork },
  { slug: "terminal-one", Tile: TerminalOneTile, CaseStudyArtwork: TerminalOneArtwork },
];
