import GrooveboxTile from "@/components/tiles/GrooveboxTile";
import TerminalTile from "@/components/tiles/TerminalTile";
import TelescopeTile from "@/components/tiles/TelescopeTile";
import SoundCityTile from "@/components/tiles/SoundCityTile";
import { GrooveboxArtwork, TerminalArtwork, TelescopeArtwork, SoundCityArtwork } from "./artwork";
import { createShowcaseRegistry } from "./registration";

/** Add each bespoke identity here; the shared shells do not dispatch by slug. */
export const showcase = createShowcaseRegistry([
  { slug: "elevated-bpm", Tile: GrooveboxTile, CaseStudyArtwork: GrooveboxArtwork },
  { slug: "terminal-one", Tile: TerminalTile, CaseStudyArtwork: TerminalArtwork },
  { slug: "telescope", Tile: TelescopeTile, CaseStudyArtwork: TelescopeArtwork },
  { slug: "sound-city", Tile: SoundCityTile, CaseStudyArtwork: SoundCityArtwork },
]);
