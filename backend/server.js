const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const Database = require('better-sqlite3');

// App setup
const app = express();
const PORT = 3000;
const SECRET = "super-secret-key"; // Gerçek bir projede bu değeri .env dosyasına taşı

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:5000', // frontend'in portu
  methods: 'GET,POST', // Gerekli HTTP methodlarına izin ver
  allowedHeaders: 'Content-Type, Authorization', // Header'lara izin ver
}));

// JSON Parse Middleware
app.use(express.json());

// Static file middleware (frontend dosyaları)
app.use(express.static(path.join(__dirname, '../frontend')));

// SQLite DB
const db = new Database('./database/users.db');

// Dummy data for horoscopes
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

// Zodiac route
app.get('/zodiac/:sign', (req, res) => {
  const sign = req.params.sign.toLowerCase();
  const horoscope = horoscopes[sign];
  if (horoscope) {
    res.json({ horoscope });
  } else {
    res.status(404).json({ error: 'Sign not found' });
  }
});

// Tarot cards data
const tarotCards = [
  { name: "The Fool", meaning: "New beginnings, free spirit." },
  { name: "The Magician", meaning: "Power, skill, manifestation." },
  { name: "The Tower", meaning: "Sudden change, upheaval." },
  { name: "The Lovers", meaning: "Relationships, choices, harmony." },
  { name: "The Hermit", meaning: "Introspection, inner guidance." },
  { name: "The Sun", meaning: "Positivity, success, vitality." },
];

// Tarot card drawing route
app.get('/tarot/draw', (req, res) => {
  const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
  res.json(randomCard);
});

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Attach the decoded user info to request object
    next(); // Proceed to next handler
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// Register route
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed);

    // Create JWT token
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });

    res.json({ message: '✅ Registered successfully', token });
  } catch (err) {
    res.status(400).json({ error: '❌ Username already exists' });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) return res.status(401).json({ error: 'Invalid username' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  // Create JWT token on successful login
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Profile route (protected by JWT authentication)
app.get('/profile', authenticate, (req, res) => {
  res.json({
    message: `🎉 Welcome ${req.user.username}!`,
    id: req.user.id,
  });
});

// Test route (for general testing)
app.get('/', (req, res) => {
  res.send('🔮 Welcome to the Zodiac & Fortune API!');
});

// Serve static files from frontend (if necessary)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌟 Server running at http://localhost:${PORT}`);
});
