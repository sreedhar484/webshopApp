import { Box, Flex, Spacer, Button, Image, Badge,Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, []);

  return (
    <Box bg="blue.500" width="99% " m={2} p={3} color="white" borderRadius="lg">
      <Flex align="center">
      <Link to="/">
        <Heading color="white">Webshop</Heading>
        </Link>
        <Spacer />
        <Button as={Link} to="/ordertracking" colorScheme="yellow" mx={2}>
          Track Order
        </Button>
        <Button as={Link} to="/cart" leftIcon={<FaShoppingCart />} colorScheme="yellow">
          Cart {cartCount > 0 && <Badge colorScheme="red">{cartCount}</Badge>}
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
