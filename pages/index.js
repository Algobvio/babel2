import { useEffect, useState, useRef } from "react";

export default function LandingPage() {
  const phrases = [
    "poesía", "gesto", "escritura", "voz", "palabra",
    "ritmo", "susurro", "fragmento", "verso", "imagen",
    "mirada", "ausencia", "latido", "deseo", "eco",
    "presencia", "noche", "tinta", "cuerpo", "memoria",
    "poetry", "gesture", "whisper", "body", "voice",
    "palavra", "corpo", "noite", "lembrança", "ausência",
    "scrittura", "desiderio", "notte", "voce",
    "言葉", "詩", "記憶", "声", "夜",
    "文字", "詩歌", "身体", "回忆", "夜晚"
  ];

  const [fallingWords, setFallingWords] = useState([]);
  const [frozenWords, setFrozenWords] = useState([]);
  const [columns, setColumns] = useState([]);
  const hoveredWords = useRef(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const colCount = Math.floor(window.innerWidth / 20);
    const initialColumns = new Array(colCount).fill(0);
    setColumns(initialColumns);

    const spawnInterval = setInterval(() => {
      const word = phrases[Math.floor(Math.random() * phrases.length)];
      const id = Date.now() + Math.random();
      const left = Math.floor(Math.random() * window.innerWidth);
      const fontSize = Math.floor(Math.random() * 10 + 14);
      const speed = Math.random() * 1 + 0.5;
      setFallingWords((prev) => [...prev, { id, word, top: 0, left, fontSize, speed, frozen: false, fallingOut: false }]);
    }, 150);

    const fallInterval = setInterval(() => {
      setFallingWords((prevWords) => {
        return prevWords.map((w) => {
          if (hoveredWords.current.has(w.id)) return { ...w, frozen: true };

          if (w.frozen && !hoveredWords.current.has(w.id)) {
            return { ...w, frozen: false };
          }

          if (w.fallingOut) {
            return { ...w, top: w.top + 4 };
          }

          const nextTop = w.top + w.speed;
          const col = Math.floor(w.left / 20);
          const maxTop = window.innerHeight - (columns[col] || 0) - 20;

          if (nextTop >= maxTop) {
            const shouldFallOut = Math.random() < 0.3; // 30% chance to fall out
            if (shouldFallOut) {
              return { ...w, fallingOut: true };
            }

            const updatedWord = { ...w, top: maxTop, frozen: true };
            setFrozenWords((prev) => [...prev, updatedWord]);
            const updatedCols = [...columns];
            updatedCols[col] += 20;
            setColumns(updatedCols);
            return updatedWord;
          }

          return { ...w, top: nextTop };
        }).filter(w => w.top < window.innerHeight + 100);
      });
    }, 30);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
    };
  }, [columns.length]);

  const handleMouseEnter = (id) => {
    hoveredWords.current.add(id);
  };

  const handleMouseLeave = (id) => {
    hoveredWords.current.delete(id);
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-[#F9F9F7] text-[#1C2B24] dark:bg-[#1C2B24] dark:text-[#F9F8F4] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {[...fallingWords, ...frozenWords].map(({ id, word, top, left, fontSize }) => (
        <span
          key={id}
          onMouseEnter={() => handleMouseEnter(id)}
          onMouseLeave={() => handleMouseLeave(id)}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            fontSize: `${fontSize}px`,
            fontFamily: "'Special Elite', monospace",
            whiteSpace: "nowrap",
            pointerEvents: "auto",
            zIndex: 1
          }}
          className="opacity-60 transition duration-300 hover:opacity-100"
        >
          {word}
        </span>
      ))}

      <h1 className="text-5xl font-bold text-center mb-4 font-serif relative z-10">Babel</h1>

      <p className="text-center text-base max-w-md mb-6 relative z-10">
        Subí tus poemas, escribí en colaboración y participá en concursos trimestrales sin mostrar tu nombre real. Leé desde el misterio, escribí desde el gesto.
      </p>

      <div className="flex flex-col gap-3 items-center relative z-10">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          className="w-72 px-4 py-2 border border-[#1C2B24] dark:border-[#F9F8F4] rounded text-[#1C2B24] dark:text-[#F9F8F4] placeholder-[#1C2B24] dark:placeholder-[#F9F8F4] bg-transparent"
        />
        <input
          type="email"
          placeholder="Tu email"
          className="w-72 px-4 py-2 border border-[#1C2B24] dark:border-[#F9F8F4] rounded text-[#1C2B24] dark:text-[#F9F8F4] placeholder-[#1C2B24] dark:placeholder-[#F9F8F4] bg-transparent"
        />
        <button className="w-72 px-4 py-2 mt-2 rounded border-2 border-[#1C2B24] dark:border-[#F9F8F4] bg-transparent text-[#1C2B24] dark:text-[#F9F8F4] font-bold hover:bg-[#1C2B24] hover:text-[#F9F8F4] dark:hover:bg-[#F9F8F4] dark:hover:text-[#1C2B24] transition-all duration-300 animate-pulse">
          Quiero recibir novedades
        </button>
      </div>

      <div className="mt-10 text-sm text-center text-[#1C2B24] dark:text-[#F9F8F4] opacity-80 relative z-10">
        Las palabras nos encuentran. Pronto, Babel también.
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Special+Elite&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
}
