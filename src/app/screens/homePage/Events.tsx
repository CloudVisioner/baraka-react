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
                  borderRadius: "24px",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
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
                {/* Image Section - Smaller, Square Aspect */}
                <Box
                  sx={{
                    width: { xs: "100%", md: "280px" },
                    height: { xs: "200px", md: "280px" },
                    flexShrink: 0,
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

                {/* Content Section - Better Structured */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: { xs: "20px", md: "28px" },
                    justifyContent: "space-between",
                  }}
                >
                  {/* Top Section */}
                  <Box>
                    {/* Category Badge */}
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "#007AFF",
                        marginBottom: "12px",
                        display: "inline-block",
                        padding: "4px 10px",
                        backgroundColor: "rgba(0, 122, 255, 0.1)",
                        borderRadius: "6px",
                      }}
                    >
                      BOOK READING
                    </Typography>

                    {/* Event Title */}
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: appleFont,
                        fontSize: { xs: "1.375rem", md: "1.625rem" },
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#1D1D1F",
                        lineHeight: 1.25,
                        marginBottom: "12px",
                      }}
                    >
                      {event.title}
                    </Typography>

                    {/* Author */}
                    {event.author && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "16px",
                        }}
                      >
                        <PersonIcon
                          sx={{
                            fontSize: "18px",
                            color: "#6E6E73",
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "0.9375rem",
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
                        lineHeight: 1.6,
                        marginBottom: "20px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.desc}
                    </Typography>
                  </Box>

                  {/* Bottom Section */}
                  <Box>
                    {/* Date and Location */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "20px",
                        paddingBottom: "20px",
                        borderBottom: "1px solid #D2D2D7",
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

                    {/* CTA Button - Right Aligned */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "stretch", md: "flex-end" },
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          backgroundColor: "#007AFF",
                          color: "#FFFFFF",
                          borderRadius: "20px",
                          padding: "12px 28px",
                          textTransform: "none",
                          width: { xs: "100%", md: "auto" },
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
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
