import Room3DWrapper from "@/components/Room3DWrapper";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import SceneComposer from "@/components/SceneComposer";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TemperatureToggle from "@/components/TemperatureToggle";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import DustMotes from "@/components/DustMotes";
import Preloader from "@/components/Preloader";
import EventInvite from "@/components/EventInvite";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Preloader />
      <Room3DWrapper />
      <DustMotes />

      <Navigation />
      <ScrollProgress />
      <TemperatureToggle />
      <Cursor />
      <EventInvite />

      <div className="relative z-10">
        <Hero />
        <Philosophy />
        <Services />
        <Projects />
        <Process />
        <SceneComposer />
        <Clients />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
