import { Chakra_Petch, DM_Sans, Libre_Caslon_Display } from "next/font/google";

// Display face for groovebox-identity surfaces (elevated-bpm tile + case study).
export const grooveDisplay = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-groove",
});

// Display + supporting faces for birdsview-identity surfaces (tile + case study).
export const birdsviewDisplay = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-birdsview-display",
});

export const birdsviewSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-birdsview-sans",
});

/**
 * Single resolver from a content file's `tile.displayFace` to its
 * next/font CSS-variable class. The one place the display-face string
 * is interpreted — surfaces never compare the string themselves.
 */
export function displayFaceClass(displayFace?: string): string | undefined {
  if (displayFace === "Chakra Petch") return grooveDisplay.variable;
  if (displayFace === "Libre Caslon Display") {
    return `${birdsviewDisplay.variable} ${birdsviewSans.variable}`;
  }
  return undefined;
}
