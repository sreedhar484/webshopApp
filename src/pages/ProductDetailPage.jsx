import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Image, Text, Button,Heading } from "@chakra-ui/react";
import { toaster,Toaster } from "../components/ui/toaster"

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
//   const toast = useToast();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}/`)
      .then(response => setProduct(response.data))
      .catch(error => console.error("Error fetching product:", error));
  }, [id]);

  const addToCart = () => {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Check if product is already in cart
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));

    toaster.create({
        description: "Product added successfully",
        type: "success",
      })
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <Box p={5} textAlign="center">
        <Toaster/>
      <Image src={product.image} alt={product.name} boxSize="300px" objectFit="cover" />
      <Text fontSize="2xl" fontWeight="bold">{product.name}</Text>
      <Text fontSize="xl" color="gray.600">€{product.price}</Text>
      <Text>{product.description}</Text>
      <Button mt={4} color={"white"}  colorScheme="blue" size="lg"onClick={addToCart}>Add to Cart</Button>
    </Box>
  );
};

export default ProductDetailPage;
