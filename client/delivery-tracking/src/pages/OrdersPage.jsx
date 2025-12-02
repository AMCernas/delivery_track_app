import OrderList from "../components/OrderList";
import OrderForm from "../components/OrderForm";

export default function OrdersPage() {
  return (
    <div>
      <h1>Orders</h1>

      {/* Form to create a new order */}
      <OrderForm />

      {/* List of existing orders */}
      <OrderList />
    </div>
  );
}
