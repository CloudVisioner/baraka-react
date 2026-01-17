import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductType } from "../../../lib/enums/product.enum";
import { normalizeImagePath } from "../../../lib/config";
import { Typography } from "@mui/joy";
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
  const history = useHistory();

  useEffect(() => {
    console.log("data Arrived");
    const product = new ProductService();
    product
      .getProducts(productSearch)

      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]); // conmponentDidUpdate

  // useEffect(() => {
  //   if (searchText === "") {
  //     productSearch.search = "";
  //     setProductSearch({ ...productSearch });
  //   }
  // });

  /** HANDLERS */
  const searchCollectionHandler = (collection: ProductType) => {
    productSearch.page = 1;
    productSearch.productType = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className={"products"}>
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
              variant={productSearch.productType === ProductType.COMICS ? "contained" : "outlined"}
              className={`category-btn ${productSearch.productType === ProductType.COMICS ? "active" : ""}`}
              onClick={() => searchCollectionHandler(ProductType.COMICS)}
            >
              Comics
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

        <Stack className="products-section">
          <Stack className="product-wrapper">
            {products.length !== 0 ? (
              products.map((product, index) => {
                const imagePath = normalizeImagePath(product.productImages?.[0]);
                return (
                  <Stack
                    key={index}
                    className="product-card"
                    onClick={() => chooseDishHandler(product._id)}
                  >
                    <Stack
                      className="product-img"
                      sx={{ backgroundImage: `url(${imagePath})` }}
                    >
                      <Button
                        className="shop-btn"
                        onClick={(e) => {
                          onAdd({
                            _id: product._id,
                            quantity: 1,
                            name: product.productName,
                            price: product.productPrice,
                            image: normalizeImagePath(product.productImages?.[0]) || "",
                          });
                          e.stopPropagation();
                        }}
                      >
                        <img
                          src="/icons/shopping-cart.svg"
                          style={{ display: "flex" }}
                          alt="cart"
                        />
                      </Button>

                    </Stack>

                    <Box className="product-info">
                      <span className="product-title">
                        {product.productName}
                      </span>
                      
                      {product.productDesc && (
                        <p className="product-description">
                          {product.productDesc}
                        </p>
                      )}

                      <Stack className="product-footer" direction="row" justifyContent="space-between" alignItems="center">
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
                );
              })
            ) : (
              <Box className="no-data">Products are not available!</Box>
            )}

            <Stack className={"pagination-section"}>
              <Pagination
                count={
                  products.length !== 0
                    ? productSearch.page + 1
                    : productSearch.page
                }
                page={productSearch.page}
                renderItem={(item) => (
                  <PaginationItem
                    components={{
                      previous: ArrowBackIcon,
                      next: ArrowForwardIcon,
                    }}
                    {...item}
                  />
                )}
                onChange={paginationHandler}
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
