const API_URL = "http://localhost:3000";

export async function startGame() {
  const response = await fetch(`${API_URL}/start_game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Помилка з сервером");
  }
  return response.json();
}

export async function guessNumber(data) {
  const response = await fetch(`${API_URL}/guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Помилка з сервером");
  }
  return response.json();
}
