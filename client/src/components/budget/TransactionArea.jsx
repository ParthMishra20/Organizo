import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  HStack,
  Icon,
  Heading,
  useColorModeValue,
  SimpleGrid,
  TableContainer,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import useErrorHandler from '../../hooks/useErrorHandler';
import { FaMoneyBillWave, FaChartPie, FaHandHoldingUsd } from 'react-icons/fa';
import { getTransactions, createTransaction } from '../../utils/supabase';
import Card from '../shared/Card';
import StyledBadge from '../shared/StyledBadge';
import AnimatedBox, { ListAnimation } from '../shared/AnimatedBox';
import { formatCurrency, getTransactionTags, getTagColor } from '../../utils/formatters';

const TransactionArea = ({ onTransactionAdd }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'spend',
    date: '',
    amount: '',
    description: '',
    tag: ''
  });

  const { handleError, showSuccess } = useErrorHandler();
  const { user } = useUser();
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700');
  const tableBorderColor = useColorModeValue('gray.200', 'gray.600');
  const tableRowHoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      if (!data) {
        handleError(new Error('No transactions found'));
        setTransactions([]);
        return;
      }
      
      // Sort transactions by date (newest first)
      const sortedData = [...data].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );
      
      setTransactions(sortedData);
    } catch (error) {
      handleError(error, 'Error fetching transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateTransaction = (data, type) => {
    if (!data.date) throw new Error('Date is required');
    if (!data.description) throw new Error('Description is required');
    if (!data.amount || isNaN(data.amount) || parseFloat(data.amount) <= 0) {
      throw new Error('Please enter a valid amount greater than 0');
    }
    
    // Validate tag based on type
    if (type === 'invest' && !data.tag) {
      throw new Error('Please select an investment category');
    }
    if (type === 'spend' && !data.tag) {
      throw new Error('Please select a spending category');
    }
  };

  const handleSubmit = async (type) => {
    try {
      validateTransaction(newTransaction, type);

      const transaction = {
        ...newTransaction,
        type,
        user_id: user.id,
        amount: parseFloat(newTransaction.amount),
        date: newTransaction.date || new Date().toISOString().split('T')[0]
      };

      const createdTransaction = await createTransaction(transaction);
      onTransactionAdd(createdTransaction);
      await fetchTransactions();

      // Reset form
      setNewTransaction({
        type: 'spend',
        date: '',
        amount: '',
        description: '',
        tag: ''
      });

      showSuccess(
        'Transaction Added',
        `${type.charAt(0).toUpperCase() + type.slice(1)} transaction has been recorded`
      );
    } catch (error) {
      handleError(error);
    }
  };

  if (loading) {
    return (
      <Card>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text>Loading transactions...</Text>
        </VStack>
      </Card>
    );
  }

  const transactionTypes = [
    { type: 'spend', icon: FaMoneyBillWave, color: 'red.500' },
    { type: 'invest', icon: FaChartPie, color: 'purple.500' },
    { type: 'receive', icon: FaHandHoldingUsd, color: 'green.500' }
  ];

  return (
    <Card>
      <VStack spacing={6} align="stretch">
        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            {transactionTypes.map(({ type, icon: IconComponent, color }) => (
              <Tab key={type}>
                <HStack spacing={2}>
                  <Icon as={IconComponent} color={color} />
                  <Text>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                </HStack>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {transactionTypes.map(({ type }) => (
              <TabPanel key={type} p={4}>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Date</FormLabel>
                      <Input
                        type="date"
                        name="date"
                        value={newTransaction.date}
                        onChange={handleInputChange}
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Amount</FormLabel>
                      <Input
                        type="number"
                        name="amount"
                        placeholder="Enter amount"
                        value={newTransaction.amount}
                        onChange={handleInputChange}
                        size="lg"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input
                      name="description"
                      placeholder="Enter description"
                      value={newTransaction.description}
                      onChange={handleInputChange}
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="tag"
                      value={newTransaction.tag}
                      onChange={handleInputChange}
                      size="lg"
                    >
                      <option value="">Select category</option>
                      {getTransactionTags(type).map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    colorScheme="brand"
                    size="lg"
                    onClick={() => handleSubmit(type)}
                    leftIcon={<Icon as={transactionTypes.find(t => t.type === type).icon} />}
                  >
                    Add {type.charAt(0).toUpperCase() + type.slice(1)} Transaction
                  </Button>
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Transaction History */}
        <VStack spacing={4} align="stretch">
          <Heading size="md">Transaction History</Heading>
          <Box
            borderRadius="lg"
            borderWidth="1px"
            borderColor={tableBorderColor}
            overflow="hidden"
          >
            <TableContainer maxH="600px" overflowY="auto">
              <Table variant="simple" size="md" position="relative">
                <Thead
                  position="sticky"
                  top={0}
                  bg={tableHeaderBg}
                  zIndex={1}
                  boxShadow="0 1px 2px rgba(0,0,0,0.1)"
                >
                  <Tr>
                    <Th width="15%" textAlign="center" px={6} py={4}>Date</Th>
                    <Th width="15%" textAlign="center" px={6} py={4}>Type</Th>
                    <Th width="35%" textAlign="center" px={6} py={4}>Description</Th>
                    <Th width="20%" textAlign="center" px={6} py={4}>Amount</Th>
                    <Th width="15%" textAlign="center" px={6} py={4}>Category</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={8}>
                        <Text color="gray.500">No transactions found</Text>
                      </Td>
                    </Tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <ListAnimation key={transaction.id} index={index}>
                        <Tr
                          _hover={{ bg: tableRowHoverBg }}
                          transition="background-color 0.2s"
                        >
                          <Td textAlign="center" px={6} py={4}>
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </Td>
                          <Td textAlign="center" px={6} py={4}>
                            <StyledBadge type={transaction.type}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </StyledBadge>
                          </Td>
                          <Td textAlign="center" px={6} py={4}>
                            {transaction.description}
                          </Td>
                          <Td textAlign="center" px={6} py={4}>
                            <Text
                              color={
                                transaction.type === 'receive' ? 'green.500' :
                                transaction.type === 'invest' ? 'blue.500' :
                                'red.500'
                              }
                              fontWeight="semibold"
                            >
                              {transaction.type === 'spend' || transaction.type === 'invest' ? '- ' : '+ '}
                              {formatCurrency(transaction.amount)}
                            </Text>
                          </Td>
                          <Td textAlign="center" px={6} py={4}>
                            <StyledBadge type={getTagColor(transaction.tag)}>
                              {transaction.tag ?
                                transaction.tag.charAt(0).toUpperCase() + transaction.tag.slice(1)
                                : '-'
                              }
                            </StyledBadge>
                          </Td>
                        </Tr>
                      </ListAnimation>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </VStack>
      </VStack>
    </Card>
  );
};

export default TransactionArea;