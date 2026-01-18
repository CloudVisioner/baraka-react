import React, { useState, useEffect } from "react";
import { IconButton, Box, useTheme } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: theme.spacing(3), md: theme.spacing(4) },
        right: { xs: theme.spacing(3), md: theme.spacing(4) },
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <IconButton
        onClick={scrollToTop}
        sx={{
          width: { xs: 48, md: 56 },
          height: { xs: 48, md: 56 },
          backgroundColor: "#1D1D1F",
          color: "#FFFFFF",
          borderRadius: "50%",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "#007AFF",
            transform: "translateY(-4px) scale(1.05)",
            boxShadow: "0 8px 24px rgba(0, 122, 255, 0.3), 0 4px 12px rgba(0, 122, 255, 0.2)",
          },
          "&:active": {
            transform: "translateY(-2px) scale(1.02)",
          },
        }}
        aria-label="scroll to top"
      >
        <KeyboardArrowUpIcon
          sx={{
            fontSize: { xs: "28px", md: "32px" },
          }}
        />
      </IconButton>
    </Box>
  );
}
