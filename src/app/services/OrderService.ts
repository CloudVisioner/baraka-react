import axios from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../../lib/types/search";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/orders";

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createOrder(input: CartItem[]): Promise<Order> {
    try {
      const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => ({
          itemQuantity: cartItem.quantity,
          itemPrice: cartItem.price,
          productId: cartItem._id,
      }));

      const url = `${this.path}/order/create`;
      const result = await axios.post(url, orderItems, {
        withCredentials: true,
      });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
    try {
      const url = `${this.path}/order/all`;
      const query = `?page=${input.page}&limit=${input.limit}&orderStatus=${input.orderStatus}`;
      const result = await axios.get(url + query, { withCredentials: true });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

   public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    try {
      const url = `${serverApi}/order/update`;
      
      // If paymentImage is a File, use FormData (for file uploads)
      if (input.paymentImage instanceof File) {
        const formData = new FormData();
        formData.append("orderId", input.orderId);
        formData.append("orderStatus", input.orderStatus);
        formData.append("paymentImage", input.paymentImage);
        
        const result = await axios.post(url, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return result.data;
      } else {
        // Regular JSON update (no file)
        const result = await axios.post(url, input, {
          withCredentials: true,
        });
        return result.data;
      }
    } catch (err) {
      throw err;
    }
  }

  public async uploadPaymentImage(formData: FormData): Promise<any> {
    try {
      // Use the update endpoint with FormData instead of non-existent upload-payment
      const url = `${this.path}/order/update`;
      const result = await axios.post(url, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return result.data;
    } catch (err) {
      throw err;
    }
  }
}

export default OrderService;
