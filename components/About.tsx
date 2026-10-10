import Reveal from './Reveal';
import SectionVideo from './SectionVideo';

// Constitution 5.3: three transparent glass layers floating independently,
// each a different green shade ("full stack"), over about.mp4.
// GitHub analysis: MuhammadHamza524727 — 118 public repos, 15+ deployed.
// Skills pulled from actual repo languages and project categories.
const STACK_LAYERS = [
  {
    title: 'Frontend',
    items: 'Next.js · React · Tailwind CSS · Vanilla JS',
    glow: 'border-emerald-400/40 shadow-[0_0_40px_rgba(58,245,140,0.15)]',
  },
  {
    title: 'Backend',
    items: 'Node.js · Express · MongoDB (MERN) · JWT Auth',
    glow: 'border-green-400/40 shadow-[0_0_40px_rgba(74,222,128,0.13)]',
  },
  {
    title: 'Agentic AI',
    items: 'LLM tooling · RAG (Qdrant · Cohere) · CLI agents',
    glow: 'border-teal-300/40 shadow-[0_0_40px_rgba(45,212,191,0.15)]',
  },
];

export default function About() {
  return (
    <section id="about" className="relative min-h-screen w-full overflow-hidden">
      <SectionVideo src="/videos/about.mp4" poster="/posters/about.jpg" />
      <Reveal className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <p className="eyebrow">About / Skills</p>
        <h2 className="mt-4 max-w-3xl text-center text-4xl font-semibold text-white md:text-6xl">
          118 repos · 15+ deployed · one stack.
        </h2>
        <div className="mt-14 flex w-full max-w-5xl flex-col gap-6 md:flex-row md:gap-8">
          {STACK_LAYERS.map((layer) => (
            <div
              key={layer.title}
              className={`glass-layer flex-1 rounded-2xl border bg-white/5 p-8 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1.5 hover:backdrop-blur-lg md:p-10 ${layer.glow}`}
            >
              <h3 className="text-glow text-xl font-semibold text-[#3af58c]">
                {layer.title}
              </h3>
              <p className="mt-3 leading-relaxed text-white/80">{layer.items}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
