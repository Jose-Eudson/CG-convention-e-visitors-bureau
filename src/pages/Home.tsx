import Hero from "../components/Hero";
import ConhecaCG from "../components/ConhecaCG";
import WhoWeAre from "../components/WhoWeAre";
import WhatWeDo from "../components/WhatWeDo";
import Events from "../components/Events";
import SecondaryEvents from "../components/SecondaryEvents";
import Associates from "../components/Associates";
import GovernmentPartnerships from "../components/GovernmentPartnerships";
import Board from "../components/Board";
import Contact from "../components/Contact";
import WhatsAppButton from "../components/WhatsAppButton";

const Home = () => {
  return (
    <main>
      <Hero />
      <ConhecaCG />
      <WhoWeAre />
      <WhatWeDo />
      <Events />
      <SecondaryEvents />
      <Associates />
      <GovernmentPartnerships />
      <Board />
      <Contact />
      <WhatsAppButton />
    </main>
  );
};

export default Home;
