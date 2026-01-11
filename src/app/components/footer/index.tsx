import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobal";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

interface FooterLink {
  label: string;
  to: string;
  requireAuth?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export default function Footer() {
  const { authMember } = useGlobals();

  const footerColumns: FooterColumn[] = [
    {
      title: "Shop",
      links: [
        { label: "Browse Books", to: "/products" },
        { label: "Bestsellers", to: "/products" },
        { label: "New Arrivals", to: "/products" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My Account", to: authMember ? "/member-page" : "/", requireAuth: true },
        { label: "My Orders", to: authMember ? "/orders" : "/", requireAuth: true },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", to: "/help-page" },
        { label: "Contact Us", to: "/help-page" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#1d1d1f",
        paddingTop: { xs: "40px", md: "60px" },
        paddingBottom: { xs: "32px", md: "40px" },
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: "32px", md: "24px" },
            marginBottom: { xs: "40px", md: "48px" },
          }}
        >
          {/* Company Info Column */}
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", sm: "1 / -1", md: "1" },
            }}
          >
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "1.5rem",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#f5f5f7",
                marginBottom: "12px",
              }}
            >
              BARAKA
            </Typography>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "0.875rem",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "#86868b",
                marginBottom: "20px",
                maxWidth: "280px",
              }}
            >
              Your premier destination for books. Discover curated collections and join literary events.
            </Typography>
            {/* Social Media Links */}
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <Box
                component="a"
                href="#"
                sx={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <img src="/icons/facebook.svg" alt="Facebook" style={{ width: "16px", height: "16px", filter: "brightness(0) invert(1)" }} />
              </Box>
              <Box
                component="a"
                href="#"
                sx={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <img src="/icons/twitter.svg" alt="Twitter" style={{ width: "16px", height: "16px", filter: "brightness(0) invert(1)" }} />
              </Box>
              <Box
                component="a"
                href="#"
                sx={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <img src="/icons/instagram.svg" alt="Instagram" style={{ width: "16px", height: "16px", filter: "brightness(0) invert(1)" }} />
              </Box>
              <Box
                component="a"
                href="#"
                sx={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <img src="/icons/youtube.svg" alt="YouTube" style={{ width: "16px", height: "16px", filter: "brightness(0) invert(1)" }} />
              </Box>
            </Box>
          </Box>

          {/* Link Columns */}
          {footerColumns.map((column, index) => (
            <Box key={index}>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  color: "#f5f5f7",
                  marginBottom: "12px",
                }}
              >
                {column.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {column.links.map((link, linkIndex) => {
                  if (link.requireAuth && !authMember) return null;
                  return (
                    <Link
                      key={linkIndex}
                      to={link.to}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.75rem",
                          fontWeight: 400,
                          color: "#86868b",
                          transition: "color 0.2s",
                          "&:hover": {
                            color: "#f5f5f7",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            marginBottom: { xs: "24px", md: "32px" },
          }}
        />

        {/* Copyright */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: "16px",
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "0.75rem",
              fontWeight: 400,
              color: "#86868b",
            }}
          >
            Copyright © {new Date().getFullYear()} BARAKA. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
