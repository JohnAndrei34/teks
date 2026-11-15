import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Store from './pages/Store.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import GameDetails from './pages/GameDetails.jsx'
import DeveloperPage from './pages/DeveloperPage.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="store" element={<Store />} />
        <Route path="collections/:slug" element={<CollectionPage />} />
        <Route path="game/:slug" element={<GameDetails />} />
        <Route path="developers/:slug" element={<DeveloperPage />} />
        <Route path="cart" element={<ComingSoon title="Cart" />} />
        <Route path="checkout" element={<ComingSoon title="Checkout" />} />
        <Route path="order/:code" element={<ComingSoon title="Order" />} />
        <Route path="sell" element={<ComingSoon title="Sell on TEKS" />} />
        <Route path="about" element={<ComingSoon title="About" />} />
        <Route path="contact" element={<ComingSoon title="Contact" />} />
        <Route path="admin" element={<ComingSoon title="Admin" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
