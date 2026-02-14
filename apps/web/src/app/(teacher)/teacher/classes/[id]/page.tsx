'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrolledCourses: number;
  completedLessons: number;
  totalSubmissions: number;
  passedSubmissions: number;
}

interface ClassDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  students: StudentInfo[];
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    loadClass();
  }, [classId]);

  const loadClass = async () => {
    try {
      const response = await apiClient.get<ClassDetail>(`/classes/${classId}`);
      if (response.success && response.data) {
        setClassData(response.data);
      }
    } catch (error) {
      console.error('Failed to load class', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;
    setIsAdding(true);
    setAddError('');

    try {
      const response = await apiClient.post(`/classes/${classId}/students`, { studentEmail });
      if (response.success) {
        setStudentEmail('');
        loadClass();
      }
    } catch (error: any) {
      setAddError(error.message || 'Ученик не найден');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка...</div>;
  if (!classData) return <div className="p-8">Класс не найден</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm">
        &larr; Назад к классам
      </button>

      <div>
        <h1 className="text-3xl font-bold">{classData.name}</h1>
        {classData.description && (
          <p className="text-gray-600 mt-1">{classData.description}</p>
        )}
      </div>

      {/* Add Student */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Добавить ученика</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStudent} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Email ученика</label>
              <Input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="student@school.ru"
                required
              />
            </div>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Добавление...' : 'Добавить'}
            </Button>
          </form>
          {addError && <p className="text-sm text-red-600 mt-2">{addError}</p>}
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Ученики ({classData.students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {classData.students.length === 0 ? (
            <p className="text-gray-500 text-sm">В классе пока нет учеников</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Ученик</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium text-center">Курсов</th>
                    <th className="pb-2 font-medium text-center">Уроков</th>
                    <th className="pb-2 font-medium text-center">Работ</th>
                    <th className="pb-2 font-medium text-center">Принято</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.students.map((student) => (
                    <tr key={student.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{student.firstName} {student.lastName}</td>
                      <td className="py-3 text-gray-500">{student.email}</td>
                      <td className="py-3 text-center">{student.enrolledCourses}</td>
                      <td className="py-3 text-center">{student.completedLessons}</td>
                      <td className="py-3 text-center">{student.totalSubmissions}</td>
                      <td className="py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded ${
                          student.passedSubmissions > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.passedSubmissions}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
