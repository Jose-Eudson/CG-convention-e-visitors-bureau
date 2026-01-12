import eventoImg from '../assets/campina_cvb.jpg'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center bg-gray-100 py-12 md:py-0">
      {/* Background Image com overlay discreto */}
      <div className="absolute inset-0">
        <img
          src={eventoImg}
          alt="Campina Grande"
          className="h-full w-full object-cover"
        />
        {/* Overlay suave para escurecer o fundo e suavizar cores */}
        <div className="absolute inset-0 bg-gray-900/40"></div>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:items-center md:gap-12 md:px-6">
        <div className="space-y-6 text-white drop-shadow-lg">
          {/* Badge / Categoria */}
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
            Turismo • Cultura • Experiências
          </span>

          {/* Título */}
          <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Descubra Campina Grande <br className="hidden md:block" />
            além do São João
          </h1>

          {/* Subtítulo / descrição */}
          <p className="text-lg md:text-xl text-white/80">
            Explore pontos turísticos, cultura, lazer e experiências únicas da
            Rainha da Borborema.
          </p>

          {/* Botão */}
          <Link
            to="/conheca"
            className="inline-block rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-white/20 hover:shadow-xl hover:scale-105"
          >
            Conheça Campina Grande
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero