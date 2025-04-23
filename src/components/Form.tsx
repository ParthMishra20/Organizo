import React from 'react';
import {
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  FormProvider,
  useFormContext,
  DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/styles';

interface FormProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const Form = <TFormValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  loading = false,
}: FormProps<TFormValues>) => {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
      >
        <fieldset disabled={loading} className={cn(loading && 'opacity-60')}>
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};

// Type-safe form configuration
type FormConfig<T extends FieldValues = FieldValues> = Omit<
  UseFormProps<T>,
  'resolver'
>;

// Type-safe schema-based form hook
function useZodForm<T extends z.ZodType<any, any>>(
  schema: T,
  config: FormConfig<z.infer<T>> = {}
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    ...config,
    resolver: zodResolver(schema),
  });
}

// Helper to infer form types from schema
type InferFormType<TSchema> = TSchema extends z.ZodType
  ? z.infer<TSchema>
  : never;

/* Example usage:
// Define your schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().default(false),
});

// Infer the type
type LoginForm = InferFormType<typeof formSchema>;

function LoginForm() {
  // Type-safe form hook
  const form = useZodForm(formSchema, {
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Type-safe submission handler
  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (error) {
      form.setError('root', {
        type: 'submit',
        message: 'Login failed',
      });
    }
  };

  // Type-safe form context usage
  function EmailField() {
    const { register, formState: { errors } } = useFormContext<LoginForm>();
    
    return (
      <FormInput
        {...register('email')}
        type="email"
        label="Email"
        error={errors.email?.message}
      />
    );
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <EmailField />
      
      <FormInput
        {...form.register('password')}
        type="password"
        label="Password"
        error={form.formState.errors.password?.message}
      />
      
      <FormCheckbox
        {...form.register('rememberMe')}
        label="Remember me"
      />
      
      {form.formState.errors.root && (
        <FormError>
          {form.formState.errors.root.message}
        </FormError>
      )}
      
      <Button 
        type="submit"
        loading={form.formState.isSubmitting}
      >
        Login
      </Button>
    </Form>
  );
}

// Advanced usage with nested forms
const userSchema = z.object({
  personal: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
  }),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean(),
  }),
  settings: z.object({
    language: z.string(),
    timezone: z.string(),
  }),
});

type UserForm = InferFormType<typeof userSchema>;

function UserSettingsForm() {
  const form = useZodForm(userSchema);

  // Type-safe nested form access
  function PersonalSection() {
    const { register } = useFormContext<UserForm>();
    
    return (
      <FormFieldGroup label="Personal Information">
        <FormInput
          {...register('personal.firstName')}
          label="First Name"
        />
        <FormInput
          {...register('personal.lastName')}
          label="Last Name"
        />
        <FormInput
          {...register('personal.email')}
          type="email"
          label="Email"
        />
      </FormFieldGroup>
    );
  }

  return (
    <Form form={form} onSubmit={(data: UserForm) => console.log(data)}>
      <PersonalSection />
      
      <FormFieldGroup label="Preferences">
        <FormSelect
          {...form.register('preferences.theme')}
          label="Theme"
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
        />
        
        <FormSwitch
          {...form.register('preferences.notifications')}
          label="Enable Notifications"
        />
      </FormFieldGroup>
    </Form>
  );
}
*/

export { Form, useZodForm, useFormContext };
export type { FormProps, FormConfig, InferFormType };