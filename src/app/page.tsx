import ProjectWall from "@/components/ProjectWall";
import MoreProjectsRail from "@/components/MoreProjectsRail";
import SiteIntro from "@/components/SiteIntro";
import ContactSection from "@/components/ContactSection";
import CurrentTransmission from "@/components/CurrentTransmission";
import CrescendoProvider from "@/components/CrescendoProvider";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <CrescendoProvider>
        <SiteIntro />
        <ProjectWall />
      </CrescendoProvider>
      <CurrentTransmission />
      <MoreProjectsRail />
      <ContactSection />
    </main>
  );
}
