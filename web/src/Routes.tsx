// web/src/Routes.tsx
import { Router, Route, Set } from '@redwoodjs/router'
import { useAuth } from './contexts/AuthContexts'
import MainLayout from './layouts/MainLayout/MainLayout'

import HomePage from './pages/HomePage/HomePage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import CreateGroupOrderPage from './pages/CreateGroupOrderPage/CreateGroupOrderPage'
import GroupOrderRoomPage from './pages/GroupOrderRoomPage/GroupOrderRoomPage'
import TrackOrderPage from './pages/TrackOrderPage/TrackOrderPage'
import SellerPortalPage from './pages/SellerPortalPage/SellerPortalPage'
import RiderPortalPage from './pages/RiderPortalPage/RiderPortalPage'
import AdminPortalPage from './pages/AdminPortalPage/AdminPortalPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import ContactPage from './pages/ContactPage/ContactPage'
import AboutPage from './pages/AboutPage/AboutPage'
import DiscoverPage from './pages/DiscoverPage/DiscoverPage'
import LoginPage from './pages/LoginPage/LoginPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={MainLayout}>
        {/* Core Student Ordering Routes */}
        <Route path="/" page={HomePage} name="home" />
        <Route path="/checkout" page={CheckoutPage} name="checkout" />
        <Route path="/group/create" page={CreateGroupOrderPage} name="createGroupOrder" />
        <Route path="/group/{code}" page={GroupOrderRoomPage} name="groupOrderRoom" />
        <Route path="/track/{orderId}" page={TrackOrderPage} name="trackOrder" />
        <Route path="/orders" page={OrdersPage} name="orders" />

        {/* Multi-Role Operations Portals */}
        <Route path="/seller" page={SellerPortalPage} name="sellerPortal" />
        <Route path="/rider" page={RiderPortalPage} name="riderPortal" />
        <Route path="/admin" page={AdminPortalPage} name="adminPortal" />

        {/* Dashboard & Profile */}
        <Route path="/dashboard" page={DashboardPage} name="dashboard" />
        <Route path="/favorites" page={FavoritesPage} name="favorites" />
        <Route path="/profile" page={ProfilePage} name="profile" />
        <Route path="/settings" page={SettingsPage} name="settings" />
        <Route path="/contact" page={ContactPage} name="contact" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/discover" page={DiscoverPage} name="discover" />
      </Set>

      {/* Auth & Error Routes */}
      <Route path="/login" page={LoginPage} name="login" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
