import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Balance from '@/components/budget/Balance';
import Charts from '@/components/budget/Charts';
import TransactionForm from '@/components/budget/TransactionForm';
import TransactionHistory from '@/components/budget/TransactionHistory';

export default async function BudgetBuddy() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Fetch all transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Balance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Balance 
          balance={profile?.current_balance || 0}
          startingIncome={profile?.starting_income}
        />
        
        {/* Transaction Form */}
        <TransactionForm onSuccess={() => null} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <Charts transactions={transactions || []} />
      </div>

      {/* Transaction History */}
      <div className="grid grid-cols-1 gap-6">
        <TransactionHistory transactions={transactions || []} />
      </div>
    </div>
  );
}