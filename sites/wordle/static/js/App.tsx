import React, { useEffect, useState } from 'react';
import './App.css';
import { answerList } from './wordlist';
import { allWords } from './all_words';
import { entropy, evaluate } from './logic/getEV';

function App() {
  const completeList = allWords.concat(answerList)

  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState<
    { char: string; status: 'grey' | 'yellow' | 'green' }[][]
    >([]);
  const [greyLetters, setGreyLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [probableAnsList, setProbableAnsList] = useState<string[]>(allWords);
  const [trialList, setTrialList] = useState<string[]>(allWords);
  const [suggestion, setSuggestion] = useState("");
  useEffect(() => {
    const word = answerList[Math.floor(Math.random() * answerList.length)];
    setWord(word);
    // console.log(evaluate(word, word));
    // console.log(answerList.sort((a, b) => entropy(a, answerList) - entropy(b, answerList)))
  }, []);
  const getKeyStatus = (letter: string): string => {
    if (greenLetters.includes(letter)) {
      return 'green';
    }
    if (yellowLetters.includes(letter)) {
      return 'yellow';
    }
    if (greyLetters.includes(letter)) {
      return 'grey';
    }
    return ''
  }
  const getSuggestion = (ansList: string[], trialList: string[]) => {
    if (ansList.length <= 3) {
      return ansList[0];
    }
    let minVal = Infinity;
    let ans = "";
    for (let word of trialList) {
      const e = entropy(word, ansList);
      if (e < minVal || (e === minVal && ansList.includes(word))) {
        minVal = e;
        ans = word;
      }
    }
    return ans;
  }
  const checkAnswer = () => {
    if (guess === 'yesen') {
      setShowHint(sh => !sh);
      setGuess('');
      setSuggestion(getSuggestion(probableAnsList, trialList))
      return;
    }
    if (guess.length !== 5) return;
    if (!completeList.includes(guess)) {
      alert('Invalid word!');
      setGuess('');
      return;
    }
    setGuess('');
    const newHist: { char: string; status: 'grey' | 'yellow' | 'green' }[] = [];
    const val = evaluate(guess, word);
    let win = val === 242; // 22222(3)
    for (let i = 0; i < 5; i++) {
      const bit = Math.floor(val / Math.pow(3, i)) % 3;
      newHist.push({
        char: guess[i],
        status: bit === 0 ? 'grey' : (bit === 1 ? 'yellow' : 'green'),
      });
    }
    const newGrey = greyLetters.slice();
    const newYellow = yellowLetters.slice();
    const newGreen = greenLetters.slice();

    for (let i = 0; i < 5; i++) {
      if (newHist[i].status === 'grey' && !newGrey.includes(newHist[i].char)) {
        newGrey.push(newHist[i].char)
      }
      if (newHist[i].status === 'yellow' && !newYellow.includes(newHist[i].char)) {
        newYellow.push(newHist[i].char)
      }
      if (newHist[i].status === 'green' && !newGreen.includes(newHist[i].char)) {
        newGreen.push(newHist[i].char)
      }
    }
    const newList = probableAnsList.filter(wd => evaluate(guess, wd) === val)
    // const newTrialList = trialList.filter(wd => evaluate(guess, wd) === val)
    setProbableAnsList(newList);
    // setTrialList(newTrialList);
    if (showHint) {
      setSuggestion(getSuggestion(newList, trialList));
    }
    setGreyLetters(newGrey);
    setYellowLetters(newYellow);
    setGreenLetters(newGreen);
    const ans = history.slice();
    if (win) {
      ans.push(newHist);
      setHistory(ans);
      setTimeout(() => alert(`Marvelous! The answer is ${word}.`), 20)
      setTimeout(() => {
        setHistory([]);
        setGreenLetters([]);
        setYellowLetters([]);
        setGreyLetters([]);
        setWord(answerList[Math.floor(Math.random() * answerList.length)]);
        setShowHint(false);
        setProbableAnsList(answerList);
        setTrialList(completeList);
      }, 2000);
      return;
    } else if (history.length > 4) {
      ans.push(newHist);
      setHistory(ans);
      setTimeout(() => alert(`You Lose! The answer is ${word}.`), 20)
      setTimeout(() => {
        setHistory([]);
        setGreenLetters([]);
        setYellowLetters([]);
        setGreyLetters([]);
        setWord(answerList[Math.floor(Math.random() * answerList.length)]);
        setShowHint(false);
        setProbableAnsList(answerList);
        setTrialList(completeList);
      }, 2000);
      return;
    }
    ans.push(newHist);
    setHistory(ans);
  };
  const handleKeyDown = (char: string) => {
    if (char === 'Backspace') {
      setGuess((guess) => guess.substring(0, guess.length - 1));
    } else if (/^[A-Za-z]$/.test(char)) {
      setGuess((guess) => guess.concat(char).substring(0, 5));
    } else if (char === 'Enter') {
      checkAnswer();
    }
  };
  return (
    <div className="App" tabIndex={0} onKeyDown={(e) => handleKeyDown(e.key)}>
      <div className="grid-container">
        {history.map((attempt, i) => (
          <div className="row" key={i}>
            <div className={`cell ${attempt[0].status}`}>{attempt[0].char}</div>
            <div className={`cell ${attempt[1].status}`}>{attempt[1].char}</div>
            <div className={`cell ${attempt[2].status}`}>{attempt[2].char}</div>
            <div className={`cell ${attempt[3].status}`}>{attempt[3].char}</div>
            <div className={`cell ${attempt[4].status}`}>{attempt[4].char}</div>
          </div>
        ))}
        {history.length < 6 && (<div className="row">
          <div className="cell">{!guess && showHint ? suggestion[0] : guess[0]}</div>
          <div className="cell">{!guess && showHint ? suggestion[1] : guess[1]}</div>
          <div className="cell">{!guess && showHint ? suggestion[2] : guess[2]}</div>
          <div className="cell">{!guess && showHint ? suggestion[3] : guess[3]}</div>
          <div className="cell">{!guess && showHint ? suggestion[4] : guess[4]}</div>
        </div>)}
        {(() => {
          const ans = [];
          for (let i = 0; i < 5 - history.length; i++)
            ans.push(
              <div className="row" key={i}>
                <div className="cell"></div>
                <div className="cell"></div>
                <div className="cell"></div>
                <div className="cell"></div>
                <div className="cell"></div>
              </div>
            );
          return ans;
        })()}
      </div>
      <div className="keyboard">
        <div className="keyboard-row">
          {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(
            (letter) => (<button className={`key ${getKeyStatus(letter)}`} onClick={() => handleKeyDown(letter)}>
              {letter}
            </button>)
          )}
        </div>
        <div className="keyboard-row">
          <div className="keyboard-seg">{['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(
            (letter) => (<button className={`key ${getKeyStatus(letter)}`} onClick={() => handleKeyDown(letter)} >
              {letter}
            </button>)
          )}</div>
          <div className="place-taker"></div>
        </div>
        <div className="keyboard-row">
          <button className="key enter" onClick={checkAnswer}>↩︎</button>
          <div className="keyboard-seg">{['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(
            (letter) => (<button className={`key ${getKeyStatus(letter)}`} onClick={() => handleKeyDown(letter)}>
              {letter}
            </button>)
          )}</div>
          <button className="key delete" onClick={() => handleKeyDown('Backspace')}>⌫</button>
        </div>
      </div>
    </div>
  );
}

export default App;
