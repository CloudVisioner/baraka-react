import React from "react";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  useTheme,
} from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders, retrievePausedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { normalizeImagePath } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/orders";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

/** REDUX SLICE & SELECTOR */
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders }) // just selcted data name
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);
  const theme = useTheme();

  return (
    <TabPanel value={"3"} sx={{ padding: 0 }}>
      <Stack spacing={3}>
        {finishedOrders && finishedOrders.length > 0 ? (
          finishedOrders.map((order: Order) => {
          return (
              <Card
                key={order._id}
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ padding: theme.spacing(4) }}>
                  {/* Status Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(1.5),
                      marginBottom: theme.spacing(3),
                    }}
                  >
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
                      label="Completed"
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "17px",
                        fontWeight: 500,
                        backgroundColor: "#E8F5E9",
                        color: "#2E7D32",
                        borderRadius: "8px",
                        height: "28px",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "17px",
                        fontWeight: 500,
                        color: "#1D1D1F",
                        marginLeft: "auto",
                      }}
                    >
                      {moment(order.updatedAt).format("MMM DD, YYYY • hh:mm A")}
                    </Typography>
                  </Box>

                  {/* Order Items */}
                  <Stack spacing={2} sx={{ marginBottom: theme.spacing(3) }}>
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id
                  )[0];
                  if (!product || !product.productImages?.length) return null;
                      const imagePath = normalizeImagePath(
                        product.productImages?.[0]
                      );
                  return (
                        <Box
                          key={item._id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing(2),
                            padding: theme.spacing(2),
                            borderRadius: "12px",
                            backgroundColor: "#F5F5F7",
                          }}
                        >
                          <Avatar
                            src={imagePath}
                            variant="rounded"
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: "8px",
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontFamily: appleFont,
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#1D1D1F",
                                marginBottom: theme.spacing(0.5),
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {product.productName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: appleFont,
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#1D1D1F",
                              }}
                            >
                              ${item.itemPrice} × {item.itemQuantity}
                            </Typography>
                      </Box>
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "17px",
                              fontWeight: 600,
                              color: "#1D1D1F",
                            }}
                          >
                            ${(item.itemQuantity * item.itemPrice).toFixed(2)}
                          </Typography>
                    </Box>
                  );
                })}
                  </Stack>

                  <Divider sx={{ marginBottom: theme.spacing(3) }} />

                  {/* Order Summary */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: theme.spacing(1.5),
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "17px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        ${(order.orderTotal - order.orderDelivery).toFixed(2)}
                      </Typography>
              </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        Delivery
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "17px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        ${order.orderDelivery.toFixed(2)}
                      </Typography>
                </Box>
                    <Divider sx={{ marginTop: theme.spacing(1) }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: theme.spacing(1),
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#1D1D1F",
                        }}
                      >
                        Total
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#1D1D1F",
                        }}
                      >
                        ${order.orderTotal.toFixed(2)}
                      </Typography>
              </Box>
            </Box>
                </CardContent>
              </Card>
          );
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: theme.spacing(8),
              textAlign: "center",
            }}
          >
            <img
              src={"/icons/noimage-list.svg"}
              alt="No orders"
              style={{ width: 200, height: 200, opacity: 0.5 }}
            />
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "20px",
                fontWeight: 500,
                color: "#1D1D1F",
                marginTop: theme.spacing(3),
                marginBottom: theme.spacing(1),
              }}
            >
              No completed orders
            </Typography>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "17px",
                fontWeight: 400,
                color: "#1D1D1F",
              }}
            >
              Your completed orders will appear here
            </Typography>
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}
