import { Box, Container, Paper, Typography, Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { plans } from "../../../lib/data/plans";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

export default function Events() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#F5F5F7",
        padding: { xs: "80px 24px", md: "120px 0" },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            marginBottom: { xs: "48px", md: "64px" },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
            }}
          >
            Literary Events
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 6,
            width: "100%",
            maxWidth: { md: "1400px" },
            margin: "0 auto",
          }}
        >
          {plans.map((event, index) => {
            return (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  borderRadius: "32px",
                  backgroundColor: "#FFFFFF",
                  overflow: "hidden",
                  width: "100%",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  transition: "transform 0.4s cubic-bezier(0.2, 1, 0.2, 1), box-shadow 0.4s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                {/* Left Side - Image (40%) */}
                <Box
                  sx={{
                    width: { xs: "100%", md: "40%" },
                    height: { xs: "200px", md: "auto" },
                    minHeight: { md: "220px" },
                    overflow: "hidden",
                    backgroundColor: "#F5F5F7",
                  }}
                >
                  <img
                    src={event.img}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Right Side - Info (60%) */}
                <Box
                  sx={{
                    width: { xs: "100%", md: "60%" },
                    padding: { xs: "20px", md: "24px" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    {/* Top: BOOK READING Label */}
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "#007AFF",
                        marginBottom: "16px",
                      }}
                    >
                      BOOK READING
                    </Typography>

                    {/* Middle: Event Name */}
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: appleFont,
                        fontSize: { xs: "1.5rem", md: "1.75rem" },
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#1D1D1F",
                        lineHeight: 1.3,
                        marginBottom: "12px",
                      }}
                    >
                      {event.title}
                    </Typography>

                    {/* Author Information */}
                    {event.author && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "12px",
                        }}
                      >
                        <PersonIcon
                          sx={{
                            fontSize: "16px",
                            color: "#6E6E73",
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#6E6E73",
                          }}
                        >
                          {event.author}
                        </Typography>
                      </Box>
                    )}

                    {/* Description */}
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "0.9375rem",
                        fontWeight: 400,
                        color: "#6E6E73",
                        lineHeight: 1.5,
                        marginBottom: "20px",
                      }}
                    >
                      {event.desc}
                    </Typography>

                    {/* Date and Location with Calendar Icon */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "24px",
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{
                          fontSize: "18px",
                          color: "#6E6E73",
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.875rem",
                          fontWeight: 400,
                          color: "#6E6E73",
                        }}
                      >
                        {event.date} • {event.location}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Attend Reading Button */}
                  <Button
                    variant="contained"
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      backgroundColor: "#007AFF",
                      color: "#FFFFFF",
                      borderRadius: "24px",
                      padding: "12px 32px",
                      textTransform: "none",
                      alignSelf: { xs: "stretch", md: "flex-start" },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: "#0051D5",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Attend Reading
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
