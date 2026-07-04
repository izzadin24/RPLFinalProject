"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function ObserverMode() {
  const router = useRouter();
  const [kode, setKode] = useState("");
  const [loading, setLoading] = useState(false);
  const [kelasData, setKelasData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function cariKelas() {
    if (!kode) return;
    setLoading(true);
    setErrorMsg("");
    setKelasData(null);

    // Cari kelas di Supabase berdasarkan kode
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("kode", kode.toUpperCase())
      .single();

    if (error || !data) {
      setErrorMsg("Kelas tidak ditemukan. Periksa kembali kode Anda.");
    } else {
      setKelasData(data);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#EFF3FB] flex flex-col items-center justify-center p-6" style={{fontFamily:"'Segoe UI',sans-serif"}}>
      
      {/* Header Sederhana */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">E</div>
        <h1 className="text-2xl font-bold text-slate-800">Portal Observer</h1>
        <p className="text-sm text-slate-500 mt-1">Masukkan kode kelas untuk bergabung</p>
      </div>

      {/* Box Input Kode */}
      <div className="bg-white rounded-2xl p-8 shadow-sm w-full max-w-md">
        <input 
          type="text" 
          value={kode} 
          onChange={e => setKode(e.target.value.toUpperCase())}
          placeholder="Contoh: EDV4D43"
          maxLength={7}
          className="w-full text-center text-2xl font-mono font-bold tracking-widest border-2 border-slate-200 rounded-xl px-4 py-4 mb-4 text-blue-600 outline-none focus:border-blue-500 transition" 
        />
        
        <button 
          onClick={cariKelas}
          disabled={loading || kode.length < 3}
          className={`w-full py-3.5 rounded-xl text-sm font-bold text-white transition ${loading || kode.length < 3 ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
          {loading ? "Mencari..." : "Cari Kelas"}
        </button>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium text-center rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Hasil Pencarian */}
      {kelasData && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm w-full max-w-md border-2 border-green-100">
          <div className="text-xs font-bold text-green-600 mb-1">KELAS DITEMUKAN</div>
          <h2 className="text-lg font-bold text-slate-800">{kelasData.nama}</h2>
          <div className="text-sm text-slate-500 mt-1 mb-4">{kelasData.mapel} • {kelasData.guruModel}</div>
          
          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 mb-5">
            <strong>Jadwal:</strong> {kelasData.tanggal}
          </div>

          <button 
            onClick={() => alert("Masuk ke halaman instrumen observasi (Tahap selanjutnya)")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-bold transition">
            Mulai Observasi
          </button>
        </div>
      )}

      {/* Navigasi Pulang */}
      <button onClick={() => router.push("/")} className="mt-8 text-sm font-semibold text-slate-400 hover:text-slate-600 transition">
        ← Kembali ke Halaman Utama
      </button>
    </div>
  );
}