import { useEffect, useState } from "react";
import "./App.css";
import { useTelegram } from "./hooks/useTelegram";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import { guessNumber, startGame } from "./api";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

function App() {
  const { tg } = useTelegram();
  useEffect(() => {
    tg.ready();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [wrongNumber, setIsWrongNumber] = useState(false);
  const [won, setWon] = useState(false);
  const { width, height } = useWindowSize();

  const handleFocus = () => {
    setIsWrongNumber(false);
  };
  console.log(won);
  async function handleStart(event) {
    event.preventDefault();

    setIsLoading(true);
    try {
      await startGame();
      setGameStarted(true);
      setError(false);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuess(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const number = formData.get("number");
    const data = { number };
    if (number < 1 || number > 100) {
      setIsWrongNumber(true);
      return;
    }
    setIsLoading(true);
    try {
      const res = await guessNumber(data);
      if (res.won) {
        setWon(true);
        setError(false);
        return;
      } else {
        setRes(res);
      }
      setError(false);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setWon(false);
    setGameStarted(false);
    setRes(null);
  }

  return (
    <div className="app">
      {!won ? (
        <div>
          {!gameStarted && (
            <Button
              disabled={isLoading}
              className={isLoading ? "darker" : ""}
              onClick={handleStart}
            >
              {!isLoading ? "Розпочати гру" : "Очікуйте..."}
            </Button>
          )}
          {gameStarted && (
            <form onSubmit={handleGuess}>
              <Input
                placeholder="введіть число..."
                type="number"
                id="number"
                name="number"
                className={`input ${wrongNumber ? "wrongNumber" : ""}`}
                required
                label="Відгадайте число від 1 до 100"
                disabled={isLoading}
                onFocus={handleFocus}
              />
              {wrongNumber && (
                <p style={{ color: "red" }}>
                  Введіть число в діапазоні від 1 до 100
                </p>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className={isLoading ? "darker" : ""}
              >
                {!isLoading ? "Вгадати число" : "Очікуйте..."}
              </Button>
              {gameStarted && !won && (
                <h3
                  style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {res?.message}
                </h3>
              )}
            </form>
          )}
          {error && (
            <h2
              style={{
                color: "red",
                position: "absolute",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {error.message}
            </h2>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#412525",
            padding: "5rem",
            borderRadius: "2rem",
          }}
        >
          <Confetti width={width} height={height}></Confetti>
          <h1
            style={{
              color: "#f7c469",
              padding: "1rem",
            }}
          >
            Ви перемогли !!!
          </h1>
          <Button
            onClick={handleReset}
            style={{ backgroundColor: "#f7c469", color: "#412525" }}
          >
            Почати знову
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
