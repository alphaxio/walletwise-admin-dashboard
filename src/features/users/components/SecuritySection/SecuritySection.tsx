
import { ShieldCheck } from "lucide-react";

import { SecurityQuestionType } from "../../types";

import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import SecurityQuestionCard from "../SecurityQuestionCard/SecurityQuestionCard";

const SecuritySection = ({
  securityQuestions,
}: {
  securityQuestions: SecurityQuestionType[];
}) => {

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <SectionHeader
        icon={ShieldCheck}
        title="Security Questions"
        subtitle={`${securityQuestions?.length} question${
          securityQuestions?.length !== 1 ? "s" : ""
        }`}
      />

      {(
        <div className="p-6 pt-0 space-y-4">
          {securityQuestions?.map((question, index) => (
            <SecurityQuestionCard
              key={index}
              question={question}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SecuritySection;
