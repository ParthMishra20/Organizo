import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import TaskList from '@/components/tasks/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default async function TaskManager() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  // Fetch active tasks
  const { data: activeTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  // Fetch completed tasks
  const { data: completedTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('date', { ascending: false })
    .limit(10);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Task
        </h2>
        <CreateTaskForm />
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <TabsTrigger
            value="active"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            Active Tasks ({activeTasks?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            Completed Tasks ({completedTasks?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="active"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <TaskList tasks={activeTasks || []} />
        </TabsContent>

        <TabsContent
          value="completed"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <TaskList tasks={completedTasks || []} showCompleted />
        </TabsContent>
      </Tabs>
    </div>
  );
}