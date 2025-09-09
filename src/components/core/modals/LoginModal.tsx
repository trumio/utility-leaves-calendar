import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import GenericModal from './GenericModal';
import { useCoreStore } from '@/stores/core-store';

const formSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

type FormData = yup.InferType<typeof formSchema>;

export default function LoginModal(props: LoginModalProps) {
  const { isOpen, onLogin } = props;
  const error = useCoreStore((state) => state.error);
  const form = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(data: FormData) {
    onLogin(data.username, data.password);
  }

  return (
    <GenericModal className="px-8 py-6" isOpen={isOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="text-center text-sm text-red-500">{error}</div>}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Username</FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="Enter username"
                    {...field}
                    className={form.formState.errors.username ? 'border-red-500' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Password</FormLabel> */}
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    className={form.formState.errors.password ? 'border-red-500' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </GenericModal>
  );
}

type LoginModalProps = {
  isOpen: boolean;
  onLogin: (username: string, password: string) => void;
};
