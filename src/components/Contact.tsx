import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation("contact");

  return (
    <section className="bg-neutral-800 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-3xl font-bold text-white">
          {t("title")}
        </h2>

        <div className="grid gap-12 md:grid-cols-2">
          {/* COLUNA 1 */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-emerald-400">
                {t("addressTitle")}
              </h3>
              <p className="text-neutral-300">
                Rua Exemplo, 123 - Centro<br />
                Campina Grande - PB, 58400-000
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-emerald-400">
                {t("socialTitle")}
              </h3>
              <a
                href="https://www.instagram.com/campinagrandecvb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-emerald-400"
              >
                @campinagrandecvb
              </a>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-emerald-400">
                {t("whatsappTitle")}
              </h3>
              <a
                href="https://wa.me/5583999219453"
                target="_blank"
                className="text-neutral-300 hover:text-emerald-400"
              >
                (83) 99921-9453
              </a>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form className="space-y-4" translate="no">
            <input
              type="text"
              placeholder={t("form.name")}
              className="w-full rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none"
            />

            <input
              type="email"
              placeholder={t("form.email")}
              className="w-full rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none"
            />

            <input
              type="text"
              placeholder={t("form.subject")}
              className="w-full rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none"
            />

            <textarea
              placeholder={t("form.message")}
              rows={5}
              className="w-full rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              {t("form.button")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
