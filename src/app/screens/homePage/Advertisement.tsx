import { Box, Button, Card, CardContent, CardMedia, Container, Dialog, IconButton, Stack, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Advertisement() {
  const theme = useTheme();
  const history = useHistory();
  const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';
  const [modalOpen, setModalOpen] = useState(false);

  const handleExploreClick = () => {
    history.push("/products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalOpen) {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: { xs: theme.spacing(10, 2), md: theme.spacing(15, 4), lg: theme.spacing(20, 4) },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: theme.spacing(6), md: theme.spacing(8), lg: theme.spacing(10) },
            alignItems: "center",
          }}
        >
          {/* Left Side: Text Content (45% on desktop) */}
          <Box
            sx={{
              flex: { md: "0 0 45%", lg: "0 0 45%" },
              width: "100%",
              maxWidth: { md: "45%", lg: "45%" },
              [theme.breakpoints.down("md")]: {
                maxWidth: "100%",
              },
            }}
          >
            {/* Eyebrow */}
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "15px",
                fontWeight: 400,
                color: "#1D1D1F",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: theme.spacing(2),
              }}
            >
              About the Bookstore
            </Typography>

            {/* Headline */}
            <Typography
              variant="h2"
              sx={{
                fontFamily: appleFont,
                fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#1D1D1F",
                marginBottom: theme.spacing(4),
                lineHeight: 1.1,
              }}
            >
              Built for people who care about what they read.
            </Typography>

            {/* Body Text */}
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: { xs: "16px", md: "17px" },
                fontWeight: 400,
                color: "#1D1D1F",
                letterSpacing: "-0.01em",
                lineHeight: 1.6,
                maxWidth: "600px",
                marginBottom: theme.spacing(6),
              }}
            >
              We believe books shape the way we think, work, and see the world.
              That's why we focus on thoughtful curation — selecting titles that
              are worth your time, not just filling shelves. From timeless
              literature to modern ideas, we make discovering great books simple,
              reliable, and personal.
            </Typography>

            {/* Primary Action Button */}
            <Button
              variant="contained"
              onClick={handleExploreClick}
              sx={{
                minWidth: "200px",
                height: "48px",
                borderRadius: "24px",
                fontFamily: appleFont,
                fontSize: "16px",
                fontWeight: 500,
                textTransform: "none",
                letterSpacing: "-0.01em",
                padding: theme.spacing(0, 3),
                background: "#007AFF",
                color: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0, 122, 255, 0.25)",
                transition: theme.transitions.create(
                  ["background-color", "box-shadow", "transform"],
                  {
                    duration: theme.transitions.duration.standard,
                    easing: theme.transitions.easing.easeOut,
                  }
                ),
                "&:hover": {
                  background: "#0051D5",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.35)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Explore the collection
            </Button>
          </Box>

          {/* Right Side: Image (55% on desktop) */}
          <Box
            onClick={handleImageClick}
            sx={{
              flex: { md: "0 0 55%", lg: "0 0 55%" },
              width: "100%",
              [theme.breakpoints.down("md")]: {
                order: -1,
              },
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              "&:hover": {
                "& .image-main": {
                  transform: "scale(1.08)",
                  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.18)",
                  filter: "brightness(1.1) saturate(1.2) contrast(1.05)",
                },
                "& .image-overlay": {
                  opacity: 0.3,
                },
                "& .image-glow": {
                  opacity: 0.6,
                  transform: "translate(-50%, -50%) scale(1.3)",
                },
              },
            }}
          >
            <Box
              component="img"
              className="image-main"
              src="/img/e161061f3c9253d77a7edcbdcc398131.jpg"
              alt="Baraka Bookstore"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                display: "block",
                objectFit: "cover",
                maxHeight: { xs: "400px", md: "600px" },
                objectPosition: "center",
                transition: theme.transitions.create(
                  ["transform", "box-shadow", "filter"],
                  {
                    duration: theme.transitions.duration.complex,
                    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }
                ),
                transform: "scale(1)",
                filter: "brightness(1) saturate(1)",
              }}
            />
            {/* Overlay gradient on hover */}
            <Box
              className="image-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "12px",
                background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 100%)",
                opacity: 0,
                transition: theme.transitions.create("opacity", {
                  duration: theme.transitions.duration.complex,
                  easing: theme.transitions.easing.easeInOut,
                }),
                pointerEvents: "none",
              }}
            />
            {/* Glow effect */}
            <Box
              className="image-glow"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)",
                opacity: 0,
                transform: "translate(-50%, -50%) scale(0.9)",
                transition: theme.transitions.create(
                  ["opacity", "transform"],
                  {
                    duration: theme.transitions.duration.complex,
                    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }
                ),
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Apple-Style Modal Dialog */}
      <Dialog
        open={modalOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            return;
          }
          handleCloseModal();
        }}
        maxWidth={false}
        PaperProps={{
          sx: {
            maxWidth: "480px",
            margin: theme.spacing(2),
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          },
        }}
        disableEscapeKeyDown={false}
      >
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#F5F5F7",
          }}
        >
          {/* Close Button - Top Right */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: theme.spacing(2),
              right: theme.spacing(2),
              zIndex: 10,
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

          {/* Image */}
          <CardMedia
            component="img"
            image="/img/e161061f3c9253d77a7edcbdcc398131.jpg"
            alt="Baraka Bookstore"
            sx={{
              height: { xs: "250px", sm: "300px" },
              objectFit: "cover",
            }}
          />

          {/* Content */}
          <CardContent sx={{ padding: { xs: theme.spacing(3), sm: theme.spacing(4) } }}>
            {/* Title */}
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: { xs: "22px", sm: "26px" },
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#1D1D1F",
                marginBottom: theme.spacing(2.5),
                lineHeight: 1.2,
              }}
            >
              Baraka Books
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                fontSize: { xs: "15px", sm: "16px" },
                fontWeight: 400,
                color: "#1D1D1F",
                letterSpacing: "-0.01em",
                lineHeight: 1.6,
                marginBottom: theme.spacing(3),
              }}
            >
              An independent bookstore in Bastrop, Texas, just outside Austin, owned by Marcus. 
              Located on historic Main Street, featuring a curated selection of philosophy, history, 
              and self-improvement books. Every book is personally recommended by Marcus.
            </Typography>

            {/* Address & Contact Info */}
            <Stack spacing={1.5}>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#1D1D1F",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.5,
                }}
              >
                <strong>Address:</strong> 912 Main St, Bastrop, TX 78602
              </Typography>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#1D1D1F",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.5,
                }}
              >
                <strong>Phone:</strong> +1 512-412-6085
              </Typography>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#1D1D1F",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.5,
                }}
              >
                <strong>Website:</strong> marcustore.com
              </Typography>
            </Stack>

            {/* Hours */}
            <Box sx={{ marginTop: theme.spacing(3), paddingTop: theme.spacing(3), borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1D1D1F",
                  letterSpacing: "-0.01em",
                  marginBottom: theme.spacing(1.5),
                }}
              >
                Hours
              </Typography>
              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Mon–Thu: 10 AM – 7 PM
                </Typography>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Fri–Sat: 10 AM – 8 PM
                </Typography>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Sun: 10 AM – 7 PM
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Dialog>
    </Box>
  );
}
