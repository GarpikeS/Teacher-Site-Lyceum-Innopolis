'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { User } from '@code-platform/shared-types';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/courses', label: 'Курсы' },
  { href: '/homework', label: 'ДЗ' },
  { href: '/achievements', label: 'Достижения' },
  { href: '/notifications', label: 'Уведомления' },
  { href: '/profile', label: 'Профиль' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <h1 className="text-2xl font-bold">Code Platform</h1>
              <nav className="hidden md:flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</span>
              <Button onClick={() => { authService.logout(); router.push('/login'); }} variant="outline" size="sm">
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
