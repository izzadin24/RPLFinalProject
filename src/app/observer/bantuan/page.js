'use client';

import { useState } from 'react';

// Data pertanyaan dan jawaban
const faqs = [
  {
    question: "Bagaimana cara menambahkan kelas?",
    answer: "Anda dapat menambahkan kelas dengan cara memasukkan kode kelas"
  },
  {
    question: "Bagaimana cara mencari mengobservasi?",
    answer: "Anda dapat mengobservasi kelas dengan menekan tombol hijau observasi."
  },
  {
    question: "Apakah cara melihat observasi saya yang lama?",
    answer: "Anda dapat menekan tombol History pada sidebar kiri."
  },
  {
    question: "Bagaimana cara menghubungi tim dukungan?",
    answer: "Anda bisa menghubungi kami melalui email di support@website.com atau menghubungi nomor telepon: 08XXXXXXXX."
  }
];

export default function QnaPage() {
  // State untuk menyimpan index pertanyaan yang sedang dibuka (null berarti semua tertutup)
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Punya pertanyaan? Berikut adalah jawaban untuk pertanyaan yang paling sering kami terima.
          </p>
        </div>

        {/* Wadah Daftar QnA */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Tombol Pertanyaan */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none focus:bg-slate-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-slate-900 text-lg">
                    {faq.question}
                  </span>
                  
                  {/* Icon Panah dengan Animasi Rotasi */}
                  <svg 
                    className={`w-6 h-6 text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Wadah Jawaban dengan Animasi Smooth Smooth Dropdown */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
