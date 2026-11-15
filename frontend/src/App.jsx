import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Store from './pages/Store.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import GameDetails from './pages/GameDetails.jsx'
import DeveloperPage from './pages/DeveloperPage.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderPage from './pages/OrderPage.jsx'
import Sell from './pages/Sell.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
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
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order/:code" element={<OrderPage />} />
        <Route path="sell" element={<Sell />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
