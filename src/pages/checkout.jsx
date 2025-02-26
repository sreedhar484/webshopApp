import { useState } from "react";
import axios from "axios";
import { 
  Box, Input, Select, Button, Text, VStack, HStack, Divider, useToast 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
  const toast = useToast();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!customerName || !customerEmail || !address || !city || !zip || !country) {
      toast({
        title: "Error",
        description: "Please fill in all the required fields.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const orderData = {
      customer_name: customerName,
      customer_email: customerEmail,
      address: `${address}, ${city}, ${zip}, ${country}`,
      payment_method: paymentMethod,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders/place/`, orderData);
      sessionStorage.removeItem("cart");  // Clear cart after order is placed
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/order-confirmation", { state: { order: { id: response.data.id, customer_name: customerName, total_price: totalPrice } } });

    } catch (error) {
      toast({
        title: "Order Failed",
        description: "An error occurred while placing your order.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} maxW="500px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold">Checkout</Text>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <Input placeholder="Email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
        <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <HStack>
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input placeholder="Zip Code" value={zip} onChange={(e) => setZip(e.target.value)} />
        </HStack>
        <Select placeholder="Select Country" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="USA">USA</option>
          <option value="Germany">Germany</option>
          <option value="India">India</option>
          <option value="UK">UK</option>
        </Select>

        <Divider />

        <Text fontSize="lg" fontWeight="bold">Payment Method</Text>
        <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="PayPal">PayPal</option>
        </Select>

        <Divider />

        <Text fontSize="xl" fontWeight="bold">Total: ${totalPrice.toFixed(2)}</Text>
        <Button colorScheme="green" size="lg" onClick={handleOrder}>Place Order</Button>
      </VStack>
    </Box>
  );
};

export default CheckoutPage;
