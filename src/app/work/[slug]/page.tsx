import { notFound } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import {
  getEnrichedProject,
  getProject,
  listCaseStudySlugs,
} from "@/content/projects/catalog";
import { displayFaceClass } from "@/fonts";

export const dynamicParams = false;

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
  const project = await getEnrichedProject(slug);
  if (!project) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <CaseStudy
        project={project}
        displayClassName={displayFaceClass(project.tile?.displayFace)}
      />
    </main>
  );
}
