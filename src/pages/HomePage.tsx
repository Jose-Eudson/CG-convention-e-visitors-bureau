import Hero from "../components/Hero";
import WhoWeAre from "../components/WhoWeAre";
import WhatWeDo from "../components/WhatWeDo";
import Board from "../components/Board";
import Events from "../components/Events";
import Associates from "../components/Associates";
import GovernmentPartnerships from "../components/GovernmentPartnerships";
import Contact from "../components/Contact";

const HomePage = () => {
  return (
    <>
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

      {/* PARCERIAS GOVERNAMENTAIS */}
      <section data-header="default">
        <GovernmentPartnerships />
      </section>

      {/* CONTATO */}
      <section data-header="default">
        <Contact />
      </section>
    </>
  );
};

export default HomePage;
