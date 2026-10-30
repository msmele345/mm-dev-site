import ProjectWall from "@/components/ProjectWall";
import MoreProjectsRail from "@/components/MoreProjectsRail";
import SiteIntro from "@/components/SiteIntro";
import ContactSection from "@/components/ContactSection";
import CurrentTransmission from "@/components/CurrentTransmission";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <SiteIntro />
      <ProjectWall />
      <CurrentTransmission />
      <MoreProjectsRail />
      <ContactSection />
    </main>
  );
}
