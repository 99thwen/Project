import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Order } from "@/types/order";

const ordersCollection = collection(db, "orders");

export async function createOrder(
  order: Order,
): Promise<Order> {
  const orderRef = doc(db, "orders", order.id);

  await setDoc(orderRef, order);

  return order;
}

export async function getOrders(): Promise<Order[]> {
  const snapshot = await getDocs(ordersCollection);

  const orders: Order[] = snapshot.docs.map((document) => {
    return {
      ...(document.data() as Order),
      id: document.id,
    };
  });

  orders.sort((a, b) => {
    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  return orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<void> {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    status,
  });
}