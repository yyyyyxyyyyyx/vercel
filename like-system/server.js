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
