require('dotenv').config(); // 加载环境变量
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// 初始化 Supabase 客户端
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get like count
app.get('/api/like-count', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .select('like_count')
            .eq('page', 'index')
            .single();

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update like count
app.post('/api/like', async (req, res) => {
    try {
        const { data: currentData, error: fetchError } = await supabase
            .from('likes')
            .select('like_count')
            .eq('page', 'index')
            .single();

        if (fetchError) {
            throw fetchError;
        }

        const newLikeCount = (currentData.like_count || 0) + 1;

        const { error: updateError } = await supabase
            .from('likes')
            .update({ like_count: newLikeCount })
            .eq('page', 'index');

        if (updateError) {
            throw updateError;
        }

        res.json({ message: 'Like added', like_count: newLikeCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get comment
app.get('/api/comments', async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        // 获取分页的评论
        const { data, error, count } = await supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(start, end); // 只获取当前页的数据

        if (error) {
            throw error;
        }

        const totalPages = Math.ceil(count / limit);

        res.json({
            comments: data,
            totalPages,
            currentPage: parseInt(page, 10),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Add a new comment
app.post('/api/comments', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const { data, error } = await supabase
            .from('comments')
            .insert([{ content }]);

        if (error) {
            throw error;
        }

        // 返回成功信息
        res.json({ message: 'Comment added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // 导出 app 实例



/*
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



const PORT = process.env.PORT || 3000; // 使用环境变量中的端口或默认端口 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

*/
