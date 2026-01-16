import Hero from "../components/Hero";
import Board from "../components/Board";
import Events from "../components/Events";
import Associates from "../components/Associates";
import Contact from "../components/Contact";

const HomePage = () => {
  return (
    <>
      <Hero />

      <section data-header="default">
        <Board />
      </section>

      <section data-header="default">
        <Events />
      </section>

      <section data-header="default">
        <Associates />
      </section>

      <section data-header="default">
        <Contact />
      </section>
    </>
  );
};

export default HomePage;
