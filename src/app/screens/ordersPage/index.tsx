import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
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
    const {orderBuilder} = useGlobals()
  const [value, setValue] = useState("1");
  const [orderInquery, setOrderInquery] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => { /////////////////////////////////////////
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));


    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));


    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));

  }, [orderInquery, orderBuilder]);

  //** HANDLERS **//

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={"order-page"}>
      <Container className={"order-container"}>
        <Stack className={"order-left"}>
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PORCESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
            </Box>
            <Stack className={"order-main-content"}>
              <PausedOrders setValue={setValue}/>
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        <Stack className={"order-right"}>
          <Box className={"order-info-box"}>
            <Box className={"member-box"}>
              <div className={"order-user-img"}>
                <img
                  src={"icons/user-badge.svg"}
                  className={"order-user-avatar"}
                />
                <div className={"order-user-icon-box"}>
                  <img
                    src={"/icons/user-badge.svg"}
                    className={"order-user-prof-img"}
                  />
                </div>
              </div>
              <span className={"order-user-name"}>Marcus</span>
              <span className={"order-user-prof"}>USER</span>
            </Box>
            <Box className={"linear"}></Box>
            <Box className={"order-user-address"}>
              <div
                style={{ display: "flex" }}
                className={"order-user-address-txt"}
              >
                <LocationOnIcon /> South Korea, Busan
              </div>
            </Box>
          </Box>

          <Box className={"order-info-box"}>
            <input
              id="myInput"
              type="text"
              className="card-input"
              placeholder=" Card number : 5243 4090 2002 7495"
            />
            <Stack className="date-cvc">
              <input
                id="myInput"
                type="text"
                className="card-input-cvc"
                placeholder=" 07/24"
              />
              <input
                id="myInput"
                type="text"
                className="card-input-cvc"
                placeholder=" CVV:010"
              />
            </Stack>
            <input
              id="myInput"
              type="text"
              className="user-name-card"
              placeholder=" Marcus Aurelius"
            />

            <Stack className="cards-img">
              <img
                src={"/icons/western-card.svg"}
                className={"order-user-prof-img"}
              />
              <img
                src={"/icons/master-card.svg"}
                className={"order-user-prof-img"}
              />
              <img
                src={"/icons/paypal-card.svg"}
                className={"order-user-prof-img"}
              />
              <img
                src={"/icons/visa-card.svg"}
                className={"order-user-prof-img"}
              />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </div>
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
