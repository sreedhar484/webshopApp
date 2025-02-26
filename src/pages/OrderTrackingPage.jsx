import { useState } from "react";
import axios from "axios";
import { Box, Input, Button, Text, VStack, HStack, Separator, Spinner } from "@chakra-ui/react";
import { toaster,Toaster } from "../components/ui/toaster"

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const trackOrder = async () => {
    if (!orderId) {
      toaster.create({
        title: "Error",
        description: "Please enter a valid Order ID.",
        type: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/orders/${orderId}/`);
      setOrder(response.data);
      console.log(response.data);
    } catch (error) {
      toaster.create({
        title: "Order Not Found",
        description: "No order found with the provided ID.",
        type: "error",
        duration: 2000,
        isClosable: true,
      });
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotalPrice = () => {
    if (!order || !order.items) return 0;
    return order.items.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  };
  return (
    <Box p={5} maxW="500px" mx="auto">
        <Toaster/>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Track Your Order</Text>
      <HStack>
        <Input 
          placeholder="Enter Order ID" 
          value={orderId} 
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button colorScheme="blue" onClick={trackOrder}>Track</Button>
      </HStack>

      {loading && <Spinner mt={4} />}

      {order && (
        <VStack mt={6} p={4} borderWidth="1px" borderRadius="lg" align="stretch">
          <Text fontSize="lg" fontWeight="bold">Order ID: {order.id}</Text>
          <Text>Status: <strong>{order.status}</strong></Text>
          <Separator />
          <Text fontSize="lg" fontWeight="bold">Customer details :</Text>
          <Text>Name: <strong>{order.customer_name}</strong></Text>
          <Text>mail: <strong>{order.customer_email}</strong></Text>
          <Text>Ordered data and Time: <strong>{order.created_at}</strong></Text>
          <Text>Address: <strong>{order.address} {order.city} {order.zip_code} {order.country}</strong></Text>
          <Separator />
          <Text fontSize="lg" fontWeight="bold">Order Details:</Text>
          {order.items.map((item) => (
            <HStack key={item.id} spacing={4} borderWidth="1px" p={2} borderRadius="md">
              <Text>{item.quantity} x {item.product.name}</Text>
              <Text>€{(item.quantity * item.product.price).toFixed(2)}</Text>
            </HStack>
          ))}
          <Separator/>
          <Text fontSize="lg" fontWeight="bold">Total: €{calculateTotalPrice().toFixed(2)}</Text>
        </VStack>
      )}
    </Box>
  );
};

export default OrderTrackingPage;
