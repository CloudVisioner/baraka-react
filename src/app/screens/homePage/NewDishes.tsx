import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { normalizeImagePath } from "../../../lib/config";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

/** REDUX SLICE & SELECTOR */
const newDishesRetriever = createSelector(
  retrieveNewDishes,
  (newDishes) => ({ newDishes })
);

const getCategoryLabel = (collection: ProductCollection): string => {
  const labels: Record<ProductCollection, string> = {
    [ProductCollection.DISH]: "FICTION",
    [ProductCollection.SALAD]: "ACADEMIC",
    [ProductCollection.DRINK]: "REFERENCE",
    [ProductCollection.DESSERT]: "LITERATURE",
    [ProductCollection.OTHER]: "NEW ARRIVAL",
  };
  return labels[collection] || "NEW ARRIVAL";
};

export default function NewDishes() {
  const { newDishes } = useSelector(newDishesRetriever);

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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
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
              textAlign: "center",
            }}
          >
            New Arrivals
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: "24px",
            width: "100%",
          }}
        >
          {newDishes.length !== 0 ? (
            newDishes.map((product: Product) => {
              const imagePath = normalizeImagePath(product.productImages?.[0]);
              const categoryLabel = getCategoryLabel(product.productCollection);

              return (
                <Paper
                  key={product._id}
                  elevation={0}
                  sx={{
                    borderRadius: "32px",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.4s cubic-bezier(0.2, 1, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  {/* Image Section with shorter aspect ratio */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "4/5",
                      overflow: "hidden",
                      backgroundColor: "#F5F5F7",
                    }}
                  >
                    <img
                      src={imagePath}
                      alt={product.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Floating Price Pill - Top Right */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        backdropFilter: "blur(15px)",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          color: "#1D1D1F",
                        }}
                      >
                        ${product.productPrice}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content Section */}
                  <Box
                    sx={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      flex: 1,
                      position: "relative",
                    }}
                  >
                    {/* Category Label - Top */}
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "#6E6E73",
                      }}
                    >
                      {categoryLabel}
                    </Typography>

                    {/* Title */}
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "#1D1D1F",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.productName}
                    </Typography>

                    {/* Description */}
                    {product.productDesc && (
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.875rem",
                          fontWeight: 400,
                          color: "#6E6E73",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flex: 1,
                        }}
                      >
                        {product.productDesc}
                      </Typography>
                    )}

                    {/* Views Count - Right Bottom */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        marginTop: "auto",
                        gap: "4px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.875rem",
                          fontWeight: 400,
                          color: "#6E6E73",
                        }}
                      >
                        {product.productViews}
                      </Typography>
                      <VisibilityIcon
                        sx={{
                          fontSize: "18px",
                          color: "#6E6E73",
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              );
            })
          ) : (
            <Box
              sx={{
                gridColumn: { xs: "1 / -1", sm: "1 / -1", md: "1 / -1" },
                width: "100%",
                minHeight: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: appleFont,
                fontSize: "1.375rem",
                fontWeight: 500,
                color: "#86868B",
                letterSpacing: "-0.02em",
                textAlign: "center",
                padding: "60px 24px",
              }}
            >
              New products are not available!
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
