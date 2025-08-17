import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [easterEggWords, setEasterEggWords] = useState("fat, bigga");
  const [easterEggChance, setEasterEggChance] = useState(50);
  const [segments, setSegments] = useState(4);
  const [segmentLength, setSegmentLength] = useState(6);
  const [charType, setCharType] = useState("mixed");
  const [separator, setSeparator] = useState("-");

  const generateCode = () => {
    const chars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      number: "0123456789",
      mixed: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    };

    let charSet = chars[charType] || chars.mixed;
    let parts = [];

    for (let i = 0; i < segments; i++) {
      if (Math.random() * 100 < easterEggChance && easterEggWords.trim() !== "") {
        let eggs = easterEggWords.split(",").map((w) => w.trim().toUpperCase());
        parts.push(eggs[Math.floor(Math.random() * eggs.length)]);
      } else {
        let segment = "";
        for (let j = 0; j < segmentLength; j++) {
          segment += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }
        parts.push(segment);
      }
    }
    setCode(parts.join(separator));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-300 to-purple-500">
      <div className="bg-purple-950 p-8 rounded-2xl shadow-xl text-white max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Code Generator</h1>

        <label className="block mb-2">Easter egg words (comma separated)</label>
        <input
          type="text"
          value={easterEggWords}
          onChange={(e) => setEasterEggWords(e.target.value)}
          className="w-full p-2 rounded bg-purple-900 border border-purple-700 mb-4"
        />

        <label className="block mb-2">Easter egg chance (%)</label>
        <input
          type="number"
          value={easterEggChance}
          onChange={(e) => setEasterEggChance(e.target.value)}
          className="w-full p-2 rounded bg-purple-900 border border-purple-700 mb-4"
        />

        <label className="block mb-2">Segments</label>
        <input
          type="number"
          value={segments}
          onChange={(e) => setSegments(e.target.value)}
          className="w-full p-2 rounded bg-purple-900 border border-purple-700 mb-4"
        />

        <label className="block mb-2">Segment length</label>
        <input
          type="number"
          value={segmentLength}
          onChange={(e) => setSegmentLength(e.target.value)}
          className="w-full p-2 rounded bg-purple-900 border border-purple-700 mb-4"
        />

        <label className="block mb-2">Character type</label>
        <select
          value={charType}
          onChange={(e) => setCharType(e.target.value)}
          className="w-full p-2 rounded bg-purple-900 border border-purple-700 mb-4"
        >
          <option value="upper">Uppercase</option>
          <option value="lower">Lowercase</option>
          <option value="number">Numbers</option>
          <option value="mixed">Mixed</option>
        </select>

        <label className="block mb-2">Separator</label>
        <input
          type="text"
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          className="w-full p-2 rounded bg-purple-900 border border-purple-700 mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={generateCode}
            className="flex-1 bg-purple-600 hover:bg-purple-700 p-2 rounded"
          >
            Generate
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-purple-400 hover:bg-purple-500 p-2 rounded"
          >
            Copy
          </button>
        </div>

        <div className="mt-6 text-center text-xl font-mono bg-purple-900 p-4 rounded">
          {code || "Your code will appear here"}
        </div>
      </div>
    </div>
  );
}
