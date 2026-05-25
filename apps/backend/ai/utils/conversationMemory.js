const fs = require('fs');
const path = require('path');

// Directory to store memory (relative to project root)
const MEMORY_DIR = path.resolve(__dirname, '../../data');
const MEMORY_FILE = path.join(MEMORY_DIR, 'conversationMemory.json');

// Ensure directory exists
if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify({}), 'utf8');
    return {};
  }
  try {
    const data = fs.readFileSync(MEMORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse conversation memory file:', e);
    return {};
  }
}

function saveMemory(memory) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write conversation memory file:', e);
  }
}

/** Returns the array of past messages for the given user and today's date (YYYY-MM-DD). */
function getHistory(userId) {
  const memory = loadMemory();
  const today = new Date().toISOString().split('T')[0];
  const key = `${userId}:${today}`;
  return memory[key] || [];
}

/** Appends a new message to the user's daily history and persists it. */
function addMessage(userId, role, content) {
  const memory = loadMemory();
  const today = new Date().toISOString().split('T')[0];
  const key = `${userId}:${today}`;
  if (!memory[key]) memory[key] = [];
  memory[key].push({ role, content });
  // Keep only last 50 messages to avoid unbounded growth
  if (memory[key].length > 50) memory[key] = memory[key].slice(-50);
  saveMemory(memory);
}

module.exports = { getHistory, addMessage };
