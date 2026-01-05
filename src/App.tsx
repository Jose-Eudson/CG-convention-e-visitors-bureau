import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n'

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
import WhatsAppButton from './components/WhatsAppButton'

import Ol from './components/Ol'
import HeaderProposta from './components/HeaderProposta'
import FooterSimples from './components/FooterSimples'

function HomePage() {
  return (
    <>
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
      <WhatsAppButton />
    </>
  )
}

function PropostaPage() {
  return (
    <>
      <HeaderProposta />
      <Ol />
      <FooterSimples />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 scroll-smooth">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/proposta" element={<PropostaPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
