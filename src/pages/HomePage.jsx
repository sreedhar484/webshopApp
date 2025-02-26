import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Image, Text, Button, useBreakpointValue, Input, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { InputGroup } from  "../components/ui/input-group";

const HomePage = () => {
  const [products, setProducts] = useState([]);  // Stores all products from API
  const [filteredProducts, setFilteredProducts] = useState([]);  // Stores the search results
  const [searchQuery, setSearchQuery] = useState("");  // Stores user input

  const flexDirection = useBreakpointValue({ base: "column", md: "row" });
  const imageSize = useBreakpointValue({ base: "150px", md: "200px" });

  // Function to truncate text
  const truncateText = (text, limit) => (text.length > limit ? text.slice(0, limit) + "..." : text);

  // Fetch products from API
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Set filteredProducts initially to all products
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // Function to filter products based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products);  // Reset when search is empty
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <Box p={2}>
      {/* Search Bar */}
      <HStack gap="10" width="full" m={2}>
        <InputGroup flex="1" startElement={<LuSearch />}>
          <Input
            placeholder="Search items"
            value={searchQuery}  // Bind input value
            onChange={(e) => handleSearch(e.target.value)}  // Trigger search on input change
          />
        </InputGroup>
      </HStack>

      {/* Product Grid */}
      <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Box 
              key={product.id} 
              background="white" 
              borderWidth="1px" 
              borderRadius="lg" 
              p={2} 
              display="flex"
              flexDirection={flexDirection}
              alignItems="center"
              justifyContent="space-between"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                boxSize={imageSize} 
                objectFit="cover" 
                borderRadius="md"
              />
              <Box textAlign={{ base: "center", md: "left" }} ml={{ md: 4 }}>
                <Text fontSize="xl" color="black" fontWeight="bold">{truncateText(product.name, 30)}</Text>
                <Text fontSize="lg" color="black">€{product.price}</Text>
                <Button 
                  as={Link} 
                  to={`/product/${product.id}`} 
                  color="white" 
                  bg="blue.500" 
                  mt={2} 
                  _hover={{ bg: "blue.600" }}
                  size="sm"
                >
                  View Details
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Text>No products found</Text>
        )}
      </Grid>
    </Box>
  );
};

export default HomePage;
