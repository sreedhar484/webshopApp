import { useEffect, useState } from "react";
import { Box, Text, VStack, HStack, Image, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const OrderSummaryPage = () => {
  const [cart, setCart] = useState([]);

  // Load cart from session storage
  useEffect(() => {
    setCart(JSON.parse(sessionStorage.getItem("cart")) || []);
  }, []);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Box p={5} maxW="600px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Order Summary</Text>
      
      {cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {cart.map((item) => (
            <HStack key={item.id} spacing={4} borderWidth="1px" p={4} borderRadius="lg">
              <Image src={item.image} alt={item.name} boxSize="80px" />
              <Box>
                <Text fontSize="lg" fontWeight="bold">{item.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>€{(item.price * item.quantity).toFixed(2)}</Text>
              </Box>
            </HStack>
          ))}
          
          <Text fontSize="xl" fontWeight="bold">Total: €{totalPrice.toFixed(2)}</Text>
          <Button as={Link} to="/checkout" colorScheme="blue" size="lg">
            Proceed to Payment
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default OrderSummaryPage;
