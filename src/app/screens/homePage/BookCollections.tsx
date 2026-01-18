import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewDishes, retrievePopularDishes, retrieveFeaturedDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { ProductType } from "../../../lib/enums/product.enum";
import { normalizeImagePath } from "../../../lib/config";
import { useHistory, useLocation } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

const getCategoryLabel = (collection: ProductType): string => {
  const labels: Record<ProductType, string> = {
    [ProductType.FICTION]: "FICTION",
    [ProductType.ACADEMIC]: "ACADEMIC",
    [ProductType.NON_FICTION]: "NON_FICTION",
    [ProductType.COMIC]: "COMIC",
    [ProductType.OTHER]: "OTHER",
  };
  return labels[collection] || "NEW ARRIVAL";
};

const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({
  newDishes,
}));

const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({
    popularDishes,
  })
);

const featuredDishesRetriever = createSelector(
  retrieveFeaturedDishes,
  (featuredDishes) => ({
    featuredDishes,
  })
);

type TabType = "new" | "bestseller" | "featured";

export default function BookCollections() {
  const { newDishes } = useSelector(newDishesRetriever);
  const { popularDishes } = useSelector(popularDishesRetriever);
  const { featuredDishes } = useSelector(featuredDishesRetriever);
  const location = useLocation();
  const history = useHistory();
  
  const getInitialTab = (): TabType => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "bestseller" || tab === "featured") {
      return tab as TabType;
    }
    return "new";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "bestseller" || tab === "featured") {
      setActiveTab(tab as TabType);
    } else if (tab === "new") {
      setActiveTab("new");
    }
  }, [location.search]);

  const getActiveProducts = (): Product[] => {
    switch (activeTab) {
      case "new":
        return newDishes;
      case "bestseller":
        return popularDishes;
      case "featured":
        return featuredDishes; // Less popular books
      default:
        return newDishes;
    }
  };

  const products = getActiveProducts();

  const handleProductClick = (id: string) => {
    history.push(`/products/${id}`);
  };

  const handleExploreAll = () => {
    history.push("/products");
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Removed navigation - buttons only filter on the same page

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
            marginBottom: { xs: "40px", md: "60px" },
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
            BOOK COLLECTIONS
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "15px", md: "17px" },
              fontWeight: 400,
              color: "#86868b",
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Explore our handpicked selections ranging from timeless literature to
            contemporary bestsellers across diverse genres.
          </Typography>
        </Box>

        {/* Tabs Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: { xs: "40px", md: "60px" },
            flexWrap: "wrap",
          }}
        >
          <Button
            variant={activeTab === "new" ? "contained" : "outlined"}
            onClick={() => {
              setActiveTab("new");
            }}
            sx={{
              minWidth: "140px",
              height: "44px",
              borderRadius: "22px",
              fontFamily: appleFont,
              fontSize: "17px",
              fontWeight: activeTab === "new" ? 600 : 500,
              textTransform: "none",
              letterSpacing: "-0.01em",
              padding: "0 28px",
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              border: "1.5px solid rgba(0, 0, 0, 0.08)",
              background:
                activeTab === "new" ? "#007AFF" : "#ffffff",
              color: activeTab === "new" ? "#ffffff" : "#1d1d1f",
              boxShadow:
                activeTab === "new"
                  ? "0 2px 10px rgba(0, 122, 255, 0.3)"
                  : "0 1px 3px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                background: activeTab === "new" ? "#0051D5" : "#f5f5f7",
                borderColor: activeTab === "new" ? "#007AFF" : "rgba(0, 0, 0, 0.12)",
                boxShadow:
                  activeTab === "new"
                    ? "0 4px 16px rgba(0, 122, 255, 0.35)"
                    : "0 2px 8px rgba(0, 0, 0, 0.08)",
                transform: "translateY(-1px) scale(1.02)",
              },
            }}
          >
            New Arrival
          </Button>

          <Button
            variant={activeTab === "bestseller" ? "contained" : "outlined"}
            onClick={() => {
              setActiveTab("bestseller");
            }}
            sx={{
              minWidth: "140px",
              height: "44px",
              borderRadius: "22px",
              fontFamily: appleFont,
              fontSize: "17px",
              fontWeight: activeTab === "bestseller" ? 600 : 500,
              textTransform: "none",
              letterSpacing: "-0.01em",
              padding: "0 28px",
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              border: "1.5px solid rgba(0, 0, 0, 0.08)",
              background:
                activeTab === "bestseller" ? "#007AFF" : "#ffffff",
              color: activeTab === "bestseller" ? "#ffffff" : "#1d1d1f",
              boxShadow:
                activeTab === "bestseller"
                  ? "0 2px 10px rgba(0, 122, 255, 0.3)"
                  : "0 1px 3px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                background: activeTab === "bestseller" ? "#0051D5" : "#f5f5f7",
                borderColor: activeTab === "bestseller" ? "#007AFF" : "rgba(0, 0, 0, 0.12)",
                boxShadow:
                  activeTab === "bestseller"
                    ? "0 4px 16px rgba(0, 122, 255, 0.35)"
                    : "0 2px 8px rgba(0, 0, 0, 0.08)",
                transform: "translateY(-1px) scale(1.02)",
              },
            }}
          >
            Best Seller
          </Button>

          <Button
            variant={activeTab === "featured" ? "contained" : "outlined"}
            onClick={() => {
              setActiveTab("featured");
            }}
            sx={{
              minWidth: "140px",
              height: "44px",
              borderRadius: "22px",
              fontFamily: appleFont,
              fontSize: "17px",
              fontWeight: activeTab === "featured" ? 600 : 500,
              textTransform: "none",
              letterSpacing: "-0.01em",
              padding: "0 28px",
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              border: "1.5px solid rgba(0, 0, 0, 0.08)",
              background:
                activeTab === "featured" ? "#007AFF" : "#ffffff",
              color: activeTab === "featured" ? "#ffffff" : "#1d1d1f",
              boxShadow:
                activeTab === "featured"
                  ? "0 2px 10px rgba(0, 122, 255, 0.3)"
                  : "0 1px 3px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                background: activeTab === "featured" ? "#0051D5" : "#f5f5f7",
                borderColor: activeTab === "featured" ? "#007AFF" : "rgba(0, 0, 0, 0.12)",
                boxShadow:
                  activeTab === "featured"
                    ? "0 4px 16px rgba(0, 122, 255, 0.35)"
                    : "0 2px 8px rgba(0, 0, 0, 0.08)",
                transform: "translateY(-1px) scale(1.02)",
              },
            }}
          >
            Featured
          </Button>
        </Box>

        {/* Products Grid - 4 columns, 4 rows */}
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
            marginBottom: "60px",
          }}
        >
          {products.length > 0 ? (
            products.map((product: Product) => {
              const imagePath = normalizeImagePath(product.productImages?.[0]);
              const categoryLabel = getCategoryLabel(product.productType);

              return (
                <Paper
                  key={product._id}
                  elevation={0}
                  onClick={() => handleProductClick(product._id)}
                  sx={{
                    borderRadius: "32px",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {/* Image Section with aspect ratio */}
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
                        WebkitBackdropFilter: "blur(15px)",
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
                        color: "#1D1D1F",
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
                        lineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.productName}
                    </Typography>

                    {/* Author */}
                    {product.productAuthor && (
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#1D1D1F",
                          lineHeight: 1.4,
                          marginTop: "4px",
                        }}
                      >
                        by {product.productAuthor}
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
                          color: "#1D1D1F",
                        }}
                      >
                        {product.productViews}
                      </Typography>
                      <VisibilityIcon
                        sx={{
                          fontSize: "18px",
                          color: "#1D1D1F",
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
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                color: "#86868b",
                fontFamily: appleFont,
                fontSize: "18px",
              }}
            >
              No products available
            </Box>
          )}
        </Box>

        {/* Explore All Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleExploreAll}
            sx={{
              minWidth: "160px",
              height: "48px",
              borderRadius: "24px",
              fontFamily: appleFont,
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "-0.01em",
              padding: "0 32px",
              background: "#007AFF",
              color: "#ffffff",
              boxShadow: "0 2px 10px rgba(0, 122, 255, 0.3)",
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              "&:hover": {
                background: "#0051D5",
                boxShadow: "0 4px 16px rgba(0, 122, 255, 0.35)",
                transform: "translateY(-2px) scale(1.02)",
              },
              "&:active": {
                transform: "translateY(0) scale(0.98)",
              },
            }}
          >
            Explore All
            <ArrowForwardIcon sx={{ marginLeft: "8px", fontSize: "20px" }} />
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
