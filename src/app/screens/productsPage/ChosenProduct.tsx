import React, { useEffect, useState } from "react";
import { Container, Stack, Box, Typography, Button, TextField } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";

import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, setChosenProduct } from "./slice";
import { createSelector } from "reselect";
import { retrieveRestaurant, retrieveChosenProduct } from "./selector";
import { Product } from "../../../lib/types/product";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { normalizeImagePath } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({
    chosenProduct,
  })
);

const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({
    restaurant,
  })
);

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "info">("details");

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, []);

  if (!chosenProduct) return null;

  const imagePath = normalizeImagePath(chosenProduct.productImages?.[0]);
  const detailImagePath = chosenProduct.productImages?.[1] 
    ? normalizeImagePath(chosenProduct.productImages[1])
    : imagePath;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FBFBFB",
        minHeight: "100vh",
        padding: { xs: "40px 24px", md: "80px 40px" },
      }}
    >
      <Container maxWidth="lg">
        {/* Product Display Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 6 }}
          sx={{ marginBottom: "80px" }}
        >
          {/* Book Cover */}
          <Box
            sx={{
              width: { xs: "100%", md: "48%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "500px",
                aspectRatio: "3/4",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#F5F5F7",
              }}
            >
              <img
                src={imagePath}
                alt={chosenProduct.productName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Box>

          {/* Product Information */}
          <Box
            sx={{
              width: { xs: "100%", md: "52%" },
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Author */}
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "15px",
                fontWeight: 500,
                color: "#86868b",
                letterSpacing: "-0.01em",
              }}
            >
              By {restaurant?.memberNick || "Author"}
            </Typography>

            {/* Title */}
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: { xs: "32px", md: "40px" },
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#1D1D1F",
                lineHeight: 1.2,
              }}
            >
              {chosenProduct.productName}
            </Typography>

            {/* Rating & Views */}
            <Stack direction="row" alignItems="center" spacing={3}>
              <Rating
                name="product-rating"
                defaultValue={4.5}
                precision={0.5}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#FFD700",
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#86868b",
                }}
              >
                (10)
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <RemoveRedEyeIcon
                  sx={{ fontSize: "20px", color: "#86868b" }}
                />
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#86868b",
                  }}
                >
                  {chosenProduct.productViews || 0}
                </Typography>
              </Stack>
            </Stack>

            {/* Price */}
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#1D1D1F",
              }}
            >
              $ {chosenProduct.productPrice.toFixed(2)} USD
            </Typography>

            {/* Description */}
            {chosenProduct.productDesc && (
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#86868b",
                  lineHeight: 1.6,
                  letterSpacing: "-0.01em",
                }}
              >
                {chosenProduct.productDesc}
              </Typography>
            )}

            {/* Quantity & Add to Cart */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                inputProps={{ min: 1, style: { textAlign: "center" } }}
                sx={{
                  width: "80px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontFamily: appleFont,
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.2)",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={(e) => {
                  onAdd({
                    _id: chosenProduct._id,
                    quantity: quantity,
                    name: chosenProduct.productName,
                    price: chosenProduct.productPrice,
                    image: normalizeImagePath(chosenProduct.productImages?.[0]) || "",
                  });
                  e.stopPropagation();
                }}
                sx={{
                  minWidth: "180px",
                  height: "48px",
                  borderRadius: "12px",
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  background: "#007AFF",
                  color: "#ffffff",
                  boxShadow: "0 2px 10px rgba(0, 122, 255, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  "&:hover": {
                    background: "#0051D5",
                    boxShadow: "0 4px 16px rgba(0, 122, 255, 0.35)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                ADD TO CART
              </Button>
            </Stack>

            {/* Share & Payment Methods */}
            <Stack spacing={2} sx={{ marginTop: "8px" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1D1D1F",
                  }}
                >
                  Share:
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {[
                    { name: "Facebook", icon: "/icons/facebook.svg" },
                    { name: "Twitter", icon: "/icons/twitter.svg" },
                    { name: "Instagram", icon: "/icons/instagram.svg" },
                    { name: "YouTube", icon: "/icons/youtube.svg" },
                  ].map((social) => (
                    <Box
                      key={social.name}
                      component="a"
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        backgroundColor: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "1px solid #FFFFFF",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        "&:hover": {
                          backgroundColor: "#F5F5F7",
                          transform: "translateY(-2px) scale(1.05)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          borderColor: "#FFFFFF",
                        },
                      }}
                    >
                      <img
                        src={social.icon}
                        alt={social.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          objectFit: "contain",
                          filter: "brightness(0) saturate(100%)",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1D1D1F",
                  }}
                >
                  Payment Method:
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {[
                    { name: "PayPal", icon: "/icons/paypal-card.svg" },
                    { name: "Visa", icon: "/icons/visa-card.svg" },
                    { name: "Mastercard", icon: "/icons/master-card.svg" },
                    { name: "Western", icon: "/icons/western-card.svg" },
                  ].map((method) => (
                    <Box
                      key={method.name}
                      sx={{
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <img
                        src={method.icon}
                        alt={method.name}
                        style={{
                          height: "100%",
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Tabs & Details Section */}
        <Box sx={{ marginTop: "60px" }}>
          {/* Tabs */}
          <Stack direction="row" spacing={0} sx={{ marginBottom: "32px" }}>
            <Button
              onClick={() => setActiveTab("details")}
              sx={{
                minWidth: "140px",
                height: "44px",
                borderRadius: "12px 12px 0 0",
                fontFamily: appleFont,
                fontSize: "15px",
                fontWeight: activeTab === "details" ? 600 : 500,
                textTransform: "none",
                letterSpacing: "-0.01em",
                padding: "0 24px",
                background:
                  activeTab === "details" ? "#007AFF" : "transparent",
                color: activeTab === "details" ? "#ffffff" : "#86868b",
                boxShadow: activeTab === "details" ? "none" : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    activeTab === "details" ? "#0051D5" : "rgba(0,0,0,0.04)",
                },
              }}
            >
              Book Details
            </Button>
            <Button
              onClick={() => setActiveTab("info")}
              sx={{
                minWidth: "140px",
                height: "44px",
                borderRadius: "12px 12px 0 0",
                fontFamily: appleFont,
                fontSize: "15px",
                fontWeight: activeTab === "info" ? 600 : 500,
                textTransform: "none",
                letterSpacing: "-0.01em",
                padding: "0 24px",
                background: activeTab === "info" ? "#007AFF" : "transparent",
                color: activeTab === "info" ? "#ffffff" : "#86868b",
                boxShadow: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: activeTab === "info" ? "#0051D5" : "rgba(0,0,0,0.04)",
                },
              }}
            >
              Additional info
            </Button>
          </Stack>

          {/* Tab Content */}
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "0 16px 16px 16px",
              padding: { xs: "32px 24px", md: "48px 40px" },
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
            }}
          >
            {activeTab === "details" && (
              <Stack spacing={4}>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    lineHeight: 1.8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {chosenProduct.productDesc ||
                    "Vector device hand undo asset editor figjam link prototype align. Figjam ellipse ellipse figjam content comment pencil. Vector main star undo stroke bold union. Flatten pixel thumbnail flows clip pen list. Vertical outline layer align library layout prototype mask. Invite list share export clip text select. Rectangle layer prototype stroke edit figma draft horizontal overflow list. Effect edit create frame content image arrange. Underline team slice editor undo editor arrange figma layer. Star export scale main blur arrow list scrolling content."}
                </Typography>
                
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    lineHeight: 1.8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Arrow list scrolling content. Editor component rotate shadow hand.
                  Plugin list boolean inspect pixel pen distribute prototype. Export
                  auto underline line main align. Overflow connection effect duplicate
                  asset image rectangle fill. Shadow align invite frame connection
                  blur content layout effect. Component layout main plugin object
                  thumbnail rectangle pencil follower. Asset undo bold blur project.
                  Flows text frame fill polygon library distribute list. Undo fill
                  share text layer vector horizontal subtract.
                </Typography>
                
                {/* Book Image */}
                {detailImagePath && (
                  <Box
                    sx={{
                      width: "100%",
                      margin: "40px 0",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#FBFBFB",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                    }}
                  >
                    <img
                      src={detailImagePath}
                      alt={chosenProduct.productName}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: "500px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </Box>
                )}

                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    lineHeight: 1.8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Slice comment library clip list edit edit flatten figjam. Arrow pen
                  line pen flows project pen fill opacity connection. Component team
                  hand connection team variant vertical reesizing edit. Outline stroke
                  blur hand shadow overflow background draft. List draft list inspect
                  flows connection auto. Community figjam figjam follower subtract.
                </Typography>

                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    lineHeight: 1.8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Image select component editor draft subtract stroke line project
                  font. Overflow align connection editor main vector vector overflow
                  rotate pixel. Strikethrough main selection device auto. Scrolling
                  slice team style background component team plugin. Layout content
                  duplicate draft group follower. Style project clip stroke image
                  draft prototype. Figjam align slice comment move horizontal subtract
                  clip variant. Ellipse flatten edit strikethrough background boolean
                  ipsum link.
                </Typography>
              </Stack>
            )}
            {activeTab === "info" && (
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#1D1D1F",
                  lineHeight: 1.8,
                  letterSpacing: "-0.01em",
                }}
              >
                Additional information about the product will be displayed here.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
 