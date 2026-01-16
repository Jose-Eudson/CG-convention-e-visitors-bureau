
import { useEffect, useRef, useState } from "react";
import eventoImg from "../assets/campina_cvb3.jpeg";
import { Link } from "react-router-dom";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentY = useRef(0);
  const targetY = useRef(0);
  const [leaving, setLeaving] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      targetY.current = window.scrollY;
    };

    const animate = () => {
      if (!sectionRef.current) return;

      const heroHeight = sectionRef.current.offsetHeight;
      const scroll = Math.min(targetY.current, heroHeight);


      const progress = scroll / heroHeight;


      const easeOut = 1 - Math.pow(1 - progress, 3);

      currentY.current += (scroll - currentY.current) * 0.08;

      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${easeOut * 120}px)`;
      }

      if (overlayRef.current) {
        overlayRef.current.style.transform = `translateY(${easeOut * 60}px)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    animate();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setLeaving(!entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      data-header="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >

      <div
        ref={bgRef}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src={eventoImg}
          alt="Campina Grande"
          className="h-full w-full object-cover"
        />
      </div>


      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/60 to-black/45 will-change-transform"
      />


      <div
        ref={contentRef}
        className={`relative z-20 flex flex-col items-center text-center px-6 transition-all duration-700 ${
          leaving
            ? "opacity-0 scale-95 translate-y-12"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >

        <span className="mb-6 rounded-full bg-orange-500 px-5 py-1.5 text-sm font-semibold tracking-wide text-white shadow-lg animate-hero-up">
          Turismo • Cultura • Experiências
        </span>


        <h1 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] animate-hero-up delay-200">
          Descubra Campina Grande <br className="hidden md:block" />
          além do São João
        </h1>


        <p className="mb-10 max-w-2xl text-lg md:text-xl text-white/95 font-medium leading-relaxed drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)] animate-hero-up delay-400">
          Explore pontos turísticos, cultura, lazer e experiências únicas da
          Rainha da Borborema.
        </p>


        <Link
          to="/conheca"
          className="rounded-lg bg-emerald-600 px-8 py-4 font-semibold text-white transition-all duration-500 hover:bg-emerald-700 hover:scale-110 hover:shadow-2xl animate-hero-up delay-600 animate-pulse-soft"
        >
          Conheça Campina Grande
        </Link>
      </div>

      <style>
        {`
          @keyframes heroUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulseSoft {
            0% { transform: scale(1); }
            50% { transform: scale(1.04); }
            100% { transform: scale(1); }
          }

          .animate-hero-up {
            animation: heroUp 1.4s ease-out forwards;
          }

          .animate-pulse-soft {
            animation: pulseSoft 3.2s ease-in-out infinite;
          }

          .delay-200 { animation-delay: 0.2s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-600 { animation-delay: 0.6s; }
        `}
      </style>
    </section>
  );
};

export default Hero;
