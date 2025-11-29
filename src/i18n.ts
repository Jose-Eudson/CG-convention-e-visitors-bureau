import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Configuração principal do i18next
i18n
  // Carrega arquivos JSON das pastas /locales
  .use(HttpApi)

  // Detecta idioma do navegador automaticamente
  .use(LanguageDetector)

  // Conecta com o React
  .use(initReactI18next)

  .init({
    fallbackLng: "pt", // idioma padrão
    debug: false,

    supportedLngs: ["pt", "en", "es"],

    backend: {
      // Onde ficam os arquivos de tradução
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false, // React já faz proteção contra XSS
    },
  });

export default i18n;
