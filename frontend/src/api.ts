const API_URL = 'http://localhost:5000/api'; // Adjust if needed

function getToken() {
  return localStorage.getItem('token');
}

export async function register(username: string, password: string) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function startGame(gameName: string) {
  const res = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ gameName })
  });
  return res.json();
}

export async function gameAction(gameId: string, action: string, data: any = {}, score?: number) {
  const body: any = { action, ...data };
  if (score !== undefined) body.score = score;
  const res = await fetch(`${API_URL}/games/${gameId}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function getUserGames() {
  const res = await fetch(`${API_URL}/games/user/me`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function getLeaderboard(gameName: string) {
  const res = await fetch(`${API_URL}/leaderboard?gameName=${gameName}`);
  return res.json();
} 