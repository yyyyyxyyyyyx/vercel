const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lisayang_44',
    database: 'like_system'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Get like count
app.get('/api/like-count', (req, res) => {
    const query = 'SELECT like_count FROM likes WHERE page = "index"';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Update like count
app.post('/api/like', (req, res) => {
    const query = 'UPDATE likes SET like_count = like_count + 1 WHERE page = "index"';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Like added' });
    });
});

module.exports = (req, res) => app(req, res);


/*
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lisayang_44',
    database: 'like_system'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Get like count
app.get('/like-count', (req, res) => {
    const query = 'SELECT like_count FROM likes WHERE page = "index"';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Update like count
app.post('/like', (req, res) => {
    const query = 'UPDATE likes SET like_count = like_count + 1 WHERE page = "index"';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Like added' });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

*/

const PORT = process.env.PORT || 3000; // 使用环境变量中的端口或默认端口 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
