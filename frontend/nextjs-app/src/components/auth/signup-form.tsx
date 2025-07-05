'use client';
import { signup } from '@/actions/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { SignupFormValues } from '@/schemas/authSchemas';
import { signupFormSchema } from '@/schemas/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState(signup, { error: null });

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Sign up with your email and password</CardDescription>
          {state.error && (
            <div className="mt-2 text-center text-sm text-red-500">{state.error}</div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input id="email" type="email" placeholder="m@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              id="password"
                              title="Password (min. 8 characters, including uppercase, lowercase, number, and symbol)"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    formAction={formAction}
                    className="w-full cursor-pointer"
                    disabled={isPending || !form.formState.isValid}
                  >
                    {isPending ? <LoadingSpinner className="size-7" /> : 'Sign up'}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  have an account?{' '}
                  <a href="/login" className="underline underline-offset-4">
                    Log in
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
