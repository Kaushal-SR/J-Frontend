import React from "react";

interface KanjiTableProps {
  kanjiList: Array<{
    id: string;
    character: string;
    meaning: string;
    onyomi: string[];
    kunyomi: string[];
    strokes: number;
    jlptLevel: string;
    examples: { word: string; reading: string; meaning: string }[];
    radicals: string[];
    status: string;
    reviewCount: number;
    isBookmarked: boolean;
  }>;
}

const KanjiTable: React.FC<KanjiTableProps> = ({ kanjiList }) => {
  return (
    <table className="w-full border rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Kanji</th>
          <th>Meaning</th>
          <th>Onyomi</th>
          <th>Kunyomi</th>
          <th>Strokes</th>
          <th>JLPT</th>
          <th>Radicals</th>
          <th>Status</th>
          <th>Bookmarked</th>
        </tr>
      </thead>
      <tbody>
        {kanjiList.map((k) => (
          <tr key={k.id} className="border-t text-center">
            <td className="text-2xl font-bold">{k.character}</td>
            <td>{k.meaning}</td>
            <td>{k.onyomi.join(", ")}</td>
            <td>{k.kunyomi.join(", ")}</td>
            <td>{k.strokes}</td>
            <td>{k.jlptLevel}</td>
            <td>{k.radicals.join(", ")}</td>
            <td className="capitalize">{k.status}</td>
            <td>{k.isBookmarked ? "✅" : "❌"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default KanjiTable;
