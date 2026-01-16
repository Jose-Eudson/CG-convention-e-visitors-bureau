import Hero from "../components/Hero";
import Institutional from "../components/Institutional";
import Events from "../components/Events";
import Associates from "../components/Associates";
import Board from "../components/Board";
import WhatsAppButton from "../components/WhatsAppButton";


const Home = () => {
  return (
    <main>

      <section data-header="hero">
        <Hero />
      </section>


      <section data-header="default">
        <Institutional />
      </section>


      <section data-header="default">
        <Board />
      </section>


      <section data-header="default">
        <Events />
      </section>


      <section data-header="default">
        <Associates />
      </section>




      <WhatsAppButton />
    </main>
  );
};

export default Home;

