import { Mail, Phone } from 'lucide-react';

export default function About() {
  return (
    <div className="h-[85vh] flex items-center justify-center bg-black text-white px-4 py-12">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
        {/* Logo + Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          About FormiStiq
        </h1>

        {/* Branding Description */}
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          <span className="text-white font-semibold">FormiStiq</span> is a modern form-building platform designed for performance, simplicity, and elegance. Whether you’re collecting feedback or managing internal workflows, FormiStiq delivers a seamless experience with clean UI and smooth interactions.
        </p>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Built for creators, startups, and professionals — FormiStiq makes form creation feel effortless, intelligent, and beautiful.
        </p>

        <hr className="border-white/10" />

        {/* Developer Info */}
        <div className="space-y-2 text-left sm:text-center">
          <p className="text-sm sm:text-base text-white font-medium">
            👨‍💻 Developed by <span className="text-blue-400">Nidhish Rathore</span>
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
            <Mail className="w-4 h-4" />
            <a href="mailto:codenidhish07@gmail.com" className="hover:underline text-blue-400">
              codenidhish07@gmail.com
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
            <Phone className="w-4 h-4" />
            <a href="tel:8708295706" className="hover:underline text-blue-400">
              +91 87082 95706
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex justify-center gap-6">
         <a
  href="https://github.com/Nidhish-Dev"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub"
>
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
    alt="GitHub"
    className="w-6 h-6 invert"
  />
</a>


          <a
            href="https://www.linkedin.com/in/nidhish-rathore-b2b9bb325/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn"
              className="w-6 h-6"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
