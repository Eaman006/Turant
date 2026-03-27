export function diceCoefficient(a: string, b: string): number {
  if (!a || !b) return 0;

  const s = a.toLowerCase().trim();
  const t = b.toLowerCase().trim();

  if (s === t) return 1;

  const pairify = (str: string): string[] => {
    const pairs: string[] = [];
    for (let i = 0; i < str.length - 1; i++) {
      pairs.push(str.slice(i, i + 2));
    }
    return pairs;
  };

  const sPairs = pairify(s);
  const tPairs = pairify(t);

  if (sPairs.length === 0 || tPairs.length === 0) {
    return 0;
  }

  const sCount = new Map<string, number>();
  sPairs.forEach((p) => sCount.set(p, (sCount.get(p) || 0) + 1));

  let common = 0;
  const tCount = new Map<string, number>();
  tPairs.forEach((p) => tCount.set(p, (tCount.get(p) || 0) + 1));

  sCount.forEach((sVal, key) => {
    const tVal = tCount.get(key) ?? 0;
    common += Math.min(sVal, tVal);
  });

  return (2.0 * common) / (sPairs.length + tPairs.length);
}
