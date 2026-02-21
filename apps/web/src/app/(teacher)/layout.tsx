'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { User } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/teacher/dashboard', label: 'Dashboard' },
  { href: '/teacher/classes', label: 'Классы' },
  { href: '/teacher/homework', label: 'Домашние задания' },
  { href: '/teacher/reviews', label: 'Проверка работ' },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Панель учителя</h1>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</span>
              <Button onClick={() => { authService.logout(); router.push('/login'); }} variant="outline">
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
