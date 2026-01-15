import Hero from "../components/Hero";
import Institutional from "../components/Institutional";
import Events from "../components/Events";
import Associates from "../components/Associates";
import Board from "../components/Board";
import WhatsAppButton from "../components/WhatsAppButton";
// IMPORTS FUTUROS (comentados até criar os componentes):
// import SecondaryEvents from "../components/SecondaryEvents";
// import GovernmentPartnerships from "../components/GovernmentPartnerships";
// import Contact from "../components/Contact";

const Home = () => {
  return (
    <main>
      {/* HERO — Header transparente */}
      <section data-header="hero">
        <Hero />
      </section>

      {/* QUEM SOMOS E O QUE FAZEMOS */}
      <section data-header="default">
        <Institutional />
      </section>

      {/* DIRETORIA */}
      <section data-header="default">
        <Board />
      </section>

      {/* EVENTOS */}
      <section data-header="default">
        <Events />
      </section>

      {/* ASSOCIADOS */}
      <section data-header="default">
        <Associates />
      </section>

      {/* COMPONENTES FUTUROS (descomente quando criar): */}
      {/* 
      <section data-header="default">
        <SecondaryEvents />
      </section>

      <section data-header="default">
        <GovernmentPartnerships />
      </section>

      <section data-header="default">
        <form />
      </section>

      <section data-header="default">
        <Contact />
      </section>
      */}

      {/* BOTÃO WHATSAPP */}
      <WhatsAppButton />
    </main>
  );
};

export default Home;

