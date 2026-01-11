import { Link } from "react-router-dom";

const ConhecaCG = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-pink-600 py-16 md:py-28">
      
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="src/assets/campina_cvb.jpg"
          alt="Campina Grande"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-3xl">

          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold text-white">
            Turismo • Cultura • Experiências
          </span>

          <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
            Descubra Campina Grande <br className="hidden md:block" />
            além do São João
          </h2>

          <p className="mb-10 text-lg text-white/90 md:text-xl">
            Explore pontos turísticos, cultura, lazer e experiências únicas da
            Rainha da Borborema.
          </p>

          <Link
            to="/conheca"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-pink-600 transition hover:bg-gray-100"
          >
            Conheça Campina Grande
          </Link>

        </div>
      </div>
    </section>
  );
};

export default ConhecaCG;