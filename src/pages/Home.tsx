import Hero from "../components/Hero";
import WhoWeAre from "../components/WhoWeAre";
import WhatWeDo from "../components/WhatWeDo";
import Events from "../components/Events";
import Associates from "../components/Associates";
import Board from "../components/Board";
import WhatsAppButton from "../components/WhatsAppButton";

const Home = () => {
  return (
    <main>
      <Hero />
      <WhoWeAre />
      <WhatWeDo />
      <Board />
      <Events />
      <Associates />
      <WhatsAppButton />
    </main>
  );
};

export default Home;
