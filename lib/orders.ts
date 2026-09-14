import type { Order } from "@/types/order";

export async function createOrder(
  order: Order,
): Promise<Order> {
  // Firebase/Firestore will be connected here later.
  return order;
}