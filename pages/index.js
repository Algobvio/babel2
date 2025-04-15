import { useEffect, useState } from "react";

export default function LandingPage() {
  const phrases = [
    "poesía", "gesto", "escritura", "voz", "palabra",
    "ritmo", "susurro", "fragmento", "verso", "imagen",
    "mirada", "ausencia", "latido", "deseo", "eco",
    "presencia", "noche", "tinta", "cuerpo", "memoria",
    "poetry", "gesture", "whisper", "body", "voice",
    "palavra", "corpo", "noite", "lembrança", "ausência",
    "scrittura", "desiderio", "verso", "notte", "voce",
    "言葉", "詩", "記憶", "声", "夜", "文字", "诗歌", "身体", "回忆", "夜晚"
  ];

  const [fallingWords, setFallingWords] = useState([]);
  const [frozenWords, setFrozenWords] = useState([]);
  const [columnHeights, setColumnHeights] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const columns = Array(Math.ceil(window.innerWidth / 20)).fill(0);
    setColumnHeights(columns);

    const spawnInterval = setInterval(() => {
      const word = phrases[Math.floor(Math.random() * phrases.length)];
      const id = Date.now() + Math.random();
      const left = Math.floor(Math.random() * window.innerWidth);
      const fontSize = Math.floor(Math.random() * 8 + 14);
      setFallingWords((words) => [
        ...words,
        {
          id,
          word,
          fontSize,
          top: 0,
          left,
          speed: Math.random() * 1 + 0.5,
          frozen: false,
        },
      ]);
    }, 150);

    const fallInterval = setInterval(() => {
      setFallingWords((words) => {
        return words.map((w) => {
          if (w.frozen) return w;
          const col = Math.floor(w.left / 20);
          const limit = window.innerHeight - (columnHeights[col] || 0);
          const nextTop = w.top + w.speed;

          if (nextTop >= limit - 20) {
            const newFrozen = { ...w, top: limit - 20, frozen: true };
            setFrozenWords((frozen) => [...frozen, newFrozen]);
            const updatedHeights = [...columnHeights];
            updatedHeights[col] += 20;
            setColumnHeights(updatedHeights);
            return newFrozen;
          }

          return { ...w, top: nextTop };
        });
      });
    }, 30);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
    };
  }, []);

  const handleMouseOver = (id) => {
    setFallingWords((words) =>
      words.map((w) => (w.id === id ? { ...w, frozen: true } : w))
    );
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-[#FAFAF6] text-[#1C2B24] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden transition-colors duration-1000">
      {[...fallingWords, ...frozenWords].map(({ id, word, top, left, fontSize }) => (
        <span
          key={id}
          onMouseOver={() => handleMouseOver(id)}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            fontSize: `${fontSize}px`,
            whiteSpace: "nowrap",
            pointerEvents: "auto",
            fontFamily: "'Special Elite', monospace",
            zIndex: 1,
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
          className="w-72 px-4 py-2 border border-[#1C2B24] rounded text-[#1C2B24] placeholder-[#1C2B24] bg-transparent"
        />
        <input
          type="email"
          placeholder="Tu email"
          className="w-72 px-4 py-2 border border-[#1C2B24] rounded text-[#1C2B24] placeholder-[#1C2B24] bg-transparent"
        />
        <button className="w-72 px-4 py-2 mt-2 rounded border-2 border-[#1C2B24] bg-transparent text-[#1C2B24] font-bold hover:bg-[#1C2B24] hover:text-[#FAFAF6] transition-all duration-300 animate-pulse">
          Quiero recibir novedades
        </button>
      </div>

      <div className="mt-10 text-sm text-center text-[#1C2B24] opacity-80 relative z-10">
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
