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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const start = (page - 1) * limit;

        // 修改这里
        const { data, error, count } = await supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(start, start + limit - 1); // 确保只获取 limit 数量的评论

        if (error) {
            throw error;
        }

        const totalPages = Math.ceil(count / limit);

        res.json({
            comments: data,
            totalPages,
            currentPage: page,
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

