import React from "react";
import { Box, Stack, Button } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

export default function PausedOrders() {
  return (
    <TabPanel value={"2"}>
      <Stack className={"container-paused"}>
        {[1, 2].map((ele, index) => {
          return (
            <Box key={index} className={"order-main-box"}>
              <Box className={"order-box-scroll"}>
                {[1, 2, 3].map((ele2, index2) => {
                  return (
                    <Box key={index2} className={"orders-name-price"}>
                      <img
                        src={"/img/kebab-fresh.webp"}
                        className={"order-dish-img"}
                      />
                      <p className={"title-dish"}>Kebab</p>
                      <Box className={"price-box"}>
                        <p>$12</p>
                        <img src={"/icons/close.svg"} />
                        <p>2</p>
                        <img src={"/icons/pause.svg"} />
                        <p style={{ marginLeft: "15px" }}>$24</p>
                      </Box>
                    </Box>
                  );
                })}

                <Box className={"total-price-box"}>
                  <Box className={"box-total"}>
                    <p>Product prize</p>
                    <p>$22</p>
                    <img src={"/icons/plus.svg"}
                   />
                    <p>delivery cost</p>
                    <p>$2</p>
                    <img
                      src={"/icons/pause.svg"}
                   
                    />
                    <p>Total</p>
                    <p>$24</p>
                  </Box>
                  <p className={"data-compl"}>
                    {moment().format("YY-MM-DD HH: mm")}
                  </p>
                  <Button variant="contained" className={"verify-button"}>
                    VERIFY TO FULLFIL
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}

        {false && (
          <Box display="flex" flexDirection={"row"} justifyContent={"center"}>
            <img
              src={"/icons/noimage-list.svg"}
              style={{ width: 300, height: 300 }}
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
} /*

// CSS

// .order-page .order-main-content .order-main-box {
//   position: relative;
//   width: 100%;
//   max-height: 285px;
//   margin-bottom: 25px;
//   border-radius: 16px;
//   background: #f8f8fe;
//   box-shadow: -12px 12px 4px 0 #bababf, 0 4px 10px 9px #d3d3e7 inset,
//     0 4px 16px 0 rgba(242, 189, 87, 0.04) inset;
// }

// .order-page .order-box-scroll .orders-name-price {
//   position: relative;
//   max-height: 47px;
//   margin-top: 5px;
//   margin-left: 50px;
//   display: flex;
//   flex-direction: row;
//   align-items: center; /* */
// }

// .order-page .order-box-scroll .orders-name-price .order-dish-img {
//   position: relative;
//   position: relative;
//   width: 50px;
//   height: 47px;
//   border-radius: 50px;
//   background-size: cover;
//   background: #000;
// }

// .order-page .order-box-scroll .orders-name-price .title-dish {
//   position: relative;
//   width: 260px;
//   margin-left: 36px;
//   color: #000;
//   font-family: Commissioner;
//   font-size: 22px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: 36px;
// }

// .order-page .order-box-scroll .orders-name-price .price-box {
//   position: relative;
//   width: 170px;
//   height: 100%;
//   margin-left: 150px;
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
// }

/*
.order-page .order-main-content .order-main.box {
  position: relative;
  width: 100%;
  max-height: 285px;
  margin-bottom: 25px;
  border-radius: 16px;
  background: yellowgreen;
  box-shadow: -12px 12px 4px 0 #bababf, 0 4px 10px 9px #d3d3e7 inset,
    0 4px 16px 0 rgba(242, 189, 87, 0.04) inset;
}

.order-page .order-box-scroll .orders-name-price {
  position: relative;
  height: 47px;
  margin-top: 5px;
  margin-left: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.order-page .order-box-scroll .orders-name-price .order-dish-img {
  position: relative;
  width: 50px;
  height: 47px;
  border-radius: 50px;
  background-size: cover;
 background: #000;
}

.order-page .order-box-scroll .orders-name-price .title-dish {
  /* position: relative; */
//   width: 260px;
//   height: 36px;
//   margin-left: 20px;
//   font-family: "Commissioner";
//   font-style: normal;
//   font-weight: 500;
//   font-size: 22px;
//   line-height: 36px;
//   color: •#000000;
// }
// .order-page .order-box-scroll .orders-name-price .price-box {
//   position: relative;
//   max-width: 170px;
//   height: 100%;
//   margin-left: 150px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
// } */
