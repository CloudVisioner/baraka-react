import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";

import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductType } from "../../../lib/enums/product.enum";
import { normalizeImagePath } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductPageProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductPageProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productType: ProductType.FICTION,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [editorPicks, setEditorPicks] = useState<Product[]>([]);
  const [animatingItem, setAnimatingItem] = useState<{ id: string; from: { x: number; y: number }; to: { x: number; y: number } } | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const cartIconRef = useRef<HTMLElement | null>(null);
  const history = useHistory();
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Auto-reset to page 1 when filters change and current page would be empty
  // Use a ref to track previous filter values to detect actual filter changes
  const prevFiltersRef = useRef<{ search: string; productType: ProductType; order: string }>({
    search: productSearch.search || "",
    productType: productSearch.productType || ProductType.FICTION,
    order: productSearch.order || "createdAt",
  });

  useEffect(() => {
    const currentFilters = {
      search: productSearch.search || "",
      productType: productSearch.productType || ProductType.FICTION,
      order: productSearch.order || "createdAt",
    };

    const filtersChanged = 
      prevFiltersRef.current.search !== currentFilters.search ||
      prevFiltersRef.current.productType !== currentFilters.productType ||
      prevFiltersRef.current.order !== currentFilters.order;

    if (filtersChanged) {
      prevFiltersRef.current = currentFilters;
      // Filters changed - reset to page 1 if not already there
      // Also reset totalPages to allow recalculation
      if (productSearch.page !== 1) {
        setProductSearch(prev => ({ ...prev, page: 1 }));
      }
      setTotalPages(1); // Reset to allow recalculation
      setHasReachedEnd(false);
    } else {
      // No filter change, but check if current page is invalid
      if (products.length === 0 && productSearch.page > 1 && totalPages === 0) {
        // Empty results and we're not on page 1 - reset to page 1
        setProductSearch(prev => ({ ...prev, page: 1 }));
      } else if (products.length > 0 && totalPages > 0 && productSearch.page > totalPages) {
        // Current page exceeds total pages - reset to last valid page
        setProductSearch(prev => ({ ...prev, page: totalPages }));
      }
    }
  }, [productSearch.search, productSearch.productType, productSearch.order, products.length, totalPages, productSearch.page]);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => {
        setProducts(data);
        // Calculate total pages based on results
        // If we get fewer products than the limit, we're on the last page
        const isLastPage = data.length < productSearch.limit;
        setHasReachedEnd(isLastPage);
        
        if (data.length === 0) {
          // No products on this page
          if (productSearch.page === 1) {
            // No products at all - set to 0 pages
            setTotalPages(0);
          } else {
            // We're on a page beyond the last page - set totalPages to previous page
            setTotalPages(Math.max(1, productSearch.page - 1));
          }
        } else if (isLastPage) {
          // We're on the last page, so total pages = current page
          setTotalPages(productSearch.page);
        } else {
          // We got a full page, so there might be more pages
          // Set to at least current page + 1 (will be adjusted if next page is empty)
          // Don't decrease totalPages if we already have a higher value
          setTotalPages(prev => Math.max(prev, productSearch.page + 1));
        }
      })
      .catch(() => {
        setProducts([]);
        setTotalPages(0);
        setHasReachedEnd(true);
      });
  }, [productSearch]);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        search: "",
      })
      .then((data) => setEditorPicks(data.slice(0, 4)))
      .catch(() => {});
  }, []);
  const searchCollectionHandler = (collection: ProductType) => {
    setProductSearch({ 
      ...productSearch, 
      page: 1,
      productType: collection 
    });
  };

  const searchOrderHandler = (order: string) => {
    setProductSearch({ 
      ...productSearch, 
      page: 1,
      order: order 
    });
  };

  const searchProductHandler = () => {
    setProductSearch({ 
      ...productSearch, 
      page: 1,
      search: searchText 
    });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    // Validate page number
    if (value < 1 || (totalPages > 0 && value > totalPages)) {
      return;
    }
    
    // Update page - this will trigger the useEffect to fetch new products
    setProductSearch({ 
      ...productSearch, 
      page: value 
    });
    
    // Smooth scroll to products section so user can see the updated products
    // Only scroll if the products section is not already in viewport
    // This prevents fighting with user's own scroll actions
    setTimeout(() => {
      if (productsSectionRef.current) {
        const rect = productsSectionRef.current.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight;
        
        // Only scroll if products section is not visible or is far from top
        if (!isInViewport || rect.top > 200) {
          productsSectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }
      }
    }, 100);
    
    // Focus stays on the pagination button that was clicked (default behavior)
    // No need to force focus elsewhere
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  const handleAddToBasket = (product: Product, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const fromX = buttonRect.left + buttonRect.width / 2;
    const fromY = buttonRect.top + buttonRect.height / 2;
    
    const cartIcon = document.querySelector('[aria-label="cart"]') as HTMLElement;
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      const toX = cartRect.left + cartRect.width / 2;
      const toY = cartRect.top + cartRect.height / 2;
      
      setAnimatingItem({
        id: product._id,
        from: { x: fromX, y: fromY },
        to: { x: toX, y: toY },
      });
      
      setTimeout(() => {
        const cartItem: CartItem = {
          _id: product._id,
          quantity: 1,
          name: product.productName,
          price: product.productPrice,
          image: product.productImages?.[0] || "",
        };
        onAdd(cartItem);
        setAnimatingItem(null);
      }, 1000);
    } else {
      const cartItem: CartItem = {
        _id: product._id,
        quantity: 1,
        name: product.productName,
        price: product.productPrice,
        image: product.productImages?.[0] || "",
      };
      onAdd(cartItem);
    }
  };

  const handleCardClick = (id: string) => {
    history.push(`/products/${id}`);
  };

  const handleEditorPickClick = (id: string) => {
    history.push(`/products/${id}`);
  };

  const getAuthor = (product: Product): string => {
    return product.productAuthor || "Featured Author";
  };

  const getEditorialNote = (product: Product): string => {
    const notes = [
      "A timeless classic that deserves a place on every shelf.",
      "Thought-provoking narrative that challenges conventional wisdom.",
      "Beautifully written with rich character development throughout.",
      "Essential reading for anyone interested in contemporary literature.",
      "An engaging story that keeps readers turning pages.",
      "Masterfully crafted with attention to detail and depth.",
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  };

  return (
    <div className={"products"}>
      {/* Flying Cart Icon Animation */}
      {animatingItem && (
        <>
          <style>{`
            @keyframes flyToCart {
              0% {
                left: ${animatingItem.from.x}px;
                top: ${animatingItem.from.y}px;
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
              }
              50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.1) rotate(180deg);
              }
              100% {
                left: ${animatingItem.to.x}px;
                top: ${animatingItem.to.y}px;
                opacity: 0.8;
                transform: translate(-50%, -50%) scale(0.8) rotate(360deg);
              }
            }
          `}</style>
          <Box
            sx={{
              position: "fixed",
              left: `${animatingItem.from.x}px`,
              top: `${animatingItem.from.y}px`,
              width: "48px",
              height: "48px",
              zIndex: 9999,
              pointerEvents: "none",
              animation: "flyToCart 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              filter: "drop-shadow(0 4px 8px rgba(0, 122, 255, 0.4))",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#007AFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0, 122, 255, 0.3)",
              }}
            >
              <img
                src="/icons/shopping-cart.svg"
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  filter: "brightness(0) invert(1)",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </>
      )}

      <Container>
        <Stack className="products-header-section">
          <Box className={"res-name"}>Baraka Bookstore</Box>
        </Stack>

        <Stack className="search-section">
              <Stack className="search" direction="row" alignItems="center">
            <SearchIcon className="search-icon" />
                <input
                  id="myInput"
                  type="text"
                  className="search-input"
              placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchProductHandler();
                  }}
                />
                <Button
                  variant="contained"
                  className="search-button"
                  onClick={() => searchProductHandler()}
                >
              Search
                </Button>
          </Stack>
        </Stack>

        <Stack className="controls-section">
          <Stack className="category-filters">
            <Button
              variant={productSearch.productType === ProductType.OTHER ? "contained" : "outlined"}
              className={`category-btn ${productSearch.productType === ProductType.OTHER ? "active" : ""}`}
              onClick={() => searchCollectionHandler(ProductType.OTHER)}
            >
              Other
            </Button>
            <Button
              variant={productSearch.productType === ProductType.NON_FICTION ? "contained" : "outlined"}
              className={`category-btn ${productSearch.productType === ProductType.NON_FICTION ? "active" : ""}`}
              onClick={() => searchCollectionHandler(ProductType.NON_FICTION)}
            >
              Non-Fiction
            </Button>
            <Button
              variant={productSearch.productType === ProductType.ACADEMIC ? "contained" : "outlined"}
              className={`category-btn ${productSearch.productType === ProductType.ACADEMIC ? "active" : ""}`}
              onClick={() => searchCollectionHandler(ProductType.ACADEMIC)}
            >
              Academic
            </Button>
            <Button
              variant={productSearch.productType === ProductType.COMIC ? "contained" : "outlined"}
              className={`category-btn ${productSearch.productType === ProductType.COMIC ? "active" : ""}`}
              onClick={() => searchCollectionHandler(ProductType.COMIC)}
            >
              Comic
            </Button>
            <Button
              variant={productSearch.productType === ProductType.FICTION ? "contained" : "outlined"}
              className={`category-btn ${productSearch.productType === ProductType.FICTION ? "active" : ""}`}
              onClick={() => searchCollectionHandler(ProductType.FICTION)}
            >
              Fiction
            </Button>
          </Stack>

          <Stack className="sort-filters">
            <Button
              variant={productSearch.order === "createdAt" ? "contained" : "outlined"}
              className={`order-btn ${productSearch.order === "createdAt" ? "active" : ""}`}
              onClick={() => searchOrderHandler("createdAt")}
            >
              New
            </Button>
            <Button
              variant={productSearch.order === "productPrice" ? "contained" : "outlined"}
              className={`order-btn ${productSearch.order === "productPrice" ? "active" : ""}`}
              onClick={() => searchOrderHandler("productPrice")}
            >
              Price
            </Button>
            <Button
              variant={productSearch.order === "productViews" ? "contained" : "outlined"}
              className={`order-btn ${productSearch.order === "productViews" ? "active" : ""}`}
              onClick={() => searchOrderHandler("productViews")}
            >
              Views
            </Button>
          </Stack>
        </Stack>

        {/* Products Grid Section */}
        <Box 
          ref={productsSectionRef}
          className="products-section" 
          sx={{ 
            width: "100%", 
            marginBottom: theme.spacing(6),
          }}
        >
          {/* Aria-live region for screen reader announcements */}
          <Box
            component="div"
            aria-live="polite"
            aria-atomic="true"
            sx={{
              position: "absolute",
              left: "-10000px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            {products.length > 0 && (
              <span>
                Page {productSearch.page} of {totalPages}, {products.length} {products.length === 1 ? 'product' : 'products'} loaded
              </span>
            )}
          </Box>

          {products.length !== 0 ? (
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gridTemplateRows: "repeat(2, auto)",
                  gap: { xs: theme.spacing(2), sm: theme.spacing(3), md: theme.spacing(3), lg: theme.spacing(4) },
                  width: "100%",
                  margin: 0,
                  justifyItems: "center",
                }}
              >
                {products.map((product, index) => {
                const imagePath = normalizeImagePath(product.productImages?.[0]);
                return (
                    <Box
                      key={product._id || index}
                      sx={{
                        width: "100%",
                        maxWidth: "280px",
                        minWidth: "260px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                  <Stack
                    className="product-card"
                    onClick={() => handleCardClick(product._id)}
                    sx={{
                      width: "100%",
                      maxWidth: "280px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 0,
                      cursor: "pointer",
                    }}
                  >
                    <Stack
                      className="product-img"
                      sx={{ backgroundImage: `url(${imagePath})` }}
                    >
                      <Button
                        className="shop-btn"
                        onClick={(e) => handleAddToBasket(product, e)}
                      >
                        <img
                          src="/icons/shopping-cart.svg"
                          style={{ display: "flex" }}
                          alt="cart"
                        />
                      </Button>
                    </Stack>

                      <Box className="product-info" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <span className="product-title">
                        {product.productName}
                      </span>

                        {product.productAuthor && (
                          <p className="product-description" style={{ color: "#1D1D1F", fontWeight: 500, marginTop: "4px" }}>
                            by {product.productAuthor}
                          </p>
                        )}

                        <Stack 
                          className="product-footer" 
                          direction="row" 
                          justifyContent="space-between" 
                          alignItems="center"
                          sx={{ marginTop: "auto" }}
                        >
                          <Stack className="product-views" direction="row" alignItems="center" spacing={0.5}>
                            <RemoveRedEyeIcon className="views-icon" />
                            <span className="views-count">{product.productViews || 0}</span>
                          </Stack>
                          
                          <Stack className="product-price" direction="row" alignItems="center" spacing={0.5}>
                            <span className="price-currency">$</span>
                            <span className="price-value">{product.productPrice}</span>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                    </Box>
                  );
                })}
              </Box>
            </Container>
            ) : (
            <Box
              className="no-data"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                minHeight: "400px",
                padding: theme.spacing(8, 4),
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  fontSize: { xs: "28px", md: "36px" },
                  fontWeight: 600,
                  color: "#1D1D1F",
                  marginBottom: theme.spacing(3),
                  letterSpacing: "-0.02em",
                }}
              >
                Products are not available
              </Typography>
              <Typography
                sx={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  fontSize: { xs: "17px", md: "19px" },
                  fontWeight: 400,
                  color: "#6E6E73",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
              </Typography>
            </Box>
            )}
        </Box>

        {/* Pagination Section - Only show when products exist and totalPages > 0 */}
        {products.length > 0 && totalPages > 0 && (
          <Box
            component="nav"
            aria-label="Products pagination"
            className="pagination-section"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: theme.spacing(4, 0),
              minHeight: "80px",
              position: "relative",
            }}
          >
            <Pagination
              count={totalPages}
              page={productSearch.page}
              renderItem={(item) => {
                // Add aria-current="page" to the active page button
                const isActivePage = item.type === 'page' && item.page === productSearch.page;
                
                // Disable Previous button on page 1
                if (item.type === 'previous' && productSearch.page === 1) {
                  return (
                    <PaginationItem
                      {...item}
                      disabled
                      aria-label="Previous page"
                      components={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon,
                      }}
                    />
                  );
                }
                // Disable Next button on last page
                if (item.type === 'next' && (productSearch.page >= totalPages || hasReachedEnd)) {
                  return (
                    <PaginationItem
                      {...item}
                      disabled
                      aria-label="Next page"
                      components={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon,
                      }}
                    />
                  );
                }
                // Active page button with aria-current
                if (isActivePage) {
                  return (
                    <PaginationItem
                      {...item}
                      aria-current="page"
                      aria-label={`Page ${item.page}, current page`}
                      components={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon,
                      }}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#007AFF',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#0051D5',
                          },
                        },
                      }}
                    />
                  );
                }
                // Regular page buttons
                if (item.type === 'page') {
                  return (
                    <PaginationItem
                      {...item}
                      aria-label={`Go to page ${item.page}`}
                      components={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon,
                      }}
                    />
                  );
                }
                // Previous/Next buttons
                return (
                  <PaginationItem
                    {...item}
                    aria-label={item.type === 'previous' ? 'Previous page' : 'Next page'}
                    components={{
                      previous: ArrowBackIcon,
                      next: ArrowForwardIcon,
                    }}
                  />
                );
              }}
              onChange={paginationHandler}
              className="products-pagination"
              sx={{
                '& .MuiPaginationItem-root': {
                  minWidth: '40px',
                  height: '40px',
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 122, 255, 0.08)',
                  },
                },
                '& .MuiPaginationItem-iconButton': {
                  minWidth: '40px',
                  height: '40px',
                },
              }}
            />
          </Box>
        )}
      </Container>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FBFBFB",
          padding: { xs: theme.spacing(10, 2), md: theme.spacing(15, 4) },
          marginTop: theme.spacing(8),
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              textAlign: "center",
              marginBottom: { xs: theme.spacing(6), md: theme.spacing(8) },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#1D1D1F",
                marginBottom: theme.spacing(2),
              }}
            >
              Editor's Picks
            </Typography>
            <Typography
              sx={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                fontSize: { xs: "15px", md: "17px" },
                fontWeight: 400,
                color: "#1D1D1F",
                letterSpacing: "-0.01em",
                lineHeight: 1.6,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Handpicked selections from our editorial team, featuring standout titles
              that inspire, educate, and entertain.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: theme.spacing(3),
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: theme.spacing(2),
              scrollBehavior: "smooth",
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
              [theme.breakpoints.up("md")]: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: theme.spacing(4),
                overflowX: "visible",
              },
            }}
          >
            {editorPicks.map((product) => {
              const imagePath = normalizeImagePath(product.productImages?.[0]);
              const author = getAuthor(product);
              const editorialNote = getEditorialNote(product);
              const rating = Math.min(5, Math.max(4, (product.productViews / 100) + 4));

              return (
                <Card
                  key={product._id}
                  elevation={0}
                  onClick={() => handleEditorPickClick(product._id)}
                  sx={{
                    minWidth: { xs: "280px", sm: "300px" },
                    maxWidth: { xs: "280px", sm: "300px" },
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    cursor: "pointer",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
                    transition: theme.transitions.create(
                      ["transform", "box-shadow"],
                      {
                        duration: theme.transitions.duration.standard,
                        easing: theme.transitions.easing.easeOut,
                      }
                    ),
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
                    },
                    [theme.breakpoints.up("md")]: {
                      minWidth: "100%",
                      maxWidth: "100%",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "2/3",
                      overflow: "hidden",
                      borderRadius: "16px 16px 0 0",
                      backgroundColor: "#F5F5F7",
                      position: "relative",
                    }}
                  >
                    <img
                      src={imagePath}
                      alt={product.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
            />
          </Box>

                  <CardContent
                    sx={{
                      padding: theme.spacing(3),
                      "&:last-child": {
                        paddingBottom: theme.spacing(3),
                      },
                    }}
                  >
                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        color: "#1D1D1F",
                        marginBottom: theme.spacing(0.5),
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.productName}
                    </Typography>

                    {/* Author */}
                    {product.productAuthor && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#1D1D1F",
                          marginBottom: theme.spacing(1.5),
                          letterSpacing: "-0.01em",
                        }}
                      >
                        by {product.productAuthor}
                      </Typography>
                    )}

                    {/* Star Rating */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(1),
                        marginBottom: theme.spacing(1.5),
                      }}
                    >
                      <Rating
                        value={rating}
                        readOnly
                        precision={0.5}
                        size="small"
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: "#1D1D1F",
                          },
                          "& .MuiRating-iconEmpty": {
                            color: "#D0D0D0",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "0.75rem",
                          color: "#1D1D1F",
                          fontWeight: 400,
                        }}
                      >
                        {rating.toFixed(1)}
                      </Typography>
                    </Box>

                    {/* Editorial Note */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                        fontSize: "0.875rem",
                        fontWeight: 400,
                        color: "#1D1D1F",
                        lineHeight: 1.5,
                        marginBottom: theme.spacing(2),
                        letterSpacing: "-0.01em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {editorialNote}
                    </Typography>

                    {/* CTA Button */}
                    <Button
                      variant="text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditorPickClick(product._id);
                      }}
                      sx={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#1D1D1F",
                        textTransform: "none",
                        padding: theme.spacing(0.75, 2),
                        borderRadius: "8px",
                        letterSpacing: "-0.01em",
                        transition: theme.transitions.create("background-color"),
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      Learn more
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Empty State */}
          {editorPicks.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                padding: theme.spacing(8, 2),
                color: "#1D1D1F",
              }}
            >
              <Typography
                sx={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                  fontSize: "1rem",
                  fontWeight: 400,
                }}
              >
                No editor's picks available at the moment.
              </Typography>
            </Box>
          )}
        </Container>
          </Box>

      {/* Delivery Info Panel Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          padding: { xs: theme.spacing(8, 2), md: theme.spacing(12, 4), lg: theme.spacing(15, 4) },
          marginTop: theme.spacing(8),
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: { xs: theme.spacing(6), lg: theme.spacing(8) },
              alignItems: { lg: "flex-start" },
            }}
          >
            {/* Left Side: Content Panel */}
            <Box
              sx={{
                flex: { lg: "1 1 0%" },
                display: "flex",
                flexDirection: "column",
                maxWidth: { lg: "500px" },
              }}
            >
              {/* Headline */}
              <Typography
                variant="h2"
                sx={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: "#1D1D1F",
                  marginBottom: theme.spacing(2),
                  lineHeight: 1.1,
                }}
              >
                Books, delivered where you are.
              </Typography>

              {/* Subtext */}
              <Typography
                sx={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                  fontSize: { xs: "15px", md: "17px" },
                  fontWeight: 400,
                  color: "#1D1D1F",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.6,
                  marginBottom: theme.spacing(6),
                }}
              >
                Fast, reliable delivery from our regional hubs.
              </Typography>

              {/* Info Blocks */}
              <Stack
                spacing={4}
                sx={{
                  marginBottom: theme.spacing(6),
                }}
              >
                {/* Coverage Block */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: theme.spacing(2),
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        color: "#1D1D1F",
                        fontSize: "24px",
                        marginTop: "2px",
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          marginBottom: theme.spacing(0.5),
                        }}
                      >
                        Coverage
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "17px",
                          fontWeight: 400,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.5,
                        }}
                      >
                        Available in 40+ cities
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "17px",
                          fontWeight: 400,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.5,
                        }}
                      >
                        Nationwide & selected international shipping
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Delivery Speed Block */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: theme.spacing(2),
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    <AccessTimeIcon
                      sx={{
                        color: "#1D1D1F",
                        fontSize: "24px",
                        marginTop: "2px",
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          marginBottom: theme.spacing(0.5),
                        }}
                      >
                        Delivery Speed
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "17px",
                          fontWeight: 400,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.5,
                        }}
                      >
                        Standard: 2–4 business days
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "17px",
                          fontWeight: 400,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.5,
                        }}
                      >
                        Express: Next-day in major cities
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Availability Block */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: theme.spacing(2),
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#1D1D1F",
                        fontSize: "24px",
                        marginTop: "2px",
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          marginBottom: theme.spacing(0.5),
                        }}
                      >
                        Availability
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "17px",
                          fontWeight: 400,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.5,
                        }}
                      >
                        Real-time stock by region
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          fontSize: "17px",
                          fontWeight: 400,
                          color: "#1D1D1F",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.5,
                        }}
                      >
                        Local hubs reduce delivery time
                      </Typography>
                    </Box>
                  </Box>
          </Box>
        </Stack>

              {/* Trust Signal */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1),
                  marginBottom: theme.spacing(5),
                  paddingTop: theme.spacing(2),
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <StarIcon
                  sx={{
                    color: "#1D1D1F",
                    fontSize: "18px",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                    fontSize: "17px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Trusted by 50,000+ readers
                </Typography>
              </Box>

              {/* CTA Button */}
              <Button
                variant="contained"
                onClick={() => {
                  window.open("https://maps.app.goo.gl/Q5dwZ44Ghv6iMqFB8", "_blank", "noopener,noreferrer");
                }}
                sx={{
                  alignSelf: { xs: "stretch", sm: "flex-start" },
                  minWidth: "180px",
                  height: "48px",
                  borderRadius: "24px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
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
                Check availability
              </Button>
            </Box>

            {/* Right Side: Map (Supporting Element) */}
            <Box
              id="delivery-map"
              onClick={() => {
                window.open("https://maps.app.goo.gl/Q5dwZ44Ghv6iMqFB8", "_blank", "noopener,noreferrer");
              }}
              sx={{
                flex: { lg: "1 1 0%" },
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "#F5F5F7",
                height: { xs: "400px", md: "500px", lg: "600px" },
                maxWidth: { lg: "100%" },
                position: "relative",
                scrollMarginTop: theme.spacing(4),
                cursor: "pointer",
                "&:hover": {
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    zIndex: 1,
                    transition: theme.transitions.create("background-color"),
                  },
                },
              }}
            >
            <iframe
                // To get the correct embed URL:
                // 1. Open https://maps.app.goo.gl/Q5dwZ44Ghv6iMqFB8 in your browser
                // 2. Click "Share" → "Embed a map"
                // 3. Copy the src URL from the iframe code
                // 4. Replace the src below with that URL
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1509.683087045884!2d29.008657870843044!3d41.04724859690466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab80b0afff1af%3A0x5cb1a4b5332e5310!2sCZN%20Burak%20Hazal%20Restaurant!5e0!3m2!1sen!2skw!4v1706368536124!5m2!1sen!2skw"
                width="100%"
                height="100%"
                style={{ 
                  border: "none", 
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                }}
              referrerPolicy="no-referrer-when-downgrade"
                title="Delivery Coverage Map"
                loading="lazy"
                allowFullScreen
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
