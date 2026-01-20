import React, { useState, useEffect } from "react";

import { Route, Switch, useLocation } from "react-router-dom";
import ProductsPages from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import HomePage from "./screens/homePage";
import UserPage from "./screens/userPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import HelpPage from "./screens/helpPage";
import AuthPage from "./screens/authPage";
import { CartItem } from "../lib/types/search";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { T } from "../lib/types/common";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import { useGlobals } from "./hooks/useGlobal";

function App() {
  const location = useLocation();
  const { setAuthMember } = useGlobals();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setnAnchorEl] = useState<HTMLElement | null>(null);

  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
    setnAnchorEl(e.currentTarget);
  };
  const handleCloseLogout = () => setnAnchorEl(null);
  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      await sweetTopSuccessAlert("Logged out successfully", 1000);
      setAuthMember(null);
    } catch (err) {
      sweetErrorHandling(Messages.error1);
    }
  };

  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      {!isAuthPage && (
        <>
          {location.pathname === "/" ? (
            <HomeNavbar
              cartItems={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
              setSignupOpen={setSignupOpen}
              setLoginOpen={setLoginOpen}
              anchorEl={anchorEl}
              handleLogoutClick={handleLogoutClick}
              handleCloseLogout={handleCloseLogout}
              handleLogoutRequest={handleLogoutRequest}
            />
          ) : (
            <OtherNavbar
              cartItems={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
              setSignupOpen={setSignupOpen}
              setLoginOpen={setLoginOpen}
              anchorEl={anchorEl}
              handleLogoutClick={handleLogoutClick}
              handleCloseLogout={handleCloseLogout}
              handleLogoutRequest={handleLogoutRequest}
            />
          )}
        </>
      )}
      <Switch>
        <Route path="/products">
          <ProductsPages onAdd={onAdd} />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/member-page">
          <UserPage />
        </Route>
        <Route path="/help-page">
          <HelpPage />
        </Route>
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      {!isAuthPage && <Footer />}

      {/* Scroll to Top Button */}
      {!isAuthPage && <ScrollToTop />}

      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
      />
    </>
  );
}

export default App;
