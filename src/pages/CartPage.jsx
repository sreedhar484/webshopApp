import { useState, useEffect } from "react";
import { Box, Text, Button, VStack, HStack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(sessionStorage.getItem("cart")) || []);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const incrementQuantity = (id) => {

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Find the product with the matching id in the cart
    const updatedCart = cart.map((product) => {
    if (product.id === id && product.quantity<10) {
      // Increment the quantity of the matched product
      return { ...product, quantity: product.quantity + 1 };
    }
    return product; // Return other products as they are
  });

  // Save the updated cart back to sessionStorage
  sessionStorage.setItem("cart", JSON.stringify(updatedCart));

  // Optionally, update the state if you're rendering the cart in the component
  setCart(updatedCart);
  };


  const decrementQuantity = (id) => {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

        // Find the product with the matching id in the cart
          const updatedCart = cart.map((product) => {
          if (product.id === id && product.quantity>1) {
            // Increment the quantity of the matched product
            return { ...product, quantity: product.quantity - 1 };
          }
          return product; // Return other products as they are
        });
      
        // Save the updated cart back to sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      
        // Optionally, update the state if you're rendering the cart in the component
        setCart(updatedCart);
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">Shopping Cart</Text>
      {cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {cart.map((item) => (
            <HStack key={item.id} spacing={4} borderWidth="1px" p={4} borderRadius="lg">
              <Image src={item.image} alt={item.name} boxSize="100px" />
              <Box>
                <Text fontSize="lg" fontWeight="bold">{item.name}</Text>
                <Box>Quantity: <Button color={"white"} onClick={() => decrementQuantity(item.id)} isDisabled={item.quantity <= 1}>-</Button>{item.quantity}<Button color={"white"} onClick={() => incrementQuantity(item.id)} isDisabled={item.quantity >= 10}>+</Button></Box>
                <Text>€{item.price * item.quantity}</Text>
              </Box>
              <Button colorScheme="red" color={"white"} onClick={() => removeFromCart(item.id)}>Remove</Button>
            </HStack>
          ))}
        </VStack>
      )}
      <Button as={Link} to="/" colorScheme="blue" mr={2} mt={4}>Continue Shopping</Button>
      {cart.length>0 ?  <Button as={Link} to="/order-summary" colorScheme="green" mt={4}>
  View Order Summary
</Button>:<text></text>}
      
    </Box>
  );
};

export default CartPage;
