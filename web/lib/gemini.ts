/**
 * @deprecated Import from `@/lib/ai` instead. Re-exports for backward compatibility.
 */
export {
  aiAsk as geminiAsk,
  aiStudyGuide as geminiStudyGuide,
  aiAudioBrief as geminiAudioBrief,
  aiFreshQuestions as geminiFreshQuestions,
  aiExplainMistake as geminiExplainMistake,
  fetchAiStatus,
  type ChatTurn,
  type AskResponse,
  type FreshMcq,
  type AiStatus,
} from "@/lib/ai";
