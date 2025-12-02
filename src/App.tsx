import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import WhoWeAre from './components/WhoWeAre'
import WhatWeDo from './components/WhatWeDo'
import Board from './components/Board'
import Events from './components/Events'
import SecondaryEvents from './components/SecondaryEvents'
import Associates from './components/Associates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './i18n'
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white scroll-smooth">
      <Header />

      <main className="pt-16">
        <section id="inicio"><Hero /></section>
        <section id="quem-somos"><WhoWeAre /></section>
        <section id="o-que-fazemos"><WhatWeDo /></section>
        <section id="diretoria"><Board /></section>
        <section id="eventos"><Events /></section>
        <section id="eventos-secundarios"><SecondaryEvents /></section>
        <section id="associados"><Associates /></section>
        <section id="contato"><Contact /></section>
      </main>

      <Footer />

      {/* BOTÃO FLUTUANTE */}
      <WhatsAppButton />
    </div>
  )
}

export default App;
