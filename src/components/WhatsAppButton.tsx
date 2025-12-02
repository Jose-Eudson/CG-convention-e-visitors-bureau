import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "5583999219453";
  const message = "Olá! Gostaria de entrar em contato.";
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all z-50"
    >
      <FaWhatsapp size={30} />
    </a>
  );
};

export default WhatsAppButton;
