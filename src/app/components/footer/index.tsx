import React from "react";
import { Box, Container, Typography, Divider, IconButton, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useGlobals } from "../../hooks/useGlobal";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

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
  const theme = useTheme();

  // Scroll to top handler
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerColumns: FooterColumn[] = [
    {
      title: "Shop",
      links: [
        { label: "Browse Books", to: "/products" },
        { label: "Bestsellers", to: "/?tab=bestseller" },
        { label: "New Arrivals", to: "/?tab=new" },
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
        backgroundColor: "#1D1D1F",
        paddingTop: { xs: theme.spacing(6), md: theme.spacing(8) },
        paddingBottom: { xs: theme.spacing(4), md: theme.spacing(5) },
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
            gap: { xs: theme.spacing(5), md: theme.spacing(4) },
            marginBottom: { xs: theme.spacing(5), md: theme.spacing(6) },
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
                fontSize: { xs: "24px", md: "28px" },
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                marginBottom: theme.spacing(2),
              }}
            >
              Baraka Books
            </Typography>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: { xs: "14px", md: "15px" },
                fontWeight: 400,
                lineHeight: 1.6,
                color: "#FFFFFF",
                opacity: 0.8,
                marginBottom: theme.spacing(4),
                maxWidth: "320px",
                letterSpacing: "-0.01em",
              }}
            >
              Your premier destination for books. Discover curated collections and join literary events.
            </Typography>
            {/* Social Media Links */}
            <Box
              sx={{
                display: "flex",
                gap: theme.spacing(1.5),
              }}
            >
              <IconButton
                component="a"
                href="#"
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <FacebookIcon sx={{ fontSize: "20px", color: "#FFFFFF" }} />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <TwitterIcon sx={{ fontSize: "20px", color: "#FFFFFF" }} />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <InstagramIcon sx={{ fontSize: "20px", color: "#FFFFFF" }} />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <YouTubeIcon sx={{ fontSize: "20px", color: "#FFFFFF" }} />
              </IconButton>
            </Box>
          </Box>

          {/* Link Columns */}
          {footerColumns.map((column, index) => (
            <Box key={index}>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  marginBottom: theme.spacing(2.5),
                }}
              >
                {column.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing(1.5),
                }}
              >
                {column.links.map((link, linkIndex) => {
                  if (link.requireAuth && !authMember) return null;
                  return (
                    <Link
                      key={linkIndex}
                      to={link.to}
                      onClick={handleLinkClick}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#FFFFFF",
                          opacity: 0.8,
                          transition: "all 0.2s ease",
                          letterSpacing: "-0.01em",
                          "&:hover": {
                            opacity: 1,
                            color: "#FFFFFF",
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
            marginBottom: { xs: theme.spacing(3), md: theme.spacing(4) },
          }}
        />

        {/* Copyright */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: theme.spacing(2),
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "15px",
              fontWeight: 400,
              color: "#FFFFFF",
              opacity: 0.7,
              letterSpacing: "-0.01em",
            }}
          >
            Copyright © {new Date().getFullYear()} Baraka Books. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
