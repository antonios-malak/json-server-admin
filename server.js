// server.js
const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = path.join(__dirname, 'db.json');

// Helper functions to read/write database
function readDB() {
  const raw = fs.readFileSync(DB_FILE);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Login endpoint - POST with form data in body
app.post('/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const db = readDB();
    const user = (db.users || []).find(u => u.name === username && u.password === password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate simple token (في الواقع استخدم JWT)
    const token = `token_${user.id}_${Date.now()}`;

    res.json({ 
      success: true,
      token: token,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Custom routes for collections that support full CRUD
const crudCollections = ['products', 'categories', 'languages', 'currencies', 'reports'];

// Custom routes for read-only collections
const readOnlyCollections = ['orders', 'customers', 'stats'];

// Handle CRUD operations for writable collections
crudCollections.forEach(collection => {
  // GET all items
  app.get(`/api/${collection}`, (req, res) => {
    const db = readDB();
    res.json(db[collection] || []);
  });

  // GET single item by ID
  app.get(`/api/${collection}/:id`, (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const item = (db[collection] || []).find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({ message: `${collection} item not found` });
    }
    
    res.json(item);
  });

  // POST - Create new item
  app.post(`/api/${collection}`, (req, res) => {
    const db = readDB();
    const newItem = req.body;
    
    if (!db[collection]) {
      db[collection] = [];
    }
    
    // Generate new ID
    const maxId = db[collection].length > 0 ? Math.max(...db[collection].map(item => item.id || 0)) : 0;
    newItem.id = maxId + 1;
    
    db[collection].push(newItem);
    writeDB(db);
    
    res.status(201).json(newItem);
  });

  // PUT - Update existing item
  app.put(`/api/${collection}/:id`, (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    
    if (!db[collection]) {
      return res.status(404).json({ message: `${collection} collection not found` });
    }
    
    const index = db[collection].findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: `${collection} item not found` });
    }
    
    updatedItem.id = id;
    db[collection][index] = updatedItem;
    writeDB(db);
    
    res.json(updatedItem);
  });

  // DELETE - Remove item
  app.delete(`/api/${collection}/:id`, (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    
    if (!db[collection]) {
      return res.status(404).json({ message: `${collection} collection not found` });
    }
    
    const index = db[collection].findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: `${collection} item not found` });
    }
    
    const deletedItem = db[collection].splice(index, 1)[0];
    writeDB(db);
    
    res.json(deletedItem);
  });
});

// Handle read-only collections (GET only)
readOnlyCollections.forEach(collection => {
  // GET all items
  app.get(`/api/${collection}`, (req, res) => {
    const db = readDB();
    res.json(db[collection] || []);
  });

  // GET single item by ID (except for stats which doesn't need ID)
  if (collection !== 'stats') {
    app.get(`/api/${collection}/:id`, (req, res) => {
      const db = readDB();
      const id = parseInt(req.params.id);
      const item = (db[collection] || []).find(item => item.id === id);
      
      if (!item) {
        return res.status(404).json({ message: `${collection} item not found` });
      }
      
      res.json(item);
    });
  }
});

// Handle users collection for login only (GET with query params)
app.get('/api/users', (req, res) => {
  const { username, password } = req.query;
  
  if (username && password) {
    // Login attempt
    const db = readDB();
    const user = (db.users || []).find(u => u.name === username && u.password === password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } else {
    // Return empty array or error for security
    res.status(400).json({ message: 'Username and password required' });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Admin Dashboard API Server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- POST /auth/login (send username & password in body)`);
  console.log(`- Full CRUD: /api/products, /api/categories, /api/languages, /api/currencies, /api/reports`);
  console.log(`- Read only: /api/orders, /api/customers, /api/stats`);
  console.log(`- Login: /api/users?username=admin&password=112233`);
});