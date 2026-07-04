"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

export default function ObserverList() {
  const router = useRouter();
  const [observers, setObservers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Ambil data semua observer
      const { data: dataObservers } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'observer');
      
      // 2. Ambil data semua kelas
      const { data: dataClasses } = await supabase
        .from('classes')
        .select('*');

      setObservers(dataObservers || []);
      setClasses(dataClasses || []);
      setLoading(false);
    }
    
    fetchData();
  }, []);

  // Fungsi untuk mencari kelas apa saja yang diikuti oleh observer tertentu
  const getObserverClasses = (inisial) => {
    return classes.filter(cls => cls.observers && cls.observers.includes(inisial));
  };

  return (
    <div className="flex min-h-screen bg-[#EFF3FB]" style={{fontFamily:"'Segoe UI',sans-serif"}}>
      
      {/* ── SIDEBAR SEDERHANA ── */}
      <aside className="w-[220px] min-h-screen bg-white flex flex-col shadow-md flex-shrink-0">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-100">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base">E</div>
          <div>
            <div className="font-bold text-sm text-slate-800">Edvisor</div>
            <div className="text-xs text-slate-400">Lesson Study</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <button onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left text-slate-500 hover:bg-[#EFF3FB] hover:text-blue-600 transition-all">
            <span className="w-5 text-center text-base">🏠</span> Beranda
          </button>
          <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left bg-blue-600 text-white transition-all">
            <span className="w-5 text-center text-base">👁️</span> Daftar Observer
          </button>
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push("/dashboard")}
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-lg hover:border-blue-500 hover:text-blue-600 transition">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Daftar Observer</h1>
            <p className="text-sm text-slate-500 mt-1">Detail penugasan observer pada kelas Lesson Study</p>
          </div>
        </div>

        {/* Tabel Data Observer */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Profil Observer</th>
                <th className="px-6 py-4 font-semibold">Total Kelas</th>
                <th className="px-6 py-4 font-semibold">Kelas yang Diobservasi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-slate-400 font-medium">Memuat data dari database...</td>
                </tr>
              ) : observers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-slate-400 font-medium">Tidak ada data observer.</td>
                </tr>
              ) : (
                observers.map(obs => {
                  const assignedClasses = getObserverClasses(obs.initial);
                  return (
                    <tr key={obs.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{backgroundColor: obs.color}}>
                            {obs.initial}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-base">{obs.name}</div>
                            <div className="text-xs text-slate-500">{obs.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-xs">
                          {assignedClasses.length} Kelas
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {assignedClasses.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {assignedClasses.map(cls => (
                              <div key={cls.id} className="border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs">
                                <span className="font-bold text-slate-700 block">{cls.nama}</span>
                                <span className="text-slate-400 block mt-0.5">{cls.tanggal}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Belum ada kelas</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}