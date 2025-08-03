import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

const FeaturedSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 6vw, 2rem);
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  height: 250px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ProductImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProductImageFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 4rem;
`;

const Badge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #059669;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 10;
`;

const ProductContent = styled.div`
  padding: 1.5rem;
`;

const ProductTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ProductFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FeatureTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #94a3b8;
  text-decoration: line-through;
`;

const AddToCartButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #d97706;
    transform: translateY(-2px);
  }
`;

const ViewAllButton = styled(motion.button)`
  background: transparent;
  color: #f59e0b;
  border: 2px solid #f59e0b;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;

  &:hover {
    background: #f59e0b;
    color: white;
    transform: translateY(-2px);
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const featuredProducts = [
  {
    id: 1,
    name: 'Fresh Milk',
    description: 'Pure, unprocessed milk with all natural probiotics intact. Delivered within 3 hours of milking.',
    price: 135,
    originalPrice: 150,
    features: ['Organic', 'No Hormones', '3-Hour Delivery'],
    badge: 'Premium',
    icon: '🥛',
    image: '/images/freshmilk.jpeg',
    unit: 'L'
  },
  {
    id: 6,
    name: 'Organic Ghee',
    description: 'Traditional Vedic method ghee with rich, nutty flavor from milk.',
    price: 3000,
    originalPrice: 3500,
    features: ['Vedic Method', 'Pure', 'Rich Flavor'],
    badge: 'Traditional',
    icon: '🧈',
    image: '/images/orghanic ghee.jpg',
    unit: 'kg'
  },
  {
    id: 4,
    name: 'Curd (Dahi)',
    description: 'Traditional curd made from milk, rich in probiotics and natural cultures.',
    price: 80,
    originalPrice: 90,
    features: ['Probiotics', 'Traditional', 'Natural Cultures'],
    badge: 'Traditional',
    icon: '🍶',
    image: '/images/curd.jpeg',
    unit: 'kg'
  }
];

interface FeaturedProductsProps {
  cart?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    features?: string[];
    badge?: string;
    icon?: string;
    unit?: string;
  }>;
  setCart?: React.Dispatch<React.SetStateAction<Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    features?: string[];
    badge?: string;
    icon?: string;
    unit?: string;
  }>>>;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ cart = [], setCart }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    scrollToTop();
    navigate('/products');
  };

  const handleAddToCart = (product: any) => {
    if (setCart) {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    }
  };

  return (
    <FeaturedSection>
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Featured Products</SectionTitle>
          <SectionSubtitle>
            Discover our most popular dairy products, carefully selected for their quality and taste
          </SectionSubtitle>
        </SectionHeader>

        <ProductsGrid>
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <ProductImage>
                <ProductImageContent 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <ProductImageFallback style={{ display: 'none' }}>
                  {product.icon}
                </ProductImageFallback>
                <Badge>{product.badge}</Badge>
              </ProductImage>
              
              <ProductContent>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductDescription>{product.description}</ProductDescription>
                
                <ProductFeatures>
                  {product.features.map((feature, idx) => (
                    <FeatureTag key={idx}>{feature}</FeatureTag>
                  ))}
                </ProductFeatures>

                <ProductFooter>
                  <PriceContainer>
                    <CurrentPrice>₹{product.price}</CurrentPrice>
                    <OriginalPrice>₹{product.originalPrice}</OriginalPrice>
                  </PriceContainer>
                  
                  <AddToCartButton onClick={() => handleAddToCart(product)}>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </AddToCartButton>
                </ProductFooter>
              </ProductContent>
            </ProductCard>
          ))}
        </ProductsGrid>

        <ButtonContainer>
          <ViewAllButton
            onClick={handleViewAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package size={20} />
            View All Products
            <ArrowRight size={20} />
          </ViewAllButton>
        </ButtonContainer>
      </Container>
    </FeaturedSection>
  );
};

export default FeaturedProducts; 