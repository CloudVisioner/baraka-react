import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  IconButton,
  useTheme,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { plans } from "../../../lib/data/plans";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

// Detailed event descriptions
const eventDetails: Record<string, { title: string; description: string; fullDescription: string }> = {
  "Hot Discount Days": {
    title: "Hot Discount Days",
    description: "Each Friday we deliver highest discounts",
    fullDescription: "Join us every Friday for our exclusive Hot Discount Days at Baraka Books. Discover amazing savings on a wide selection of books across all genres. Whether you're looking for fiction, non-fiction, academic texts, or comics, you'll find incredible deals. Our curated collection features titles from bestsellers to hidden gems, all at special prices. This weekly event is perfect for book lovers who want to expand their library while saving. Don't miss out on the best book deals in town every Friday.",
  },
  "Coming Soon": {
    title: "Coming Soon - Fresh Arrivals",
    description: "Be ready for fresh Arrivals from Monday!",
    fullDescription: "Get ready for exciting new arrivals every Monday at Baraka Books. We're constantly updating our collection with the latest releases, bestsellers, and carefully selected titles. From newly published novels to academic resources and graphic novels, our Monday arrivals bring fresh perspectives and new stories to our shelves. Be among the first to discover these new additions and find your next favorite read. Visit us on Mondays to explore what's new and expand your reading horizons with our latest curated selections.",
  },
  "New Project Lunch": {
    title: "New Project Launch - Literary Series",
    description: "New Restaurant is opening in Florida",
    fullDescription: "We're thrilled to announce our new Literary Series program launching at Baraka Books. This innovative project brings together readers, authors, and book enthusiasts for monthly themed discussions, author readings, and community events. Each session focuses on a different literary theme or genre, creating opportunities for deep exploration and meaningful conversations. Join us as we celebrate literature, foster connections, and build a vibrant reading community. This project represents our commitment to making books more accessible and creating spaces where ideas flourish.",
  },
};

export default function Events() {
  const theme = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<typeof plans[0] | null>(null);

  const handleOpenModal = (event: typeof plans[0]) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [selectedEvent]);

  const getEventDetail = (title: string) => {
    return eventDetails[title] || {
      title,
      description: "",
      fullDescription: "Join us for this exciting literary event at Baraka Books. Experience the joy of reading and discover new perspectives through engaging discussions and community connections.",
    };
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: { xs: theme.spacing(10, 3), md: theme.spacing(15, 0) },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            marginBottom: { xs: theme.spacing(6), md: theme.spacing(8) },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "28px", md: "40px" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              marginBottom: theme.spacing(2),
            }}
          >
            Literary Events
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "15px", md: "17px" },
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "#1D1D1F",
              lineHeight: 1.6,
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            Join us for engaging book readings, author meet-and-greets, and literary discussions at Baraka Books.
          </Typography>
        </Box>

        {/* Events Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: theme.spacing(3), md: theme.spacing(4) },
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {plans.slice(0, 3).map((event, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
                transition: theme.transitions.create(
                  ["transform", "box-shadow"],
                  {
                    duration: theme.transitions.duration.standard,
                    easing: theme.transitions.easing.easeOut,
                  }
                ),
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {/* Image Section */}
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "180px", md: "200px" },
                  overflow: "hidden",
                  backgroundColor: "#F5F5F7",
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src={event.img}
                  alt={event.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: theme.transitions.create("transform", {
                      duration: theme.transitions.duration.standard,
                      easing: theme.transitions.easing.easeOut,
                    }),
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>

              {/* Content Section */}
              <CardContent
                sx={{
                  padding: theme.spacing(3),
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing(2),
                }}
              >
                {/* Category Badge */}
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#1D1D1F",
                    marginBottom: theme.spacing(-1),
                  }}
                >
                  BOOK EVENT
                </Typography>

                {/* Event Title */}
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: { xs: "18px", md: "20px" },
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#1D1D1F",
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "16px",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "#1D1D1F",
                    lineHeight: 1.5,
                    marginBottom: theme.spacing(0.5),
                  }}
                >
                  {event.desc}
                </Typography>

                {/* Divider */}
                <Box
                  sx={{
                    height: "1px",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    margin: theme.spacing(1, 0),
                  }}
                />

                {/* Event Details */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing(1),
                    marginBottom: theme.spacing(1.5),
                  }}
                >
                  {/* Author */}
                  {event.author && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(1.5),
                      }}
                    >
                      <PersonIcon
                        sx={{
                          fontSize: "18px",
                          color: "#1D1D1F",
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "16px",
                          fontWeight: 400,
                          letterSpacing: "-0.01em",
                          color: "#1D1D1F",
                        }}
                      >
                        {event.author}
                      </Typography>
                    </Box>
                  )}

                  {/* Date */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(1.5),
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{
                        fontSize: "18px",
                        color: "#1D1D1F",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "16px",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        color: "#1D1D1F",
                      }}
                    >
                      {event.date}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(1.5),
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        fontSize: "18px",
                        color: "#1D1D1F",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "16px",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        color: "#1D1D1F",
                      }}
                    >
                      {event.location}
                    </Typography>
                  </Box>
                </Box>

                {/* CTA Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleOpenModal(event)}
                  sx={{
                    height: "40px",
                    borderRadius: "12px",
                    fontFamily: appleFont,
                    fontSize: "16px",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    textTransform: "none",
                    background: "#007AFF",
                    color: "#FFFFFF",
                    boxShadow: "0 2px 8px rgba(0, 122, 255, 0.25)",
                    border: "none",
                    marginTop: theme.spacing(0.5),
                    transition: theme.transitions.create(
                      ["background-color", "box-shadow", "transform"],
                      {
                        duration: theme.transitions.duration.standard,
                        easing: theme.transitions.easing.easeOut,
                      }
                    ),
                    "&:hover": {
                      background: "#0051D5",
                      boxShadow: "0 4px 16px rgba(0, 122, 255, 0.35)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      background: "#007AFF",
                    },
                  }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Event Detail Modal */}
      <Dialog
        open={!!selectedEvent}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            return;
          }
          handleCloseModal();
        }}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 1300,
          "& .MuiDialog-container": {
            zIndex: 1300,
          },
          "& .MuiBackdrop-root": {
            zIndex: 1299,
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "560px",
            margin: theme.spacing(2),
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            position: "relative",
            zIndex: 1300,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 1299,
          },
        }}
        disableEscapeKeyDown={false}
      >
        {selectedEvent && (
          <Card 
            elevation={0} 
            sx={{ 
              backgroundColor: "transparent",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
              overflow: "hidden",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: theme.spacing(2),
                right: theme.spacing(2),
                zIndex: 1301,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  transform: "scale(1.08)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "20px", color: "#1D1D1F" }} />
            </IconButton>

            {/* Event Image */}
            <CardMedia
              component="img"
              image={selectedEvent.img}
              alt={selectedEvent.title}
              sx={{
                height: { xs: "280px", sm: "320px" },
                objectFit: "cover",
              }}
            />

            {/* Event Content */}
            <CardContent 
              sx={{ 
                padding: { xs: theme.spacing(5, 4), sm: theme.spacing(6, 5) },
                overflowY: "auto",
                flex: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box sx={{ maxWidth: "600px", margin: "0 auto" }}>
                {/* Category Label */}
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#86868B",
                    marginBottom: theme.spacing(4),
                  }}
                >
                  BOOK EVENT
                </Typography>

                {/* Event Title */}
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: { xs: "26px", sm: "28px" },
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#1D1D1F",
                    marginBottom: theme.spacing(4),
                    lineHeight: 1.3,
                  }}
                >
                  {getEventDetail(selectedEvent.title).title}
                </Typography>

              {/* Full Description */}
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: { xs: "15px", sm: "16px" },
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  color: "#1D1D1F",
                  lineHeight: 1.8,
                  marginBottom: theme.spacing(5),
                }}
              >
                {getEventDetail(selectedEvent.title).fullDescription}
              </Typography>

              {/* Event Details */}
              <Box
                sx={{
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  paddingTop: theme.spacing(4),
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing(2.5),
                }}
              >
                {/* Author */}
                {selectedEvent.author && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(1.5),
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: "18px",
                        color: "#1D1D1F",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "16px",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        color: "#1D1D1F",
                      }}
                    >
                      {selectedEvent.author}
                    </Typography>
                  </Box>
                )}

                {/* Date */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(1.5),
                  }}
                >
                  <CalendarTodayIcon
                    sx={{
                      fontSize: "18px",
                      color: "#1D1D1F",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "16px",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "#1D1D1F",
                    }}
                  >
                    {selectedEvent.date}
                  </Typography>
                </Box>

                {/* Location */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(1.5),
                  }}
                >
                  <LocationOnIcon
                    sx={{
                      fontSize: "18px",
                      color: "#1D1D1F",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "16px",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "#1D1D1F",
                    }}
                  >
                    {selectedEvent.location}
                  </Typography>
                </Box>
              </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Dialog>
    </Box>
  );
}
