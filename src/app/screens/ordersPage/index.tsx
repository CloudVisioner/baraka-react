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
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
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

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  // reducer ga beryapmiz
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
        {/* Page Header */}
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
              fontSize: { xs: "15px", md: "17px" },
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
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: theme.spacing(4), lg: theme.spacing(5) },
          }}
        >
          {/* Main Content - Orders List */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <TabContext value={value}>
              {/* Tabs */}
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
                      fontSize: "15px",
                      fontWeight: 500,
                      textTransform: "none",
                      letterSpacing: "-0.01em",
                      color: "#1D1D1F",
                      opacity: 0.7,
                      minHeight: "48px",
                      padding: theme.spacing(1.5, 3),
                      "&.Mui-selected": {
                        color: "#1D1D1F",
                        fontWeight: 600,
                        opacity: 1,
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#1D1D1F",
                      height: "2px",
                    },
                  }}
                >
                  <Tab label="Pending" value={"1"} />
                  <Tab label="Processing" value={"2"} />
                  <Tab label="Completed" value={"3"} />
                </Tabs>
              </Box>

              {/* Tab Panels */}
              <Box>
                <PausedOrders setValue={setValue} />
                <ProcessOrders setValue={setValue} />
                <FinishedOrders />
              </Box>
            </TabContext>
          </Box>

          {/* Sidebar - User Info & Payment */}
          <Box
            sx={{
              width: { xs: "100%", lg: "380px" },
              flexShrink: 0,
            }}
          >
            <Stack spacing={3}>
              {/* User Profile Card */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  padding: theme.spacing(4),
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    src={
                      authMember?.memberImage
                        ? `${serverApi}/uploads/${authMember.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    sx={{
                      width: { xs: 80, md: 100 },
                      height: { xs: 80, md: 100 },
                      marginBottom: theme.spacing(2),
                      border: "3px solid #F5F5F7",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "22px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "#1D1D1F",
                      marginBottom: theme.spacing(0.5),
                    }}
                  >
                    {authMember?.memberNick || "Guest"}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#1D1D1F",
                      textTransform: "capitalize",
                      marginBottom: theme.spacing(3),
                    }}
                  >
                    {authMember?.memberType || "Member"}
                  </Typography>

                  <Divider sx={{ width: "100%", marginBottom: theme.spacing(3) }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "100%",
                      gap: theme.spacing(1),
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        fontSize: "20px",
                        color: "#1D1D1F",
                        marginTop: "2px",
                        opacity: 0.7,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1D1D1F",
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {authMember?.memberAddress || "No address provided"}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Payment Card */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  padding: theme.spacing(4),
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
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
                      fontSize: "18px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "#1D1D1F",
                    }}
                  >
                    Payment Method
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="Card number"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontFamily: appleFont,
                        fontSize: "15px",
                        borderRadius: "12px",
                        backgroundColor: "#F5F5F7",
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.08)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.12)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1D1D1F",
                          borderWidth: "1px",
                        },
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
                          fontSize: "15px",
                          borderRadius: "12px",
                          backgroundColor: "#F5F5F7",
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.08)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.12)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1D1D1F",
                            borderWidth: "1px",
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
                          fontSize: "15px",
                          borderRadius: "12px",
                          backgroundColor: "#F5F5F7",
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.08)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.12)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1D1D1F",
                            borderWidth: "1px",
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
                        fontSize: "15px",
                        borderRadius: "12px",
                        backgroundColor: "#F5F5F7",
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.08)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.12)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1D1D1F",
                          borderWidth: "1px",
                        },
                      },
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: theme.spacing(2),
                    marginTop: theme.spacing(3),
                    paddingTop: theme.spacing(3),
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <img
                    src={"/icons/visa-card.svg"}
                    alt="Visa"
                    style={{ height: "24px", opacity: 0.6 }}
                  />
                  <img
                    src={"/icons/master-card.svg"}
                    alt="Mastercard"
                    style={{ height: "24px", opacity: 0.6 }}
                  />
                  <img
                    src={"/icons/paypal-card.svg"}
                    alt="PayPal"
                    style={{ height: "24px", opacity: 0.6 }}
                  />
                </Box>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// .order-page .order-main-box {
//   display: flex;
//   flex-direction: column;
//   height: auto;
//   background: red;
// }

// /* .orders-name-price {
//   display: flex;
//   flex-direction: row;
//   /* width: 244px; */
//   height: auto;
//   background-color: yellowgreen;
// }

// .container-paused .order-main-box .order-box-scroll .orders-name-price {
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   gap: 20px;
// } */ */
