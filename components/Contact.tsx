import Reveal from './Reveal';
import SectionVideo from './SectionVideo';

const YEAR = new Date().getFullYear();

// Constitution 5.6: light trails converging into a single bright point,
// short CTA + links.
const LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/muhammad-hamza-1461432a5',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/MuhammadHamza524727',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hmzarj77',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative min-h-screen w-full overflow-hidden">
      <SectionVideo src="/videos/contact.mp4" poster="/posters/contact.jpg" />
      <Reveal className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow">Contact</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white md:text-6xl">
          Let&apos;s build something.
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-white/75">
          Open to client work and collaborations. Reach me on any of these.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#3af58c]/50 px-6 py-3 text-sm font-medium text-[#3af58c] transition-colors hover:bg-[#3af58c]/10"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
        <p className="mt-16 text-sm text-white/40">
          © {YEAR} Muhammad Hamza
        </p>
      </Reveal>
    </section>
  );
}
