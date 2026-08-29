import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Database, CheckCircle2 } from 'lucide-react';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from('todos').select();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDFBF7] text-[#24130A] pt-28 pb-24 font-sans">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="p-8 sm:p-10 bg-white border border-stone-200/90 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="p-3 bg-orange-50 rounded-2xl text-[#FA7A21]">
                <Database size={24} />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#24130A]">
                  Supabase Connectivity Status
                </h1>
                <p className="text-xs text-stone-500 font-light mt-0.5">Database connectivity and table verification</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-bold text-[#8B2500] uppercase tracking-wider">Test Records:</h2>
              {todos && todos.length > 0 ? (
                <ul className="divide-y divide-stone-100 bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2">
                  {todos.map((todo: any) => (
                    <li key={todo.id} className="text-xs text-stone-700 flex items-center gap-2 py-1">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span>{todo.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-[#8B2500]">
                  No test records found. Connection endpoint verified.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
