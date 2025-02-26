import { useState } from "react";
import axios from "axios";
import { 
  Box, Input, Select, Button, Text, VStack, HStack ,Separator 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toaster,Toaster } from "../components/ui/toaster"
import { createListCollection } from "@chakra-ui/react"
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../components/ui/select"


const CheckoutPage = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const payment_list = createListCollection({
    items: [
      { label: "Paypall", value: "paypall" },
    ],
  });
  const country_list = createListCollection({
    items: [
      { label: "USA", value: "USA" },
      { label: "Germany", value: "Germany" },
      { label: "India", value: "India" },
      { label: "UK", value: "UK" },
    ],
  });
  const handleOrder = async () => {
    if (!customerName || !customerEmail || !address || !city || !zip || !country) {
      toaster.create({
        description: "Please fill in all the required fields.",
        type: "error",
        duration:2000,
        isClosable:true,
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
      const response = await axios.post("http://127.0.0.1:8000/api/orders/place/", orderData);
      console.log(response)
      sessionStorage.setItem("order", JSON.stringify({
        id: response.data.id,
        customer_name: customerName,
        address: `${address}, ${city}, ${zip}, ${country}`,
        customer_email: customerEmail,
        total_price: totalPrice,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      }));
      sessionStorage.removeItem("cart");  // Clear cart after order is placed
      toaster.create({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
        type: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/order-confirmation"); // Redirect to confirmation page
    } catch (error) {
        toaster.create({
        title: "Order Failed",
        description: "An error occurred while placing your order.",
        type: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} maxW="500px" mx="auto">
        <Toaster/>
      <Text fontSize="2xl" fontWeight="bold">Checkout</Text>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <Input placeholder="Email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
        <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <HStack>
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input placeholder="Zip Code" value={zip} onChange={(e) => setZip(e.target.value)} />
        </HStack>
        
        <SelectRoot value={country} onChange={(e) => setCountry(e.target.value)} collection={country_list} size="sm" width="320px">
      <SelectLabel>Select Country</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {country_list.items.map((movie) => (
          <SelectItem item={movie} key={movie.value}>
            {movie.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
        <Separator/>

        <SelectRoot value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} collection={payment_list} size="sm" width="320px">
      <SelectLabel>Payment Method</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder="Select payment method" />
      </SelectTrigger>
      <SelectContent>
        {payment_list.items.map((movie) => (
          <SelectItem item={movie} key={movie.value}>
            {movie.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
        <Separator/>


        <Text fontSize="xl" fontWeight="bold">Total: ${totalPrice.toFixed(2)}</Text>
        <Button colorScheme="green" size="lg" onClick={handleOrder}>Place Order</Button>
      </VStack>
    </Box>
  );
};

export default CheckoutPage;
