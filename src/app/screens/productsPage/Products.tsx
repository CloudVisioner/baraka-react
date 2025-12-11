import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product } from "../../../lib/types/product";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

const products = [
  { productName: "Cutlet", imagePath: "/img/cutlet.webp" },
  { productName: "Kebab", imagePath: "/img/kebab-fresh.webp" },
  { productName: "Kebab", imagePath: "/img/kebab.webp" },
  { productName: "Lavash", imagePath: "/img/lavash.webp" },
  { productName: "Lavash", imagePath: "/img/lavash.webp" },
  { productName: "Cutlet", imagePath: "/img/cutlet.webp" },
  { productName: "Kebab", imagePath: "/img/kebab.webp" },
  { productName: "Kebab", imagePath: "/img/kebab-fresh.webp" },
];

export default function Products() {
  return (
    <div className={"products"}>
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className="first">
            <Box className={"res-name"}>Burak Restaurant</Box>
            <Stack className="search-wrapper">
              <Stack className="search" direction="row" alignItems="center">
                <input
                  id="myInput"
                  type="text"
                  className="search-input"
                  placeholder="Type here"
                />

                <Button variant="contained" className="search-button">
                  SEARCH
                  <img className="user-avatar" src="/icons/Vector.svg" />
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack className={"dishes-filter-section"}>
          <Stack className="dishes-filter-box">
            <Button variant={"contained"} color={"primary"} className={"order"}>
              New
            </Button>
            <Button
              variant={"contained"}
              color={"secondary"}
              className={"order"}
            >
              Price
            </Button>
            <Button
              variant={"contained"}
              color={"secondary"}
              className={"order"}
            >
              Views
            </Button>
          </Stack>
        </Stack>

        <Stack className="list-category-section">
          <Stack className="product-category">
            <div className="category-main">
              <Button variant="contained" color="secondary">
                SALAD
              </Button>
              <Button variant="contained" color="secondary">
                Drinks
              </Button>
              <Button variant="contained" color="secondary">
                DESERT
              </Button>
              <Button variant="contained" color="primary">
                DISH
              </Button>
            </div>
          </Stack>

          <Stack className="product-wrapper">
            {products.length !== 0 ? (
              products.map((product, index) => (
                <Stack key={index} className="product-card">
                  <Stack
                    className="product-img"
                    sx={{ backgroundImage: `url(${product.imagePath})` }}
                  >
                    <div className="product-sale">Normal size</div>

                    <Button className="shop-btn">
                      <img
                        src="/icons/shopping-cart.svg"
                        style={{ display: "flex" }}
                        alt="cart"
                      />
                    </Button>

                    <Button className="view-btn" sx={{ right: "36px" }}>
                      <Badge badgeContent={20} color="secondary">
                        <RemoveRedEyeIcon sx={{ color: "gray" }} />
                      </Badge>
                    </Button>
                  </Stack>

                  <Box className="product-desc">
                    <span className="product-title">{product.productName}</span>

                    <div className="product-desc">
                      <MonetizationOnIcon />
                      {15} {/* or add productPrice */}
                    </div>
                  </Box>
                </Stack>
              ))
            ) : (
              <Box className="no-data">Products are not available!</Box>
            )}

            <Stack className={"pagination-section"}>
              <Pagination
                count={3}
                page={1}
                renderItem={(item) => (
                  <PaginationItem
                    components={{
                      previous: ArrowBackIcon,
                      next: ArrowForwardIcon,
                    }}
                    {...item}
                    color={"secondary"}
                  />
                )}
              />
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <div className="family-brands-section">
        <Typography className="family-title">Our Family Brands</Typography>

        <Stack className="brands-wrapper">
          <Box className="brand-card">
            <img
              src="/img/gurme.webp"
              alt="Burak Gurme"
              className="brand-img"
            />
          </Box>

          <Box className="brand-card">
            <img
              src="/img/seafood.webp"
              alt="Burak Seafood"
              className="brand-img"
            />
          </Box>

          <Box className="brand-card">
            <img
              src="/img/sweets.webp"
              alt="Burak Sweets"
              className="brand-img"
            />
          </Box>

          <Box className="brand-card">
            <img
              src="/img/doner.webp"
              alt="Burak Doner"
              className="brand-img"
            />
          </Box>
        </Stack>
      </div>

      <div className="address">
        <Container>
          <Stack className="address-area">
            <Box className={"title"}>Our address</Box>
            <iframe
              style={{ marginTop: "60px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1509.683087045884!2d29.008657870843044!3d41.04724859690466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab80b0afff1af%3A0x5cb1a4b5332e5310!2sCZN%20Burak%20Hazal%20Restaurant!5e0!3m2!1sen!2skw!4v1706368536124!5m2!1sen!2skw"
              width="1300"
              height="567"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
