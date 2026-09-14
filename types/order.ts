export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;

  customer: {
    name: string;
    phone: string;
    address: string;
  };

  items: OrderItem[];

  subtotal: number;
  paymentMethod: "cod";

  status: "pending" | "confirmed" | "delivered" | "cancelled";

  createdAt: string;
}