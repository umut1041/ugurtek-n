import React, { useState, useMemo } from "react";
import QuizGame from "./QuizGame";

type WordPair = { de: string; tr: string };
type Unit = {
  id: string;
  title: string;
  titleTr: string;
  words: WordPair[];
};
type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildQuestions(words: WordPair[]): QuizQuestion[] {
  if (!words.length) return [];
  const questions: QuizQuestion[] = [];
  const wordList = shuffle(words);

  for (const word of wordList) {
    const direction = Math.random() < 0.5 ? "de-tr" : "tr-de";
    const others = wordList.filter((w) => w !== word);

    if (direction === "de-tr") {
      const correctAnswer = word.tr;
      const wrongPool = [...new Set(others.map((w) => w.tr).filter((tr) => tr !== correctAnswer))];
      const wrong = shuffle(wrongPool).slice(0, 3);
      const options = shuffle([correctAnswer, ...wrong]);
      questions.push({
        question: `Was bedeutet „${word.de}"?`,
        options,
        correct: options.indexOf(correctAnswer),
      });
    } else {
      const correctAnswer = word.de;
      const wrongPool = [...new Set(others.map((w) => w.de).filter((de) => de !== correctAnswer))];
      const wrong = shuffle(wrongPool).slice(0, 3);
      const options = shuffle([correctAnswer, ...wrong]);
      questions.push({
        question: `Wie sagt man „${word.tr}" auf Deutsch?`,
        options,
        correct: options.indexOf(correctAnswer),
      });
    }
  }

  return questions;
}

interface QuizWithUnitSelectProps {
  units: Unit[];
}

const UNIT_ORDER = [
  "ankommen",
  "daheim",
  "essen-trinken",
  "arbeitswelt",
  "sport-fitness",
  "schule-ausbildung",
  "feste-geschenke",
  "am-wochenende",
  "meine-sachen",
  "kommunikation",
  "unterwegs",
  "reisen",
  "auf-der-bank",
  "lebensstationen",
];

const QuizWithUnitSelect: React.FC<QuizWithUnitSelectProps> = ({ units }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const orderedUnits = useMemo(() => {
    const byId = new Map(units.map((u) => [u.id, u]));
    return UNIT_ORDER.map((id) => byId.get(id)).filter(Boolean) as Unit[];
  }, [units]);

  const questions = useMemo(() => {
    if (!selectedUnitId) return null;
    const unit = orderedUnits.find((u) => u.id === selectedUnitId);
    if (!unit?.words?.length) return null;
    return buildQuestions(unit.words);
  }, [selectedUnitId, orderedUnits]);

  const selectedUnit = orderedUnits.find((u) => u.id === selectedUnitId);

  if (questions && questions.length > 0) {
    return (
      <div className="quiz-with-unit">
        <div className="quiz-unit-bar">
          <span className="quiz-unit-label">
            Ünite: {selectedUnit?.title} ({selectedUnit?.titleTr})
          </span>
          <button
            type="button"
            className="quiz-back-units"
            onClick={() => setSelectedUnitId(null)}
          >
            ← Başka ünite seç
          </button>
        </div>
        <QuizGame questions={questions} />
      </div>
    );
  }

  return (
    <div className="quiz-with-unit">
      <p className="quiz-choose-unit-intro">
        Önce bir ünite seçin. Seçtiğiniz ünitedeki <strong>tüm kelimeler</strong>{" "}
        çoktan seçmeli sorulara dönüşecek.
      </p>
      <div className="quiz-unit-grid">
        {orderedUnits.map((unit, index) => (
          <button
            key={unit.id}
            type="button"
            className="quiz-unit-card"
            onClick={() => setSelectedUnitId(unit.id)}
          >
            <span className="quiz-unit-num">{index + 1}</span>
            <span className="quiz-unit-title">{unit.title}</span>
            <span className="quiz-unit-title-tr">{unit.titleTr}</span>
            <span className="quiz-unit-words">{unit.words.length} kelime</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizWithUnitSelect;
