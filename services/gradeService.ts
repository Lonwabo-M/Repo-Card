
export const calculateCode = (score: number): number => {
  if (score >= 80) return 7; // 80-100%
  if (score >= 70) return 6; // 70-79%
  if (score >= 60) return 5; // 60-69%
  if (score >= 50) return 4; // 50-59%
  if (score >= 40) return 3; // 40-49%
  if (score >= 30) return 2; // 30-39%
  if (score >= 0) return 1;  // 0-29%
  return 0; // Represents N/A
};
