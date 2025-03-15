import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './Modal';

const budgetSchema = z.object({
  initialBalance: z.number()
    .min(0, 'Initial balance cannot be negative')
    .max(1000000000, 'Initial balance is too high'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface InitialBudgetModalProps {
  isOpen: boolean;
  onSubmit: (amount: number) => void;
}

export default function InitialBudgetModal({ isOpen, onSubmit }: InitialBudgetModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
  });

  const handleFormSubmit = (data: BudgetFormData) => {
    onSubmit(data.initialBalance);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Set Initial Balance"
    >
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Please enter your current balance to get started with budget tracking.
          You can update this amount on the 1st of every month.
        </p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Balance (₹)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('initialBalance', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.initialBalance && (
              <p className="mt-1 text-sm text-red-600">{errors.initialBalance.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Set Initial Balance
          </button>
        </form>
      </div>
    </Modal>
  );
}