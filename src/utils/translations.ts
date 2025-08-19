import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    translation: {
      loginTitle: "CRM Simplificado",
      loginSubtitle: "Faça login para continuar",
      email: "Email",
      password: "Senha",
      enter: "Entrar",
      fillAllFields: "Por favor, preencha todos os campos.",
      invalidEmail: "Email inválido.",
      loginError: "Erro ao logar.",
    },
  },
  en: {
    translation: {
      loginTitle: "Simplified CRM",
      loginSubtitle: "Login to continue",
      email: "Email",
      password: "Password",
      enter: "Login",
      fillAllFields: "Please fill in all fields.",
      invalidEmail: "Invalid email.",
      loginError: "Error logging in.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
});

export default i18n;
