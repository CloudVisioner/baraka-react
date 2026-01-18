import React from "react";
import {
  Box,
  Stack,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages, normalizeImagePath } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/orders";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobal";
import OrderService from "../../services/OrderService";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

/** REDUX SLICE & SELECTOR */
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders }) // just selcted data name
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  /** HANDLERS */

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you want to delete the order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      sweetErrorHandling(err);
    }
  };

  const proceedOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = window.confirm(
        "Do you want to proceed with payment?"
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      sweetErrorHandling(err);
    }
  };

  const theme = useTheme();

  return (
    <TabPanel value={"1"} sx={{ padding: 0 }}>
      <Stack spacing={3}>
        {pausedOrders && pausedOrders.length > 0 ? (
          pausedOrders.map((order: Order) => {
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
                                fontSize: "14px",
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
                      marginBottom: theme.spacing(3),
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
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "15px",
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
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        Delivery
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "15px",
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

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: theme.spacing(2),
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      value={order._id}
                      variant="outlined"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={deleteOrderHandler}
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "15px",
                        fontWeight: 500,
                        textTransform: "none",
                        borderRadius: "12px",
                        padding: theme.spacing(1.5, 3),
                        borderColor: "rgba(0, 0, 0, 0.12)",
                        color: "#1D1D1F",
                        "&:hover": {
                          borderColor: "rgba(0, 0, 0, 0.24)",
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      value={order._id}
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={proceedOrderHandler}
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "15px",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "12px",
                        padding: theme.spacing(1.5, 3),
                        backgroundColor: "#007AFF",
                        color: "#FFFFFF",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#0051D5",
                          boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
                        },
                      }}
                    >
                      Proceed to Payment
                    </Button>
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
              No pending orders
            </Typography>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "15px",
                fontWeight: 400,
                color: "#1D1D1F",
              }}
            >
              Your pending orders will appear here
            </Typography>
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}
