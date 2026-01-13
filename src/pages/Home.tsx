import Hero from "../components/Hero";
import WhoWeAre from "../components/WhoWeAre";
import WhatWeDo from "../components/WhatWeDo";
import Events from "../components/Events";
import SecondaryEvents from "../components/SecondaryEvents";
import Associates from "../components/Associates";
import GovernmentPartnerships from "../components/GovernmentPartnerships";
import Board from "../components/Board";
import WhatsAppButton from "../components/WhatsAppButton";

const Home = () => {
  return (
    <main>
      {/* HERO — Header transparente */}
      <Hero />

      {/* QUEM SOMOS */}
      <section data-header="default">
        <WhoWeAre />
      </section>

      {/* O QUE FAZEMOS */}
      <section data-header="default">
        <WhatWeDo />
      </section>

      {/* EVENTOS */}
      <section data-header="default">
        <Events />
      </section>

      {/* EVENTOS SECUNDÁRIOS */}
      <section data-header="default">
        <SecondaryEvents />
      </section>

      {/* ASSOCIADOS */}
      <section data-header="default">
        <Associates />
      </section>

      {/* PARCERIAS GOVERNAMENTAIS */}
      <section data-header="default">
        <GovernmentPartnerships />
      </section>

      {/* DIRETORIA */}
      <section data-header="default">
        <Board />
      </section>

      <section data-header="default">
        <form />
      </section>

      {/* CONTATO — removido temporariamente */}
      {/* <section data-header="default">
        <Contact />
      </section> */}

      {/* BOTÃO WHATSAPP */}
      <WhatsAppButton />
    </main>
  );
};

export default Home;
