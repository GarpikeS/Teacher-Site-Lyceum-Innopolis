'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ClassItem {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  createdAt: string;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await apiClient.get<ClassItem[]>('/classes');
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Failed to load classes', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setIsCreating(true);
    try {
      await apiClient.post('/classes', { name: formName, description: formDescription });
      setFormName('');
      setFormDescription('');
      setShowForm(false);
      loadClasses();
    } catch (error: any) {
      alert(error.message || 'Ошибка создания класса');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Мои классы</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : 'Создать класс'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Новый класс</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Например: 7А класс"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Краткое описание класса"
                  className="w-full border rounded p-2 text-sm"
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Создание...' : 'Создать'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {classes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            У вас пока нет классов. Создайте первый!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {classes.map((cls) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{cls.name}</h3>
                    {cls.description && (
                      <p className="text-sm text-gray-600 mt-1">{cls.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>{cls.studentCount} учеников</span>
                      <span>Создан: {new Date(cls.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  <Link href={`/teacher/classes/${cls.id}`}>
                    <Button variant="outline" size="sm">Подробнее</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
