function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Sonraki handler'da kullanabiliriz
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}


const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS Middleware
app.use(cors());

// JSON Parse Middleware
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));


// Test route
app.get('/', (req, res) => {
  res.send('🔮 Welcome to the Zodiac & Fortune API!');
});

// Başlat
app.listen(PORT, () => {
  console.log(`🌟 Server running at http://localhost:${PORT}`);
});

const horoscopes = {
  aries: "Today is a powerful day for Aries. Take action!",
  taurus: "Slow and steady wins the race today.",
  gemini: "Communication is your key today.",
  cancer: "Let your emotions guide you.",
  leo: "Shine bright like the sun!",
  virgo: "Attention to detail will help you today.",
  libra: "Seek balance and harmony.",
  scorpio: "Your intensity is your strength today.",
  sagittarius: "Adventure is calling!",
  capricorn: "Work hard, then relax.",
  aquarius: "Think outside the box.",
  pisces: "Dream big and stay inspired.",
};

app.get('/zodiac/:sign', (req, res) => {
  const sign = req.params.sign.toLowerCase();
  const horoscope = horoscopes[sign];
  if (horoscope) {
    res.json({ horoscope });
  } else {
    res.status(404).json({ error: 'Sign not found' });
  }
});

const tarotCards = [
  { name: "The Fool", meaning: "New beginnings, free spirit." },
  { name: "The Magician", meaning: "Power, skill, manifestation." },
  { name: "The Tower", meaning: "Sudden change, upheaval." },
  { name: "The Lovers", meaning: "Relationships, choices, harmony." },
  { name: "The Hermit", meaning: "Introspection, inner guidance." },
  { name: "The Sun", meaning: "Positivity, success, vitality." },
];

app.get('/tarot/draw', (req, res) => {
  const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
  res.json(randomCard);
});

const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new Database('./database/users.db');
const SECRET = "super-secret-key"; // Gerçekte .env dosyasına yazılır

// Register
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed);

    // Kullanıcı başarıyla eklendiyse token oluştur
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });

    res.json({ message: '✅ Registered successfully', token });
  } catch (err) {
    res.status(400).json({ error: '❌ Username already exists' });
  }
});
// Login
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) return res.status(401).json({ error: 'Invalid username' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/profile', authenticate, (req, res) => {
  res.json({
    message: `🎉 Welcome ${req.user.username}!`,
    id: req.user.id,
  });
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
