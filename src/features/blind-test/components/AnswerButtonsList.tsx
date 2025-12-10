// src/features/blind-test/components/AnswerButtonsList.tsx

import React from "react";
import type { AnswerChoice } from "../types/blindTestTypes";
import type { BlindTestAnswerFeedback } from "../types/blindTestTypes";
import { AnswerButton } from "./AnswerButton";

type Props = {
  choices: AnswerChoice[];
  feedback: BlindTestAnswerFeedback | null;
  onSelect: (answerId: string) => void;
};

export const AnswerButtonsList: React.FC<Props> = ({
  choices,
  feedback,
  onSelect,
}) => {
  const showFeedback = Boolean(feedback);

  return (
    <div>
      {choices.map((choice) => (
        <AnswerButton
          key={choice.id}
          label={choice.label}
          isSelected={feedback?.selectedAnswerId === choice.id}
          isCorrect={choice.isCorrect}
          showFeedback={showFeedback}
          disabled={showFeedback}
          onClick={() => onSelect(choice.id)}
        />
      ))}
    </div>
  );
};
