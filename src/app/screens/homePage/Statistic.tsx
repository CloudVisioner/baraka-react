import { Box, Container, Paper, Typography } from "@mui/material";
import React from "react";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LanguageIcon from "@mui/icons-material/Language";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

export default function Statistics() {
  const stats = [
    { value: "25k+", label: "BOOKS IN STOCK", icon: LibraryBooksIcon },
    { value: "4.9", label: "AVERAGE RATING", icon: StarIcon },
    { value: "8k+", label: "HAPPY READERS", icon: FavoriteIcon },
    { value: "45+", label: "GENRES COVERED", icon: LanguageIcon },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#F5F5F7",
        padding: { xs: "60px 24px", md: "80px 0" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 3, sm: 4, md: 5 },
            width: "100%",
            maxWidth: { xs: "100%", md: "1200px" },
            justifyContent: "center",
          }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    borderRadius: "24px",
                    border: "1px solid #D2D2D7",
                    backgroundColor: "#FFFFFF",
                    padding: "48px 32px",
                    width: "100%",
                    height: "240px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0) 100%)",
                      opacity: 0,
                      transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    },
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 24px 48px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)",
                      border: "1px solid #D2D2D7",
                      "&::before": {
                        opacity: 1,
                      },
                      "& .stat-icon": {
                        transform: "scale(1.15) translateY(-4px)",
                        opacity: 0.8,
                      },
                      "& .stat-value": {
                        transform: "scale(1.05)",
                      },
                    },
                  }}
                >
                <IconComponent
                  className="stat-icon"
                  sx={{
                    fontSize: "40px",
                    color: "#1D1D1F",
                    marginBottom: "20px",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                <Typography
                  className="stat-value"
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "3rem",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    color: "#1D1D1F",
                    marginBottom: "16px",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#1D1D1F",
                  }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
