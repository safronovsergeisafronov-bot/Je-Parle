import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App = () => {
  const [loading, setLoading] = useState(false);
  const [previewPhrase, setPreviewPhrase] = useState<{ phrase: string, translation: string } | null>(null);

  const generatePreview = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Дай одну короткую, живую французскую фразу и её перевод. Верни JSON: {"phrase": "...", "translation": "..."}',
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              phrase: { type: Type.STRING },
              translation: { type: Type.STRING }
            },
            required: ['phrase', 'translation']
          }
        }
      });
      const data = JSON.parse(response.text || '{}');
      setPreviewPhrase(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-5 flex items-center justify-center font-sans">
      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-4 h-full">
        
        {/* Left Section (Burgundy) */}
        <section className="flex-1 bg-[#721c1c] rounded-[40px] text-white p-8 md:p-12 lg:p-16 flex flex-col min-h-[600px] lg:min-h-[850px]">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                <img 
                  src="./assets/avatar.svg" 
                  alt="Илья" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Ilya";
                  }}
                />
              </div>
              <span className="text-xl font-medium tracking-tight">Гаврилов Илья</span>
            </div>
            <nav className="hidden md:flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 text-sm font-light hover:bg-white/20 transition-all">Что внутри</button>
              <button className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 text-sm font-light hover:bg-white/20 transition-all">Почему это работает</button>
            </nav>
          </header>

          <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-8 tracking-tight">
              Книга, собранная не за день — а за 7 лет преподавания французского.
            </h1>
            <p className="text-lg md:text-xl font-light text-white/80 mb-12 leading-relaxed">
              Внутри — живые выражения, которые используют французы каждый день.
            </p>

            <div className="flex flex-col gap-4 w-full md:w-[440px] mx-auto lg:mx-0">
              {/* Main Button */}
              <button className="bg-white text-black h-[84px] rounded-full flex items-center p-2 hover:bg-gray-100 transition-all shadow-lg">
                <div className="w-[68px] h-[68px] bg-[#111] rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
                </div>
                <span className="flex-1 text-center text-lg font-semibold pr-4 tracking-tight">Получить книгу «Je Parle!»</span>
              </button>

              {/* Fragment Button */}
              <button 
                onClick={generatePreview}
                className="bg-[#8b3d3d] text-white h-[84px] rounded-full flex items-center p-2 hover:bg-[#9b4d4d] transition-all relative overflow-hidden shadow-lg"
              >
                <div className="w-[68px] h-[68px] bg-white/20 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.17 0-2.39.15-3.5.5V19c1.11-.35 2.33-.5 3.5-.5 1.95 0 4.05.4 5.5 1.5 1.45-1.1 3.55-1.5 5.5-1.5 1.17 0 2.39.15 3.5.5V5z"/></svg>
                </div>
                <span className="flex-1 text-center text-lg font-semibold pr-4 tracking-tight">
                  {loading ? 'Загрузка...' : 'Посмотреть фрагмент'}
                </span>
              </button>

              {previewPhrase && !loading && (
                <div className="mt-4 p-5 bg-white/10 rounded-2xl text-left animate-in fade-in slide-in-from-top-2 border border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Пример из книги:</div>
                  <div className="text-xl font-medium mb-1 text-white tracking-tight leading-snug">«{previewPhrase.phrase}»</div>
                  <div className="text-sm font-normal text-white/70 tracking-tight">{previewPhrase.translation}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Section (Image from local assets folder) */}
        <section className="flex-1 rounded-[40px] relative min-h-[600px] lg:min-h-[850px] overflow-hidden group">
          <img 
            src="./assets/hero-image.png" 
            alt="Je Parle! Book and Audio Interface" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://r.jina.ai/i/6c41b80d0d8641bc8836528d2274488b";
            }}
          />
          
          <header className="absolute top-0 left-0 right-0 p-8 md:p-12 flex justify-end z-10">
            <button className="px-8 py-3 rounded-full bg-white/30 backdrop-blur-md text-black/90 font-bold hover:bg-white/50 transition-all border border-white/20 shadow-xl tracking-tight">
              Связаться
            </button>
          </header>
        </section>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);