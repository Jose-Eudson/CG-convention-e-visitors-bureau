import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import WhoWeAre from './components/WhoWeAre'
import WhatWeDo from './components/WhatWeDo'
import Board from './components/Board'
import Events from './components/Events'
import SecondaryEvents from './components/SecondaryEvents'
import Associates from './components/Associates'
import GovernmentPartnerships from './components/GovernmentPartnerships' 
import Contact from './components/Contact'
import Footer from './components/Footer'
import './i18n'
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhoWeAre />
        <WhatWeDo />
        <Events />
        <SecondaryEvents />
        <Associates />
        <GovernmentPartnerships /> 
        <Board />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App
