import React from "react";
import { Box, Button, Stack, Typography, IconButton, Divider, useTheme } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, normalizeImagePath } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobal";
import OrderService from "../../services/OrderService";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const theme = useTheme();
  const itemsPrice = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0
  );
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);

      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box>
      <IconButton
        aria-label="cart"
        onClick={handleClick}
        sx={{
          color: "#f8f8ff",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Badge badgeContent={cartItems.length} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: "420px",
            maxWidth: "420px",
            borderRadius: "20px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              backgroundColor: "#FFFFFF",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ backgroundColor: "#F5F5F7", padding: theme.spacing(2.5, 2.5, 2) }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "16px",
                fontWeight: 600,
                color: "#1D1D1F",
                letterSpacing: "-0.01em",
              }}
            >
              Cart Products:
            </Typography>
            {cartItems.length > 0 && (
              <IconButton
                onClick={onDeleteAll}
                size="small"
                sx={{
                  color: "#86868B",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    color: "#1D1D1F",
                  },
                }}
              >
                <DeleteForeverIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Box>

        {cartItems.length === 0 ? (
          <Box
            sx={{
              padding: theme.spacing(6, 4),
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "16px",
                fontWeight: 400,
                color: "#86868B",
                letterSpacing: "-0.01em",
              }}
            >
              Cart is empty!
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                padding: theme.spacing(2),
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#F5F5F7",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#D0D0D0",
                  borderRadius: "4px",
                  "&:hover": {
                    background: "#A0A0A0",
                  },
                },
              }}
            >
              <Stack spacing={2}>
              {cartItems.map((item: CartItem) => {
                const imagePath = normalizeImagePath(item.image);
                return (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(2),
                        padding: theme.spacing(1.5),
                        borderRadius: "12px",
                        backgroundColor: "#FBFBFD",
                        transition: theme.transitions.create("background-color"),
                        "&:hover": {
                          backgroundColor: "#F5F5F7",
                        },
                      }}
                    >
                      {/* Product Image */}
                      <Box
                        component="img"
                        src={imagePath}
                        alt={item.name}
                        sx={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "12px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />

                      {/* Product Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#1D1D1F",
                            letterSpacing: "-0.01em",
                            marginBottom: theme.spacing(0.5),
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#1D1D1F",
                            letterSpacing: "-0.01em",
                          }}
                        >
                      ${item.price} x {item.quantity}
                        </Typography>
                      </Box>

                      {/* Quantity Controls */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing(1),
                          backgroundColor: "#FFFFFF",
                          borderRadius: "8px",
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                          padding: theme.spacing(0.25),
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => onRemove(item)}
                          disabled={item.quantity <= 1}
                          sx={{
                            width: "28px",
                            height: "28px",
                            color: item.quantity <= 1 ? "#D0D0D0" : "#1D1D1F",
                            "&:hover": {
                              backgroundColor: item.quantity <= 1 ? "transparent" : "rgba(0, 0, 0, 0.04)",
                            },
                            "&:disabled": {
                              color: "#D0D0D0",
                            },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#1D1D1F",
                            minWidth: "24px",
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => onAdd(item)}
                          sx={{
                            width: "28px",
                            height: "28px",
                            color: "#1D1D1F",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Delete Button */}
                      <IconButton
                        size="small"
                        onClick={() => onDelete(item)}
                        sx={{
                          color: "#86868B",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            color: "#FF3B30",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                  </Box>
                );
              })}
              </Stack>
            </Box>

            {/* Total and Order Button */}
            <Divider sx={{ margin: theme.spacing(0, 0, 2) }} />
            <Box
              sx={{
                padding: theme.spacing(0, 2, 2),
              }}
            >
              <Stack spacing={2}>
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
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "#6E6E73",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Subtotal
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#1D1D1F",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ${itemsPrice.toFixed(1)}
                  </Typography>
                </Box>
                {shippingCost > 0 && (
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
                        fontSize: "15px",
                        fontWeight: 400,
                        color: "#6E6E73",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Shipping
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1D1D1F",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      ${shippingCost.toFixed(1)}
                    </Typography>
                  </Box>
                )}
                <Divider />
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
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#1D1D1F",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Total
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#1D1D1F",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ${totalPrice}
                  </Typography>
          </Box>
                <Button
                  variant="contained"
                  onClick={proceedOrderHandler}
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  sx={{
                    height: "48px",
                    borderRadius: "24px",
                    fontFamily: appleFont,
                    fontSize: "16px",
                    fontWeight: 500,
                    textTransform: "none",
                    letterSpacing: "-0.01em",
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
                Order
              </Button>
              </Stack>
            </Box>
          </>
          )}
      </Menu>
    </Box>
  );
}
