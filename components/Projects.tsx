import Image from 'next/image';
import Reveal from './Reveal';

// Projects from MuhammadHamza524727's GitHub repos.
// Background images are web-shot screenshots (scripts/web-shot → public/web-shot).
const PROJECTS = [
  {
    name: 'AURELLE — Jewellery Website',
    description:
      'Elegant jewellery storefront with a full product showcase, built as a client-style landing experience.',
    tech: 'JavaScript · Responsive UI',
    liveUrl: 'https://jewellery-website-gamma-swart.vercel.app',
    githubUrl: 'https://github.com/MuhammadHamza524727/-Jewellery-Website',
    image: '/web-shot/AURELLE-Jewellry-website.png',
    motif: 'E-commerce',
  },
  {
    name: 'Haau React App',
    description:
      'React-based app built as a frontend project showcasing component patterns and UI work.',
    tech: 'React · JavaScript',
    liveUrl: 'https://haau-react-app.vercel.app/',
    githubUrl: 'https://github.com/MuhammadHamza524727/Haau_React_App',
    image: '/web-shot/HAAU.png',
    motif: 'React App',
  },
  {
    name: 'Physical AI — Textbook RAG',
    description:
      'AI-native textbook site with a RAG assistant over its chapters — Qdrant vector store, Cohere, sourced answers.',
    tech: 'RAG · Qdrant · Cohere · Next.js',
    liveUrl: 'https://speckitplus-hackhathon.vercel.app',
    githubUrl: 'https://github.com/MuhammadHamza524727/Physical_AI_Humanoid_Robotics_Textbook_RAG',
    image: '/web-shot/Physical AI & Humanoid Robotics.png',
    motif: 'Agent / RAG',
  },
  {
    name: 'Petrol Subsidy Demo',
    description:
      'AI-powered demo app showcasing generative AI inside a civic-data flow. TypeScript end to end.',
    tech: 'TypeScript · Next.js · AI APIs',
    liveUrl: 'https://petrol-subsidy-demo-app.vercel.app',
    githubUrl: 'https://github.com/MuhammadHamza524727/Petrol-Subsidy-Demo-App',
    image: '/web-shot/PM-Petrol.png',
    motif: 'AI demo',
  },
  {
    name: 'PICNIC-IQ',
    description:
      'Web app deployed on Vercel — visit the live link to see the project in action.',
    tech: 'Web · Vercel',
    liveUrl: 'https://picniciq-web.vercel.app/',
    githubUrl: 'https://github.com/MuhammadHamza524727/Picnic-web',
    image: '/web-shot/PICNIC-IQ.png',
    motif: 'Web App',
  },
  {
    name: 'TODO — CLI App (Phase 4)',
    description:
      'CLI-based todo application, final phase of the todo app series with full feature support.',
    tech: 'CLI · TypeScript',
    liveUrl: 'https://phase-4-todo-cli-app.vercel.app',
    githubUrl: 'https://github.com/MuhammadHamza524727/phase-4-todo-cli-app',
    image: '/web-shot/TODO-WITH-AI.png',
    motif: 'CLI Tool',
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative min-h-screen w-full overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <p className="eyebrow">Projects</p>
        <h2 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Real repos, real links.
        </h2>

        <div className="mt-12 flex flex-col gap-8">
          {PROJECTS.map((project) => (
            <Reveal key={project.name}>
              <article className="relative min-h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.01]">
                {/* The project's own front page, blurred + dimmed behind
                    the copy — the same "page thumbnail" feel as pasting
                    the link into a chat app. */}
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="scale-110 object-cover opacity-80 blur-[3px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/70 to-[#0a0e17]/30" />

                <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-8 md:p-12">
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
                    {project.motif}
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
                    {project.name}
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-white/80">
                    {project.description}
                  </p>
                  <p className="text-glow mt-4 text-sm text-[#3af58c]">
                    {project.tech}
                  </p>
                  <div className="mt-6 flex gap-4">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#3af58c]/50 px-5 py-2 text-sm text-[#3af58c] transition-colors hover:bg-[#3af58c]/10"
                    >
                      Live site →
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/25 px-5 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
