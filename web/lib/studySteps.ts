/** Split curriculum howToStudy strings into checkable steps vs tips. */
export function partitionHowToStudy(items: string[]): { steps: string[]; tips: string[] } {
  const steps: string[] = [];
  const tips: string[] = [];
  for (const raw of items) {
    const t = raw.trim();
    const m = /^tip\s*[—\-:]\s*/i.exec(t);
    if (m) tips.push(t.slice(m[0].length).trim());
    else steps.push(raw);
  }
  return { steps, tips };
}

export function isStudyTip(raw: string): boolean {
  return /^tip\s*[—\-:]/i.test(raw.trim());
}
