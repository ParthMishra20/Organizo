import {
  Container,
  VStack,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { CheckIcon, EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getTasks, createTask, updateTask, deleteTask } from '../../utils/supabase';
import Card from '../../components/shared/Card';
import StyledBadge from '../../components/shared/StyledBadge';
import AnimatedBox, { ListAnimation } from '../../components/shared/AnimatedBox';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    name: '',
    date: '',
    time: '',
    priority: 'medium'
  });
  const [editingTask, setEditingTask] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useUser();

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching tasks',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewTask(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!newTask.name || !newTask.date) {
      toast({
        title: 'Error',
        description: 'Task name and date are required',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      const taskWithUserId = {
        ...newTask,
        user_id: user.id
      };

      await createTask(taskWithUserId);
      await fetchTasks();

      setNewTask({
        name: '',
        date: '',
        time: '',
        priority: 'medium'
      });

      toast({
        title: 'Success',
        description: 'Task added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    onOpen();
  };

  const handleUpdate = async () => {
    if (!editingTask.name || !editingTask.date) {
      toast({
        title: 'Error',
        description: 'Task name and date are required',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      await updateTask(editingTask.id, editingTask);
      await fetchTasks();
      onClose();
      setEditingTask(null);

      toast({
        title: 'Success',
        description: 'Task updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      await fetchTasks();
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await fetchTasks();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text>Loading tasks...</Text>
        </VStack>
      </Container>
    );
  }

  const TaskTable = ({ tasks }) => (
    <Box borderRadius="lg" borderWidth="1px" overflow="hidden">
      <Table variant="simple">
        <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
          <Tr>
            <Th py={4} px={6} textAlign="left" width="30%">Task</Th>
            <Th py={4} px={6} textAlign="center" width="20%">Date</Th>
            <Th py={4} px={6} textAlign="center" width="15%">Time</Th>
            <Th py={4} px={6} textAlign="center" width="15%">Priority</Th>
            <Th py={4} px={6} textAlign="right" width="20%">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task, index) => (
            <ListAnimation key={task.id} index={index}>
              <Tr
                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                transition="background-color 0.2s"
                opacity={task.completed ? 0.7 : 1}
              >
                <Td py={4} px={6}>
                  <Text
                    textDecoration={task.completed ? 'line-through' : 'none'}
                    color={task.completed ? 'gray.500' : 'inherit'}
                    fontWeight="medium"
                  >
                    {task.name}
                  </Text>
                </Td>
                <Td py={4} px={6} textAlign="center">
                  {new Date(task.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Td>
                <Td py={4} px={6} textAlign="center">
                  {task.time ? new Date(`1970-01-01T${task.time}`).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) : '-'}
                </Td>
                <Td py={4} px={6} textAlign="center">
                  <StyledBadge type={task.priority}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </StyledBadge>
                </Td>
                <Td py={4} px={6} textAlign="right">
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      icon={<CheckIcon />}
                      colorScheme={task.completed ? 'green' : 'gray'}
                      onClick={() => handleToggleComplete(task)}
                      aria-label="Toggle complete"
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => handleEdit(task)}
                      aria-label="Edit task"
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(task.id)}
                      aria-label="Delete task"
                      size="sm"
                      variant="ghost"
                    />
                  </HStack>
                </Td>
              </Tr>
            </ListAnimation>
          ))}
          {tasks.length === 0 && (
            <Tr>
              <Td colSpan={5} textAlign="center" py={8}>
                <Text color="gray.500">No tasks found</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <AnimatedBox>
          <Card>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Create New Task</Heading>
                <FormControl isRequired>
                  <FormLabel>Task Name</FormLabel>
                  <Input
                    name="name"
                    value={newTask.name}
                    onChange={handleInputChange}
                    placeholder="Enter task name"
                    size="lg"
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      name="date"
                      value={newTask.date}
                      onChange={handleInputChange}
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Time</FormLabel>
                    <Input
                      type="time"
                      name="time"
                      value={newTask.time}
                      onChange={handleInputChange}
                      size="lg"
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    size="lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormControl>

                <Button
                  colorScheme="brand"
                  size="lg"
                  onClick={handleSubmit}
                  leftIcon={<AddIcon />}
                >
                  Add Task
                </Button>
              </VStack>

              <VStack align="stretch" spacing={4}>
                <Heading size="md">Task Overview</Heading>
                <SimpleGrid columns={2} spacing={4}>
                  <Card
                    _hover={{ transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={4} p={2}>
                      <Icon
                        as={FaTasks}
                        boxSize={8}
                        color="brand.500"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                          {activeTasks.length}
                        </Text>
                        <Text fontSize="sm" color="gray.500">Active Tasks</Text>
                        {activeTasks.length > 0 && (
                          <Text fontSize="xs" color="gray.500">
                            Next due: {
                              new Date(
                                Math.min(...activeTasks.map(t => new Date(t.date)))
                              ).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short'
                              })
                            }
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Card>
                  <Card
                    _hover={{ transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={4} p={2}>
                      <Icon
                        as={CheckIcon}
                        boxSize={8}
                        color="green.500"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="3xl" fontWeight="bold" color="green.500">
                          {completedTasks.length}
                        </Text>
                        <Text fontSize="sm" color="gray.500">Completed Tasks</Text>
                        <Text fontSize="xs" color="gray.500">
                          {Math.round((completedTasks.length / (activeTasks.length + completedTasks.length || 1)) * 100)}% Complete
                        </Text>
                      </VStack>
                    </HStack>
                  </Card>
                </SimpleGrid>
              </VStack>
            </SimpleGrid>
          </Card>
        </AnimatedBox>

        <AnimatedBox delay={0.2}>
          <Card>
            <Tabs variant="enclosed" colorScheme="brand">
              <TabList>
                <Tab>Active Tasks ({activeTasks.length})</Tab>
                <Tab>Completed Tasks ({completedTasks.length})</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {activeTasks.length > 0 ? (
                    <TaskTable tasks={activeTasks} />
                  ) : (
                    <Text textAlign="center" py={4}>No active tasks</Text>
                  )}
                </TabPanel>
                <TabPanel>
                  {completedTasks.length > 0 ? (
                    <TaskTable tasks={completedTasks} />
                  ) : (
                    <Text textAlign="center" py={4}>No completed tasks</Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </AnimatedBox>
      </VStack>

      {/* Edit Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Task Name</FormLabel>
                <Input
                  name="name"
                  value={editingTask?.name || ''}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={editingTask?.date || ''}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  name="time"
                  value={editingTask?.time || ''}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  name="priority"
                  value={editingTask?.priority || 'medium'}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default TaskManager;