'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Code2, Terminal, Braces, BookOpen, Trophy, Zap, Users, GraduationCap } from 'lucide-react';

interface PublicStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/stats/public`);
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-sidebar" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-60" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CodePlatform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            Учись программировать
            <br />
            <span className="text-indigo-300">с 7 по 11 класс</span>
          </h1>
          <p className="text-lg text-slate-300 mt-6 max-w-xl">
            Интерактивная платформа с курсами Python и C++, встроенным редактором кода и автоматической проверкой заданий
          </p>

          {/* Stats badges */}
          {stats && stats.totalUsers > 0 && (
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Users className="w-5 h-5 text-indigo-300" />
                <span className="text-white font-semibold">{stats.totalUsers}</span>
                <span className="text-slate-300 text-sm">пользователей</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <GraduationCap className="w-5 h-5 text-emerald-300" />
                <span className="text-white font-semibold">{stats.totalStudents}</span>
                <span className="text-slate-300 text-sm">учеников</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors shadow-lg">
              Войти
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Возможности платформы</h2>
        <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
          Всё, что нужно для обучения программированию в школе
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <Terminal className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Редактор кода</h3>
            <p className="text-sm text-slate-500">Встроенный Monaco Editor с подсветкой синтаксиса и автодополнением</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Braces className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Python и C++</h3>
            <p className="text-sm text-slate-500">Курсы для всех уровней — от основ до сложных алгоритмов</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Автопроверка</h3>
            <p className="text-sm text-slate-500">Мгновенная проверка решений по тест-кейсам с подробным отчётом</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Домашние задания</h3>
            <p className="text-sm text-slate-500">Учитель назначает ДЗ, ученики решают, результаты видны сразу</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Достижения</h3>
            <p className="text-sm text-slate-500">Система наград за прохождение курсов и решение задач</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">190 уроков</h3>
            <p className="text-sm text-slate-500">950 практических заданий по Python, C++ и информационной безопасности</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Code2 className="w-4 h-4" />
            <span>CodePlatform — Лицей Иннополис</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/login" className="hover:text-slate-600 transition-colors">Вход</Link>
            <Link href="/register" className="hover:text-slate-600 transition-colors">Регистрация</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
