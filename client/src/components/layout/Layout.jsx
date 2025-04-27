import { Box, Container, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

const MotionBox = motion(Box);

const Layout = ({ children }) => {
  const location = useLocation();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const minH = 'calc(100vh - 64px)'; // Navbar height is 64px
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Mobile Sidebar */}
      <Sidebar isOpen={isOpen} onClose={onClose} />
      
      {/* Navbar with sidebar toggle */}
      <Navbar onSidebarOpen={onOpen} />
      
      <Box 
        as="main" 
        pt="64px" // Height of the navbar
        minH={minH}
        display="flex"
        flexDirection="column"
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            flex="1"
            display="flex"
            flexDirection="column"
          >
            {children}
          </MotionBox>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Layout;