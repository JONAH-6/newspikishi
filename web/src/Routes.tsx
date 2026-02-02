// src/Routes.tsx
import { Router, Route, Set } from '@redwoodjs/router'

import { AuthContextProvider } from './contexts/AuthContexts'
import { CartProvider } from './contexts/CartContext'
import MainLayout from './layouts/MainLayout/MainLayout'
import ContactPage from './pages/ContactPage/ContactPage'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

const Routes = () => {
  return (
    <Router>
      <Set wrap={AuthContextProvider}>
        <Set wrap={CartProvider}>
          <Set wrap={MainLayout}>
            <Route path="/" page={HomePage} name="home" />
            <Route path="/contact" page={ContactPage} name="contact" />
          </Set>
          <Route path="/login" page={LoginPage} name="login" />
        </Set>
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
