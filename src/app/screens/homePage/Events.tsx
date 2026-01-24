import { useState, useEffect, useRef } from "react";
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EventService, { Event } from "../../services/EventService";
import { serverApi } from "../../../lib/config";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

// Event types for community events
type EventType = "author-talk" | "book-club" | "story-time" | "workshop" | "reading-challenge" | "other";

// Detailed event descriptions (can be extended with backend data)
const eventDetails: Record<
  string,
  { title: string; description: string; fullDescription: string }
> = {
  // Default fallback
  default: {
    title: "Community Event",
    description: "Join us for this exciting community event at Baraka Books.",
    fullDescription:
      "Join us for this exciting community event at Baraka Books. Experience the joy of reading and discover new perspectives through engaging discussions and community connections.",
  },
};

export default function Events() {
  const theme = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventService = new EventService();
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setTimeout(() => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.paddingRight = "";
      const htmlElement = document.documentElement;
      if (htmlElement) {
        htmlElement.style.overflow = "";
        htmlElement.style.position = "";
      }
    }, 100);
  };

  const getEventDetail = (title: string) => {
    return eventDetails[title] || eventDetails.default || {
      title,
      description: "",
      fullDescription: "Join us for this exciting community event at Baraka Books. Experience the joy of reading and discover new perspectives through engaging discussions and community connections.",
    };
  };

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold for rounding
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 960 ? 360 : window.innerWidth >= 600 ? 320 : 280;
      const scrollAmount = cardWidth * 1.5; // Scroll by 1.5 cards
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 960 ? 360 : window.innerWidth >= 600 ? 320 : 280;
      const scrollAmount = cardWidth * 1.5; // Scroll by 1.5 cards
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Check scroll position on mount, resize, and when events change
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => {
      checkScrollPosition();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [events.length]);

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
            marginBottom: { xs: theme.spacing(4), md: theme.spacing(6) },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "28px", md: "36px" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              marginBottom: theme.spacing(1),
            }}
          >
            Events & Community
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "15px", md: "17px" },
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "#6E6E73",
              lineHeight: 1.5,
              maxWidth: "600px",
            }}
          >
            Join us for author talks, book clubs, children's story time, workshops, and reading challenges.
          </Typography>
        </Box>

        {/* Events Content - Show cards or empty state */}
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "17px",
                color: "#6E6E73",
              }}
            >
              Loading events...
            </Typography>
          </Box>
        ) : events.length > 0 ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
            }}
          >
            {/* Scrollable Container */}
            <Box
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            sx={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: theme.spacing(2),
              scrollBehavior: "smooth",
              // Custom scrollbar styling
              scrollbarWidth: "thin",
              scrollbarColor: "#D0D0D0 transparent",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#D0D0D0",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#A0A0A0",
                },
              },
              // Enable smooth scrolling with mouse wheel + Shift
              scrollSnapType: "x proximity",
            }}
          >
          <Box
            sx={{
              display: "flex",
              gap: { xs: theme.spacing(2), sm: theme.spacing(3), md: theme.spacing(4) },
              width: "max-content",
              paddingRight: { xs: theme.spacing(3), md: theme.spacing(4) },
            }}
          >
          {events.map((event: Event, index: number) => (
            <Card
                key={event._id || index}
                elevation={0}
                sx={{
                borderRadius: "20px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                  backgroundColor: "#FFFFFF",
                  overflow: "hidden",
                  // Fixed width for horizontal scroll
                  minWidth: { xs: "280px", sm: "320px", md: "360px" },
                  maxWidth: { xs: "280px", sm: "320px", md: "360px" },
                  width: { xs: "280px", sm: "320px", md: "360px" },
                  flexShrink: 0,
                  scrollSnapAlign: "start",
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
                  src={event.img.startsWith('http') ? event.img : `${serverApi}/uploads/${event.img}`}
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
                  COMMUNITY EVENT
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
                    {/* Host */}
                    {event.host && (
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
                          Host: {event.host}
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
          </Box>

          {/* Left Arrow Button - Outside cards */}
          {canScrollLeft && (
            <IconButton
              onClick={scrollLeft}
              aria-label="Scroll left"
              sx={{
                position: "absolute",
                left: { xs: theme.spacing(-2), md: theme.spacing(-3) },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                width: { xs: "40px", md: "48px" },
                height: { xs: "40px", md: "48px" },
                "&:hover": {
                  backgroundColor: "#F5F5F7",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "translateY(-50%) scale(0.95)",
                },
              }}
            >
              <ArrowBackIosIcon sx={{ fontSize: { xs: "18px", md: "20px" }, color: "#1D1D1F" }} />
            </IconButton>
          )}

          {/* Right Arrow Button - Outside cards */}
          {canScrollRight && (
            <IconButton
              onClick={scrollRight}
              aria-label="Scroll right"
              sx={{
                position: "absolute",
                right: { xs: theme.spacing(-2), md: theme.spacing(-3) },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                width: { xs: "40px", md: "48px" },
                height: { xs: "40px", md: "48px" },
                "&:hover": {
                  backgroundColor: "#F5F5F7",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "translateY(-50%) scale(0.95)",
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: { xs: "18px", md: "20px" }, color: "#1D1D1F" }} />
            </IconButton>
          )}
        </Box>
        ) : (
          /* Empty State */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              minHeight: "300px",
              padding: theme.spacing(6, 4),
              textAlign: "center",
              backgroundColor: "#F5F5F7",
              borderRadius: "16px",
            }}
          >
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: { xs: "24px", md: "28px" },
                fontWeight: 600,
                color: "#1D1D1F",
                marginBottom: theme.spacing(2),
                letterSpacing: "-0.02em",
              }}
            >
              No Upcoming Events
            </Typography>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: { xs: "16px", md: "17px" },
                fontWeight: 400,
                color: "#6E6E73",
                maxWidth: "500px",
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
              }}
            >
              We're currently planning exciting community events. Check back soon for author talks, book clubs, workshops, and more!
            </Typography>
          </Box>
        )}
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
        disableScrollLock={false}
        onTransitionExited={() => {
          document.body.style.overflow = "";
          document.body.style.position = "";
          document.body.style.paddingRight = "";
        }}
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
            width: "100%",
            margin: theme.spacing(2),
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            overflowX: "hidden",
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
              overflowX: "hidden",
              width: "100%",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCloseModal();
              }}
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
              image={selectedEvent.img.startsWith('http') ? selectedEvent.img : `${serverApi}/uploads/${selectedEvent.img}`}
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
                overflowX: "hidden",
                flex: 1,
                position: "relative",
                zIndex: 1,
                maxHeight: "calc(90vh - 320px)",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#D0D0D0",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#A0A0A0",
                  },
                },
              }}
            >
              <Box sx={{ 
                maxWidth: "100%", 
                margin: "0 auto",
                width: "100%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                overflow: "hidden",
              }}>
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
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
              COMMUNITY EVENT
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
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {selectedEvent.title}
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
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                {selectedEvent.fullDesc || selectedEvent.desc}
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
                {/* Host */}
                {selectedEvent.host && (
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
                      Host: {selectedEvent.host}
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
