import { useState, SyntheticEvent, useEffect } from "react";
import {
  Container,
  Stack,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Divider,
  TextField,
  useTheme,
  Chip,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import "../../../css/order.css";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobal";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setFinishedOrders, setProcessOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquery, setOrderInquery] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
     .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch(() => {});

    order 
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch(() => {});

    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch(() => {});
  }, [orderInquery, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const theme = useTheme();

  if (!authMember) history.push("/");
  
  const hasAddress = authMember?.memberAddress && authMember.memberAddress.trim() !== "" && authMember.memberAddress !== "No address provided";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F5F5F7",
        paddingTop: { xs: theme.spacing(4), md: theme.spacing(6) },
        paddingBottom: theme.spacing(8),
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            marginBottom: { xs: theme.spacing(4), md: theme.spacing(6) },
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "32px", md: "48px" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              marginBottom: theme.spacing(1),
            }}
          >
            My Orders
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 400,
              color: "#1D1D1F",
              letterSpacing: "-0.01em",
              opacity: 0.8,
            }}
          >
            Manage and track your book orders
          </Typography>
            </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: theme.spacing(3),
            marginBottom: theme.spacing(5),
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: "24px",
              backgroundColor: "#FFFFFF",
              padding: theme.spacing(4),
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              border: "0.5px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(3),
              }}
            >
              <Avatar
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/uploads/${authMember.memberImage}`
                      : "/icons/default-user.svg"
                  }
                sx={{
                  width: 72,
                  height: 72,
                  border: "3px solid #F5F5F7",
                }}
                />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(1),
                    marginBottom: theme.spacing(1),
                  }}
                >
                  <PersonIcon sx={{ fontSize: "20px", color: "#6E6E73", opacity: 0.8 }} />
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "20px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "#1D1D1F",
                    }}
                  >
                    {authMember?.memberNick || "Guest"}
                  </Typography>
                </Box>
                <Chip
                  label={authMember?.memberType || "Member"}
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "14px",
                    fontWeight: 500,
                    backgroundColor: "#F5F5F7",
                    color: "#1D1D1F",
                    textTransform: "capitalize",
                    height: "24px",
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ marginY: theme.spacing(3) }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: theme.spacing(1.5),
              }}
            >
              <LocationOnIcon
                sx={{
                  fontSize: "22px",
                  color: hasAddress ? "#34C759" : "#FF3B30",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#6E6E73",
                    marginBottom: theme.spacing(0.5),
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Delivery Address
                </Typography>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "17px",
                    fontWeight: hasAddress ? 500 : 400,
                    color: hasAddress ? "#1D1D1F" : "#FF3B30",
                    lineHeight: 1.5,
                    fontStyle: hasAddress ? "normal" : "italic",
                  }}
                >
                  {authMember?.memberAddress || "No address provided"}
                </Typography>
                {!hasAddress && (
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "#6E6E73",
                      marginTop: theme.spacing(1),
                      fontStyle: "normal",
                    }}
                  >
                    Please add your address to proceed with orders
                  </Typography>
                )}
              </Box>
            </Box>
          </Card>

          <Card
            elevation={0}
            sx={{
              borderRadius: "24px",
              backgroundColor: "#FFFFFF",
              padding: theme.spacing(4),
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              border: "0.5px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(1.5),
                marginBottom: theme.spacing(3),
              }}
              >
              <CreditCardIcon
                sx={{
                  fontSize: "24px",
                  color: "#1D1D1F",
                  opacity: 0.9,
                }}
              />
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "20px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#1D1D1F",
                }}
              >
                Payment Method
              </Typography>
          </Box>

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                placeholder="Card number"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontFamily: appleFont,
                    fontSize: "17px",
                    borderRadius: "14px",
                    backgroundColor: "#F5F5F7",
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.08)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1D1D1F",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#86868B",
                    opacity: 1,
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: theme.spacing(2),
                }}
              >
                <TextField
                  fullWidth
                  placeholder="MM/YY"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontFamily: appleFont,
                      fontSize: "17px",
                      borderRadius: "14px",
                      backgroundColor: "#F5F5F7",
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.08)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.12)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1D1D1F",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="CVV"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontFamily: appleFont,
                      fontSize: "17px",
                      borderRadius: "14px",
                      backgroundColor: "#F5F5F7",
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.08)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.12)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1D1D1F",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </Box>
              <TextField
                fullWidth
                placeholder="Cardholder name"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontFamily: appleFont,
                    fontSize: "17px",
                    borderRadius: "14px",
                    backgroundColor: "#F5F5F7",
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.08)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1D1D1F",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: theme.spacing(2.5),
                    marginTop: theme.spacing(4),
                    paddingTop: theme.spacing(3),
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
              <img
                    src={"/icons/visa-card.svg"}
                    alt="Visa"
                    style={{ 
                      height: "36px", 
                      opacity: 1,
                      filter: "contrast(1.1) brightness(1)",
                      imageRendering: "crisp-edges"
                    }}
              />
              <img
                src={"/icons/master-card.svg"}
                    alt="Mastercard"
                    style={{ 
                      height: "36px", 
                      opacity: 1,
                      filter: "contrast(1.1) brightness(1)",
                      imageRendering: "crisp-edges"
                    }}
              />
              <img
                src={"/icons/paypal-card.svg"}
                    alt="PayPal"
                    style={{ 
                      height: "36px", 
                      opacity: 1,
                      filter: "contrast(1.1) brightness(1)",
                      imageRendering: "crisp-edges"
                    }}
                  />
                </Box>
          </Card>
        </Box>

        <Box>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                marginBottom: theme.spacing(4),
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                sx={{
                  "& .MuiTab-root": {
                    fontFamily: appleFont,
                    fontSize: "17px",
                    fontWeight: 500,
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    color: "#1D1D1F",
                    opacity: 0.7,
                    minHeight: "52px",
                    padding: theme.spacing(1.5, 4),
                    "&.Mui-selected": {
                      color: "#1D1D1F",
                      fontWeight: 600,
                      opacity: 1,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#1D1D1F",
                    height: "3px",
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                <Tab label="Pending" value={"1"} />
                <Tab label="Processing" value={"2"} />
                <Tab label="Completed" value={"3"} />
              </Tabs>
            </Box>

            <Box>
              <PausedOrders setValue={setValue} />
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Box>
          </TabContext>
          </Box>
      </Container>
    </Box>
  );
}
