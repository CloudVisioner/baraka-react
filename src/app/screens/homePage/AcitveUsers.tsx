import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { normalizeImagePath, serverApi } from "../../../lib/config";
import ProductService from "../../services/ProductService";
import { Product } from "../../../lib/types/product";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

// Book of the Month interface (from backend API)
interface BookOfTheMonth {
  _id: string;
  productId: string;
  productName: string;
  productAuthor: string | null;
  productImage: string;
  whyRead: string;
  isActive: boolean;
  month: string;
}

export default function ActiveUsers() {
  const [bookOfTheMonth, setBookOfTheMonth] = useState<BookOfTheMonth | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const theme = useTheme();

  useEffect(() => {
    // TODO: Replace with backend API call once implemented
    // Backend endpoint: GET /book-of-the-month/current
    const fetchBookOfTheMonth = async () => {
      try {
        // Backend API call (commented out until backend is ready)
        // const response = await axios.get(`${serverApi}/book-of-the-month/current`);
        // if (response.data.success && response.data.data) {
        //   setBookOfTheMonth(response.data.data);
        //   setLoading(false);
        //   return;
        // }

        // Temporary: Fetch the most popular book until backend is ready
        const product = new ProductService();
        const data = await product.getProducts({
          page: 1,
          limit: 1,
          order: "productViews",
        });

        if (data && data.length > 0) {
          // Transform Product to BookOfTheMonth format for compatibility
          const productData = data[0];
          setBookOfTheMonth({
            _id: productData._id,
            productId: productData._id,
            productName: productData.productName,
            productAuthor: productData.productAuthor || null,
            productImage: productData.productImages?.[0] || "",
            whyRead: productData.productDesc || "This exceptional book offers profound insights and captivating storytelling that will leave you inspired and enriched. A must-read for anyone seeking knowledge and entertainment.",
            isActive: true,
            month: new Date().toISOString().slice(0, 7), // YYYY-MM format
          });
        }
      } catch (error) {
        console.error("Error fetching Book of the Month:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookOfTheMonth();
  }, []);

  const handleSeeMore = () => {
    if (bookOfTheMonth) {
      history.push(`/products/${bookOfTheMonth.productId}`);
    }
  };

  const imagePath = bookOfTheMonth?.productImage
    ? normalizeImagePath(bookOfTheMonth.productImage)
    : "/img/noimage-list.svg";

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FBFBFB",
        padding: { xs: "80px 24px", md: "120px 40px" },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            marginBottom: { xs: "48px", md: "64px" },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "2rem", md: "2.75rem" },
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#1D1D1F",
              marginBottom: "16px",
            }}
          >
            Book of the Month
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "15px", md: "17px" },
              fontWeight: 400,
              color: "#1D1D1F",
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              maxWidth: "700px",
              margin: "0 auto",
              opacity: 0.8,
            }}
          >
            A carefully curated recommendation from our bookstore owner
          </Typography>
        </Box>

        {/* Book of the Month Card */}
        {loading ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "500px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#6E6E73",
              }}
            >
              Loading...
            </Typography>
          </Box>
        ) : bookOfTheMonth ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1.5fr",
              },
              gap: { xs: theme.spacing(4), md: theme.spacing(6) },
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: { xs: theme.spacing(4), md: theme.spacing(6) },
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }}
          >
            {/* Book Image Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: "280px", md: "400px" },
                  aspectRatio: "2/3",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "#F5F5F7",
                  cursor: "pointer",
                  transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
                  "&:hover": {
                    transform: "translateY(-12px) scale(1.05)",
                    boxShadow: "0 20px 48px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={imagePath}
                  alt={bookOfTheMonth?.productName || "Book of the Month"}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
                {/* Hover Overlay Effect */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%)",
                    opacity: 0,
                    transition: "opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    pointerEvents: "none",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Book Information Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: theme.spacing(3),
              }}
            >
              {/* Owner's Recommendation Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: theme.spacing(1),
                  backgroundColor: "#007AFF",
                  color: "#FFFFFF",
                  padding: theme.spacing(0.75, 2),
                  borderRadius: "20px",
                  width: "fit-content",
                  marginBottom: theme.spacing(1),
                }}
              >
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  Recommended by Owner
                </Typography>
              </Box>

              {/* Book Title */}
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#1D1D1F",
                  lineHeight: 1.2,
                }}
              >
                {bookOfTheMonth.productName}
              </Typography>

              {/* Author */}
              {bookOfTheMonth.productAuthor && (
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    fontWeight: 500,
                    color: "#6E6E73",
                    letterSpacing: "-0.01em",
                  }}
                >
                  by {bookOfTheMonth.productAuthor}
                </Typography>
              )}

              {/* Owner's Recommendation Text */}
              <Box
                sx={{
                  backgroundColor: "#F5F5F7",
                  borderRadius: "16px",
                  padding: theme.spacing(3),
                  borderLeft: "4px solid #007AFF",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 500,
                    color: "#1D1D1F",
                    marginBottom: theme.spacing(1),
                    letterSpacing: "-0.01em",
                  }}
                >
                  Why You Should Read This Book
                </Typography>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: { xs: "14px", md: "15px" },
                    fontWeight: 400,
                    color: "#1D1D1F",
                    lineHeight: 1.7,
                    letterSpacing: "-0.01em",
                    opacity: 0.85,
                  }}
                >
                  {bookOfTheMonth.whyRead || "This exceptional book offers profound insights and captivating storytelling that will leave you inspired and enriched. A must-read for anyone seeking knowledge and entertainment."}
                </Typography>
              </Box>

              {/* See More Button */}
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleSeeMore}
                sx={{
                  fontFamily: appleFont,
                  fontSize: { xs: "16px", md: "17px" },
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: { xs: theme.spacing(1.5, 3), md: theme.spacing(1.75, 4) },
                  backgroundColor: "#007AFF",
                  color: "#FFFFFF",
                  marginTop: theme.spacing(2),
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "100%", sm: "300px" },
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  "&:hover": {
                    backgroundColor: "#0051D5",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0, 122, 255, 0.4)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                See More Details
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              minHeight: "500px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: theme.spacing(6),
            }}
          >
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#6E6E73",
                textAlign: "center",
              }}
            >
              Book of the Month coming soon...
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
