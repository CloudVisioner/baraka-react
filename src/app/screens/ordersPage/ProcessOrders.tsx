import React from "react";
import { Box, Stack, Button } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment"
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages, normalizeImagePath } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/orders";
import { useGlobals } from "../../hooks/useGlobal";
import { T } from "../../../lib/types/common";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";

/** REDUX SLICE & SELECTOR */
const processdOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders }) // just selcted data name
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processdOrdersRetriever);

  //** HANDLERS **//

  const finishOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      // PAYMENT PROCESS

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.FINISH,
      };

      const confirmation = window.confirm("Have you received your order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("3");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };

  return (
    <TabPanel value={"2"}>
      <Stack className={"container-paused"}>
        {processOrders.map((order: Order) => {
          return (
            <Box key={order._id} className={"order-main-box"}>
              <Box className={"order-box-scroll"}>
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id
                  )[0];
                  const imagePath = normalizeImagePath(product.productImages?.[0]);
                  return (
                    <Box key={item._id} className={"orders-name-price"}>
                      <img src={imagePath} className={"order-dish-img"} />
                      <p className={"title-dish"}>{product.productName}</p>
                      <Box className={"price-box"}>
                        <p>${item.itemPrice}</p>
                        <img src={"/icons/close.svg"} />
                        <p>{item.itemQuantity}</p>
                        <img src={"/icons/pause.svg"} />
                        <p style={{ marginLeft: "15px" }}>
                          ${item.itemQuantity * item.itemPrice}
                        </p>
                      </Box>
                    </Box>
                  );
                })}

                <Box className={"total-price-box"}>
                  <Box className={"box-total"}>
                    <p>ProductPrize ${order.orderTotal - order.orderDelivery}</p>
                    <img src={"/icons/plus.svg"} />
                    <p>deliveryCost</p>
                    <p>${order.orderDelivery}</p>
                    <img src={"/icons/pause.svg"} />
                    <p>Total</p>
                    <p>${order.orderTotal}</p>
                  </Box>
                  <p className={"data-compl"}>
                    {moment().format("YY-MM-DD HH: mm")}
                  </p>
                  <Button
                    value={order._id}
                    variant="contained"
                    className={"verify-button"}
                    onClick={finishOrderHandler}
                  >
                    VERIFY TO FULLFIL
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}

        {!processOrders ||
          (processOrders.length === 0 && (
            <Box display="flex" flexDirection={"row"} justifyContent={"center"}>
              <img
                src={"/icons/noimage-list.svg"}
                style={{ width: 300, height: 300 }}
              />
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
