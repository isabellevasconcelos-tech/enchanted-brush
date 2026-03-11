import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StarsProvider } from './context/StarsContext'
import { CartProvider } from './context/CartContext'
import { ProfileProvider } from './context/ProfileContext'
import Header from './components/Header'
import Footer from './components/Footer'
import StarCounter from './components/StarCounter'
import TouchSparkle from './components/TouchSparkle'
import SplashScreen from './components/SplashScreen'
import ProfileBanner from './components/ProfileBanner'
import Home from './pages/Home'
import Loja from './pages/Loja'
import Produto from './pages/Produto'
import Encomenda from './pages/Encomenda'
import MyStory from './pages/MyStory'
import HiddenStars from './pages/HiddenStars'
import LimitedPieces from './pages/LimitedPieces'
import Confirmacao from './pages/Confirmacao'
import Carrinho from './pages/Carrinho'
import Perfil from './pages/Perfil'
import Inspiracoes from './pages/Inspiracoes'
import Personalizar from './pages/Personalizar'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <BrowserRouter>
      <ProfileProvider>
        <StarsProvider>
          <CartProvider>
            {showSplash && <SplashScreen onEnter={() => setShowSplash(false)} />}
            <div className="min-h-screen flex flex-col bg-cream-100 relative">
              {/* Esfumado escuro no topo */}
              <div className="pointer-events-none fixed top-0 left-0 right-0 h-32 z-40 bg-gradient-to-b from-[#0F0A05] via-[#0F0A05]/60 to-transparent" />
              {/* Esfumado escuro na base */}
              <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 z-40 bg-gradient-to-t from-[#0F0A05] via-[#0F0A05]/60 to-transparent" />
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Loja />} />
                  <Route path="/loja" element={<Loja />} />
                  <Route path="/produto/:id" element={<Produto />} />
                  <Route path="/checkout" element={<Encomenda />} />
                  <Route path="/my-story" element={<MyStory />} />
                  <Route path="/hidden-stars" element={<HiddenStars />} />
                  <Route path="/limited" element={<LimitedPieces />} />
                  <Route path="/confirmacao" element={<Confirmacao />} />
                  <Route path="/carrinho" element={<Carrinho />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/inspiracoes" element={<Inspiracoes />} />
                  <Route path="/personalizar" element={<Personalizar />} />
                </Routes>
              </main>
              <Footer />
            </div>
            {!showSplash && <ProfileBanner />}
            {!showSplash && <StarCounter />}
            {!showSplash && <TouchSparkle />}
          </CartProvider>
        </StarsProvider>
      </ProfileProvider>
    </BrowserRouter>
  )
}

export default App
