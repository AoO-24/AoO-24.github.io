const GREY = 0,
  YELLOW = 1,
  GREEN = 2;

function toNum(status: number[]) {
  let ans = 0;
  for (let i = 0; i < 5; i++) {
    ans += status[i] * Math.pow(3, i);
  }
  return ans;
}

export function evaluate(guess: string, ans: string) {
  let status = [0, 0, 0, 0, 0];
  for (let i = 0; i < 5; i++) {
    const char = ans[i];
    if (guess[i] === char) {
      status[i] = GREEN;
    } else {
      for (let j = 0; j < 5; j++) {
        if (guess[j] === char && status[j] === GREY) {
          status[j] = YELLOW;
          break;
        }
      }
    }
  }
  return toNum(status);
}

export function entropy(guess: string, wordList: string[]) {
  const totalCnt = wordList.length;
  const lgCnt = Math.log2(totalCnt);
  const cases = new Array<number>(243);
  for (let word of wordList) {
    const val = evaluate(guess, word);
    cases[val] = cases[val] ? cases[val] + 1 : 1;
  }
  return cases.reduce((prev, val) =>
    val === 0 ? prev : prev + (val / totalCnt) * (lgCnt - Math.log2(val))
  );
}
