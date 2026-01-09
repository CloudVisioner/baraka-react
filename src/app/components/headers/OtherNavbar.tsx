import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Box, Button, Container, Stack } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import Basket from "./Basket";
import { useGlobals } from "../../hooks/useGlobal";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface OtherNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function OtherNavbar(props: OtherNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="other-navbar">
      {/* Glassmorphism Navigation Bar */}
      <Box className="navbar-glass">
        <Container maxWidth="xl" sx={{ py: 0 }}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ 
              height: '64px',
              px: { xs: 2, sm: 3, md: 4 }
            }}
          >
            {/* Brand Logo */}
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <Box 
                className="brand-logo-modern"
                sx={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#f8f8ff',
                  letterSpacing: '-0.3px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#d7b586',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                BARAKA
              </Box>
            </NavLink>

            {/* Navigation Links */}
            <Stack 
              direction="row" 
              spacing={4} 
              alignItems="center"
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                flex: 1,
                justifyContent: 'center',
                ml: 4
              }}
            >
              <Box className="nav-link-modern">
                <NavLink to="/" className={isActive("/") ? "nav-active" : ""}>
                  Home
                </NavLink>
              </Box>
              <Box className="nav-link-modern">
                <NavLink to="/products" className={isActive("/products") ? "nav-active" : ""}>
                  Products
                </NavLink>
              </Box>
              {authMember && (
                <>
                  <Box className="nav-link-modern">
                    <NavLink to="/orders" className={isActive("/orders") ? "nav-active" : ""}>
                      Orders
                    </NavLink>
                  </Box>
                  <Box className="nav-link-modern">
                    <NavLink to="/member-page" className={isActive("/member-page") ? "nav-active" : ""}>
                      My Page
                    </NavLink>
                  </Box>
                </>
              )}
              <Box className="nav-link-modern">
                <NavLink to="/help-page" className={isActive("/help-page") ? "nav-active" : ""}>
                  Help
                </NavLink>
              </Box>
            </Stack>

            {/* Right Side Actions */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />

              {!authMember ? (
                <>
                  <Button
                    variant="text"
                    className="login-button-modern"
                    onClick={() => setLoginOpen(true)}
                    sx={{
                      color: '#f8f8ff',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      px: 2.5,
                      py: 0.75,
                      borderRadius: '20px',
                      textTransform: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    className="signup-button-navbar"
                    onClick={() => setSignupOpen(true)}
                    sx={{
                      color: '#ffffff',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      px: 2.5,
                      py: 0.75,
                      borderRadius: '20px',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #d7b586 0%, #c9a570 100%)',
                      boxShadow: '0 2px 12px rgba(215, 181, 134, 0.25)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 16px rgba(215, 181, 134, 0.35)',
                        background: 'linear-gradient(135deg, #e0c196 0%, #d7b586 100%)'
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Box
                  className="user-avatar-modern"
                  component="img"
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember?.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  onClick={handleLogoutClick}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      borderColor: 'rgba(215, 181, 134, 0.6)',
                      boxShadow: '0 4px 12px rgba(215, 181, 134, 0.3)'
                    }
                  }}
                />
              )}

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleCloseLogout}
                onClick={handleCloseLogout}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      background: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-50%) rotate(45deg)',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem 
                  onClick={handleLogoutRequest}
                  sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    fontSize: '14px',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: '#666' }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </div>
  );
}
