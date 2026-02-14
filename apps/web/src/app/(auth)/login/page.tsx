'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      await authService.login(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Проверьте email и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Вход</CardTitle>
          <CardDescription className="text-center">
            Введите email и пароль для входа в систему
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Test credentials block - remove in production */}
      <Card className="border-dashed border-amber-300 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Тестовые аккаунты (пароль: password123)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button
            type="button"
            onClick={() => fillTestCredentials('admin@school.com')}
            className="w-full text-left text-xs px-3 py-2 rounded-md bg-white dark:bg-gray-800 border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-red-600">Admin:</span> admin@school.com
          </button>
          <button
            type="button"
            onClick={() => fillTestCredentials('teacher@school.com')}
            className="w-full text-left text-xs px-3 py-2 rounded-md bg-white dark:bg-gray-800 border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-blue-600">Teacher:</span> teacher@school.com
          </button>
          <button
            type="button"
            onClick={() => fillTestCredentials('student1@school.com')}
            className="w-full text-left text-xs px-3 py-2 rounded-md bg-white dark:bg-gray-800 border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-green-600">Student:</span> student1@school.com
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
