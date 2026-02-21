'use client';

import { Code2, Terminal, Braces } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CodePlatform</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Научись программировать
            <br />
            <span className="text-indigo-300">вместе с нами</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-md">
            Образовательная платформа для изучения Python и C++ с автоматической проверкой заданий
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-200">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Terminal className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <p className="font-medium">Встроенный редактор кода</p>
                <p className="text-sm text-slate-400">Пиши и запускай код прямо в браузере</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-200">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Braces className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="font-medium">Автоматическая проверка</p>
                <p className="text-sm text-slate-400">Мгновенная обратная связь по каждому заданию</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">CodePlatform</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
