import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/5583999219453", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50
               w-14 h-14 md:w-16 md:h-16 
               bg-gradient-to-br from-green-400 to-green-600
               rounded-full 
               flex items-center justify-center 
               shadow-lg hover:shadow-2xl
               hover:from-green-500 hover:to-green-700
               transition-all duration-300
               hover:scale-110 active:scale-95
               focus:outline-none focus:ring-4 focus:ring-green-300
               group
               animate-bounce-slow"
      aria-label="Fale conosco no WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
      
      <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-75 group-hover:animate-ping"></span>
    </button>
  );
};

export default WhatsAppButton;
