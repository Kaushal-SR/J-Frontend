import React, { useState } from "react";

// Popover component for showing all examples with 'View More'
function KanjiExamplesPopover({ kanji, onClose }: { kanji: any; onClose: (e: React.MouseEvent) => void }) {
  const [showAll, setShowAll] = useState(false);
  // Sort examples from shortest to longest word
  const sortedExamples = (kanji.examples || []).slice().sort((a, b) => (a.word?.length || 0) - (b.word?.length || 0));
  const initialCount = 3;
  const visibleExamples = showAll ? sortedExamples : sortedExamples.slice(0, initialCount);
  return (
    <div
      className="fixed left-0 right-0 top-auto bottom-0 mx-auto mb-4 sm:absolute sm:left-1/2 sm:top-full sm:mt-2 sm:w-80 sm:-translate-x-1/2 bg-white border border-blue-200 rounded-xl shadow-xl p-4 z-50"
      style={{ width: '100vw', maxWidth: '360px', minWidth: '220px', paddingLeft: 'max(env(safe-area-inset-left), 8px)', paddingRight: 'max(env(safe-area-inset-right), 8px)' }}
    >
      <div className="font-semibold text-blue-700 mb-2 text-center">Example Words</div>
      {visibleExamples.length > 0 ? (
        <div className="space-y-2 mb-3">
          {visibleExamples.map((ex: any, idx: number) => (
            <div key={idx} className="p-2 bg-blue-50 rounded-lg">
              <div className="font-bold text-base md:text-lg">{ex.word}</div>
              <div className="text-xs md:text-sm text-gray-600">{ex.reading}</div>
              <div className="text-xs md:text-sm text-gray-700">{ex.meaning}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center mb-3">No examples available</div>
      )}
      {!showAll && sortedExamples.length > initialCount && (
        <button
          className="mb-2 w-full py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-200 text-xs"
          onClick={e => { e.stopPropagation(); setShowAll(true); }}
        >View More</button>
      )}
      {(kanji.onyomi && kanji.onyomi.length > 0) && (
        <div className="mb-1">
          <span className="font-semibold text-xs text-blue-800">On'yomi: </span>
          <span className="text-xs text-gray-700">{kanji.onyomi.join(', ')}</span>
        </div>
      )}
      {(kanji.kunyomi && kanji.kunyomi.length > 0) && (
        <div className="mb-2">
          <span className="font-semibold text-xs text-blue-800">Kun'yomi: </span>
          <span className="text-xs text-gray-700">{kanji.kunyomi.join(', ')}</span>
        </div>
      )}
      <button
        className="mt-2 w-full py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
        onClick={onClose}
      >Close</button>
    </div>
  );
}

interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

interface KanjiGridProps {
  kanjiList: Array<{
    id: string;
    character: string;
    meaning: string;
    onyomi: string[];
    kunyomi: string[];
    strokes: number;
    jlptLevel: string;
    status: string;
    isBookmarked: boolean;
    examples?: KanjiExample[];
  }>;
}


const KanjiGrid: React.FC<KanjiGridProps> = ({ kanjiList }) => {
  const [hoveredKanjiId, setHoveredKanjiId] = useState<string | null>(null);
  const [selectedKanjiId, setSelectedKanjiId] = useState<string | null>(null);

  const showExamplesForId = hoveredKanjiId || selectedKanjiId;
  const exampleKanji = kanjiList.find(k => k.id === showExamplesForId);

  return (
    <div className="relative">
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {kanjiList.map((k) => (
          <div
            key={k.id}
            className={`bg-white rounded-xl shadow p-4 flex flex-col items-center border hover:shadow-lg transition cursor-pointer relative ${showExamplesForId === k.id ? 'ring-2 ring-blue-400 z-10' : ''}`}
            onMouseEnter={() => setHoveredKanjiId(k.id)}
            onMouseLeave={() => setHoveredKanjiId(null)}
            onClick={() => setSelectedKanjiId(selectedKanjiId === k.id ? null : k.id)}
            tabIndex={0}
            onBlur={() => setSelectedKanjiId(null)}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{k.character}</div>
            <div className="text-xs sm:text-sm text-gray-700 mb-1">{k.meaning}</div>
            <div className="text-xs text-gray-500 mb-1">JLPT: {k.jlptLevel}</div>
            <div className="text-xs text-gray-500 mb-1">Strokes: {k.strokes}</div>
            <div className="text-xs text-gray-500 mb-1">{k.status}</div>
            {k.isBookmarked && <div className="text-amber-500 text-lg">★</div>}
            {/* Show examples and readings as a popover/modal on hover/select */}
            {(showExamplesForId === k.id && (k.examples && k.examples.length > 0 || (k.onyomi && k.onyomi.length > 0) || (k.kunyomi && k.kunyomi.length > 0))) && (
              <KanjiExamplesPopover
                kanji={k}
                onClose={e => { e.stopPropagation(); setSelectedKanjiId(null); }}
              />
            )}

          </div>
        ))}
      </div>
      {/* Animation removed as requested */}
    </div>
  );
};

export default KanjiGrid;
