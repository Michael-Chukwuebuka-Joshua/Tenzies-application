import Die from "../components/Die";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import clsx from 'clsx'
import Confetti from "react-confetti";
export default function App() {
  function generateAllNewDice() {
    // let randomNumArr = []
    // for(i = 0; i < 10; i++) {
    //   randomNumArr.push(Math.ceil(Math.random() * 6))
    // }
    // console.log(randomNumArr)
    // return randomNumArr

    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }
  const [die, setDie] = useState(() => generateAllNewDice());
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [isGameOver, setIsGameover] = useState(false);
  const focusedKey = useRef(null);

  const gameWon =
    die.every((d) => d.isHeld) && die.every((d) => d.value === die[0].value);

  useEffect(
    function () {
      if (gameWon || isGameOver) return;

      const intervalId = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setIsGameover(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    },
    [gameWon, isGameOver],
  );
  useEffect(() => {
    gameWon ? focusedKey.current.focus() : null;
  }, [gameWon]);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  const timer = `${minutes}:${seconds}`;

  function rollDice() {
    // Bob Ziroll
    // setDice((oldDice) =>
    //   oldDice.map((die) =>
    //     die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) },
    //   ),
    // );
    if (gameWon || isGameOver) {
      reset();
      return;
    }
    let newDie = generateAllNewDice();
    setDie((prev) => {
      return prev.map((p, index) => (p.isHeld ? p : newDie[index]));
    });
  }
  function reset() {
    setDie(() => generateAllNewDice());
    setRemainingSeconds(60);
    setIsGameover(false);
  }
  function hold(id) {
    setDie((prev) => {
      return prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isHeld: !p.isHeld,
            }
          : p,
      );
    });
  }

  function createDie() {
    return die.map((d) => (
      <Die
        disabled={isGameOver}
        hold={() => hold(d.id)}
        isHeld={d.isHeld}
        key={d.id}
        value={d.value}
        id={d.id}
      />
    ));
  }
  const paragraghEl = gameWon
    ? ` Congratulations! You won! Press "New Game" to start again.`
    : isGameOver && !gameWon
      ? ` Time's up! Click New Game to try again.`
      : ` Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.`;
  return (
    <>
      <div aria-live="polite" className="game-status"></div>

      <main>
        <p className="timer">{timer}</p>

        {gameWon && <Confetti />}

        <h1 className="title">Tenzies</h1>
        <p className={clsx("instructions", {
          "game-won": gameWon,
          "game-over": isGameOver
        })}>{paragraghEl}</p>

        <div className="diceContainer">{createDie()}</div>
        <button ref={focusedKey} onClick={rollDice} className="roll-btn">
          {gameWon || isGameOver ? "New Game" : "Roll"}
        </button>
      </main>
    </>
  );
}
