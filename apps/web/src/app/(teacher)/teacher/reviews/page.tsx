'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ClipboardCheck,
  ArrowRight,
  User,
  Code2,
  Hash,
  Calendar,
  Inbox,
  CheckCircle2,
} from 'lucide-react';

interface PendingSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  code: string;
  language: string;
  status: string;
  score: number;
  maxScore: number;
  attemptNumber: number;
  createdAt: string;
  studentName: string;
  assignmentTitle: string;
}

export default function TeacherReviewsPage() {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await apiClient.get<PendingSubmission[]>('/submissions/pending-reviews');
      if (response.success && response.data) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error('Failed to load submissions', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="flex gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="h-9 w-24 bg-emerald-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Проверка работ</h1>
            <p className="text-emerald-100 text-sm mt-0.5">
              {submissions.length > 0
                ? `${submissions.length} работ ожидают проверки`
                : 'Все работы проверены'}
            </p>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 animate-slide-up">
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="p-4 bg-emerald-50 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Все работы проверены!</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Нет работ, ожидающих проверки. Новые работы появятся здесь автоматически.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, index) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-300 group animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                      <ClipboardCheck className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {sub.assignmentTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <User className="w-3.5 h-3.5" />
                          {sub.studentName}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Code2 className="w-3.5 h-3.5" />
                          {sub.language}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Hash className="w-3.5 h-3.5" />
                          Попытка {sub.attemptNumber}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(sub.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/teacher/reviews/${sub.id}`}>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium shadow-sm group/btn"
                    >
                      Проверить
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
