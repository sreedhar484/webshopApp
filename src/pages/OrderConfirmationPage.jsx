import { useEffect, useState } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = JSON.parse(sessionStorage.getItem("order"));
    if (!storedOrder) {
      navigate("/");  // Redirect if no order is found
    } else {
      setOrder(storedOrder);
    }
  }, [navigate]);

  return (
    <Box p={5} maxW="500px" mx="auto" textAlign="center">
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" color="green.500">🎉 Order Placed Successfully!</Text>
        <Text>Your order has been placed successfully. You will receive a confirmation email shortly.</Text>

        {order ? (
          <Box p={4} borderWidth="1px" borderRadius="lg" width="100%">
            <Text fontSize="lg"><strong>Order ID:</strong> {order.id}</Text>
            <Text fontSize="lg"><strong>Customer Name:</strong> {order.customer_name}</Text>
            <Text fontSize="lg"><strong>Total Price:</strong> ${order.total_price.toFixed(2)}</Text>
          </Box>
        ) : (
          <Text>No order details available.</Text>
        )}

        <Button as={Link} to="/" colorScheme="blue">Back to Home</Button>
      </VStack>
    </Box>
  );
};

export default OrderConfirmationPage;
