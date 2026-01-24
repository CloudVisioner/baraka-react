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

    // Fetch all orders that need payment proof (PAUSE, PENDING, REJECTED)
    Promise.all([
      order.getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PAUSE }),
      order.getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PENDING }),
      order.getMyOrders({ ...orderInquery, orderStatus: OrderStatus.REJECTED }),
    ])
      .then(([pauseData, pendingData, rejectedData]) => {
        // Combine all orders that need payment proof
        const allPausedOrders = [...pauseData, ...pendingData, ...rejectedData];
        setPausedOrders(allPausedOrders);
      })
      .catch(() => {});

    // Fetch orders in processing (admin approved - status is PROCESS)
    order 
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data || []))
      .catch(() => {
        setProcessOrders([]);
      });

    // Fetch completed orders (customer confirmed receipt - status is FINISH)
    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data || []))
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
                Bank Account Details
              </Typography>
          </Box>

            <Box
              sx={{
                backgroundColor: "#F5F5F7",
                borderRadius: "16px",
                padding: theme.spacing(3),
                marginBottom: theme.spacing(2),
              }}
            >
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6E6E73",
                  marginBottom: theme.spacing(2),
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Transfer Payment To
              </Typography>
              
              <Stack spacing={1.5}>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#6E6E73",
                      marginBottom: theme.spacing(0.5),
                    }}
                  >
                    Bank Name
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#1D1D1F",
                    }}
                  >
                    Baraka Books Bank
                  </Typography>
                </Box>
                
                <Box>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#6E6E73",
                      marginBottom: theme.spacing(0.5),
                    }}
                  >
                    Account Number
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#1D1D1F",
                      letterSpacing: "0.05em",
                    }}
                  >
                    1234 5678 9012 3456
                  </Typography>
                </Box>
                
                <Box>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#6E6E73",
                      marginBottom: theme.spacing(0.5),
                    }}
                  >
                    Account Holder
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#1D1D1F",
                    }}
                  >
                    Baraka Books LLC
                  </Typography>
                </Box>
                
                <Box>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#6E6E73",
                      marginBottom: theme.spacing(0.5),
                    }}
                  >
                    SWIFT/BIC Code
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#1D1D1F",
                    }}
                  >
                    BRKAUS33
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                padding: theme.spacing(2),
                backgroundColor: "#FFF4E6",
                borderRadius: "12px",
                border: "1px solid #FFE5CC",
              }}
            >
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#E67E22",
                  lineHeight: 1.5,
                }}
              >
                <strong>Payment Flow:</strong> After making the bank transfer, upload your payment proof in the "Awaiting Payment Proof" tab. Once verified by our team, your order will move to "Processing" where it will be packed and shipped. After delivery, mark it as received to complete the order.
              </Typography>
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
                <Tab label="Awaiting Payment Proof" value={"1"} />
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
