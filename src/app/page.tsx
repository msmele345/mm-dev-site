import ProjectWall from "@/components/ProjectWall";
import MoreProjectsRail from "@/components/MoreProjectsRail";
import HeroHeader from "@/components/HeroHeader";
import ContactSection from "@/components/ContactSection";
import CurrentTransmission from "@/components/CurrentTransmission";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <HeroHeader />
      <ProjectWall />
      <CurrentTransmission />
      <MoreProjectsRail />
      <ContactSection />
    </main>
  );
}
