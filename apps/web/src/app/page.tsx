import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Code Learning Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Образовательная платформа для изучения Python и C++ для 7 класса
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Войти</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Регистрация
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-2">🐍 Python</h3>
            <p className="text-gray-600 dark:text-gray-400">
              20 уроков от базового синтаксиса до ООП
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-2">⚡ C++</h3>
            <p className="text-gray-600 dark:text-gray-400">
              20 уроков от основ до STL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
