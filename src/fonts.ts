import { Chakra_Petch } from "next/font/google";

// Display face for groovebox-identity surfaces (elevated-bpm tile + case study).
export const grooveDisplay = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-groove",
});

/**
 * Single resolver from a content file's `tile.displayFace` to its
 * next/font CSS-variable class. The one place the display-face string
 * is interpreted — surfaces never compare the string themselves.
 */
export function displayFaceClass(displayFace?: string): string | undefined {
  return displayFace === "Chakra Petch" ? grooveDisplay.variable : undefined;
}
