import { Chakra_Petch } from "next/font/google";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import {
  getProject,
  listCaseStudySlugs,
} from "@/content/projects/catalog";

export const dynamicParams = false;

const grooveDisplay = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-case-display",
});

export async function generateStaticParams() {
  return listCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.pitch,
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const usesGrooveFace = project.tile?.displayFace === "Chakra Petch";

  return (
    <main id="main" tabIndex={-1}>
      <CaseStudy
        project={project}
        displayClassName={usesGrooveFace ? grooveDisplay.variable : undefined}
      />
    </main>
  );
}
