import Hero from "@/components/Hero";
import Story from "@/components/Story";
import SectionNav from "@/components/SectionNav";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Agentic from "@/components/Agentic";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <SectionNav />
      <main>
        <Hero />
        <Story />
        <About />
        <Projects />
        <Agentic />
        <Contact />
      </main>
    </>
  );
}
