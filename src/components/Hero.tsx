import eventoImg from '../assets/campina_cvb.jpg'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const { t } = useTranslation('hero')
  const navigate = useNavigate()

  return (
    <section id="inicio" className="relative flex min-h-screen items-center bg-slate-50 py-12 md:py-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:items-center md:gap-12 md:px-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
            {t('title')}
          </h1>

          <p className="text-lg text-slate-600">
            {t('subtitle')}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="w-full rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600 sm:w-auto">
              {t('buttons.event')}
            </button>

            <button
              onClick={() => navigate('/proposta')}
              className="w-full rounded-lg border-2 border-orange-500 px-6 py-3 font-semibold text-orange-500 transition-colors hover:bg-orange-500 hover:text-white sm:w-auto"
            >
              {t('buttons.associate')}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={eventoImg}
            alt={t('imageAlt')}
            className="h-auto w-full rounded-xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
