const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({ secret: 'lnu_secret', resave: false, saveUninitialized: false }));
app.use(flash());

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', require('./routes/auth'));

app.get('/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const db = require('./config/database');
    const userId = req.user.id;
    
    let userSubgroup = 1;
    try {
        const [userData] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (userData.length > 0 && userData[0].subgroup) userSubgroup = userData[0].subgroup;
    } catch (e) {}

    let subjects = [];
    try {
        const [subs] = await db.query('SELECT * FROM subjects');
        subjects = subs || [];
    } catch (e) {}


    const currentSubjectId = req.query.subject_id || 'all';
    let mode = 'summary';
    let summary = [];
    let detailData = { labs: [], modules: [], exam: [], labsSum: 0, modulesSum: 0, totalSum: 0 };

    try {
        if (currentSubjectId === 'all') {
            mode = 'summary';
            const [rows] = await db.query(`
                SELECT s.name as subject_name,
                COALESCE(SUM(CASE WHEN g.category='lab' THEN g.score ELSE 0 END), 0) as labs,
                COALESCE(SUM(CASE WHEN g.category='module' THEN g.score ELSE 0 END), 0) as modules,
                COALESCE(SUM(CASE WHEN g.category='exam' OR g.category='coursework' OR g.category='zbp' THEN g.score ELSE 0 END), 0) as exam,
                MAX(CASE WHEN g.category='exam' OR g.category='coursework' OR g.category='zbp' THEN 1 ELSE 0 END) as has_exam
                FROM subjects s 
                LEFT JOIN grades g ON g.subject_id = s.id AND g.student_id = ?
                GROUP BY s.id, s.name`, [userId]);
            
            summary = (rows || []).map(r => ({ ...r, total: Number(r.labs) + Number(r.modules) + Number(r.exam) }));
        } else {
            mode = 'detail';
            const [grades] = await db.query('SELECT * FROM grades WHERE subject_id = ? AND student_id = ?', [currentSubjectId, userId]);
            const gList = grades || [];
            detailData.labs = gList.filter(g => g.category === 'lab');
            detailData.modules = gList.filter(g => g.category === 'module');
            detailData.exam = gList.filter(g => ['exam', 'coursework', 'zbp'].includes(g.category));
            detailData.labsSum = detailData.labs.reduce((a, b) => a + b.score, 0);
            detailData.modulesSum = detailData.modules.reduce((a, b) => a + b.score, 0);
            const examScore = detailData.exam.reduce((a, b) => a + b.score, 0);
            detailData.totalSum = detailData.labsSum + detailData.modulesSum + examScore;
        }
    } catch (e) { console.log(e); }

    let schedule = [];
    try {
        const [sch] = await db.query(`SELECT * FROM schedule WHERE subgroup = ? ORDER BY FIELD(day_name, 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\\'ятниця', 'Субота'), lesson_num`, [userSubgroup]);
        schedule = sch || [];
    } catch (e) {}

    let tasks = [];
    try {
        const [tsk] = await db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY is_done ASC, deadline ASC', [userId]);
        tasks = tsk || [];
    } catch (e) {}

    res.render('dashboard', { 
        user: req.user, userSubgroup, subjects, currentSubject: currentSubjectId, mode,
        summary, ...detailData, schedule, tasks, currentTab: req.query.tab || 'grades'
    });
});


app.post('/set-subgroup', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const db = require('./config/database');
    try {
        await db.query('UPDATE users SET subgroup = ? WHERE id = ?', [req.body.subgroup, req.user.id]);
        
        const [schedule] = await db.query(`
            SELECT * FROM schedule 
            WHERE subgroup = ? 
            ORDER BY FIELD(day_name, 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\\'ятниця', 'Субота'), lesson_num`, 
            [req.body.subgroup]);

        res.json({ success: true, schedule });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/tasks/add', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    if (req.body.deadline) {
        if (new Date(req.body.deadline) < new Date(Date.now() - 60000)) return res.status(400).json({ error: 'Час не може бути в минулому!' });
    }
    const db = require('./config/database');
    try {
        const [result] = await db.query('INSERT INTO tasks (user_id, text, deadline) VALUES (?, ?, ?)', [req.user.id, req.body.text, req.body.deadline]);
        res.json({ success: true, task: { id: result.insertId, text: req.body.text, deadline: req.body.deadline, is_done: 0 } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/tasks/delete', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const db = require('./config/database');
    await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.body.id, req.user.id]);
    res.json({ success: true });
});
app.post('/tasks/toggle', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const db = require('./config/database');
    await db.query('UPDATE tasks SET is_done = NOT is_done WHERE id = ? AND user_id = ?', [req.body.id, req.user.id]);
    res.json({ success: true });
});

app.get('/api/grades', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const db = require('./config/database');
    const userId = req.user.id;
    const subjectId = req.query.subject_id;

    try {
        if (subjectId === 'all') {
            const [rows] = await db.query(`
                SELECT s.name as subject_name,
                COALESCE(SUM(CASE WHEN g.category='lab' THEN g.score ELSE 0 END), 0) as labs,
                COALESCE(SUM(CASE WHEN g.category='module' THEN g.score ELSE 0 END), 0) as modules,
                COALESCE(SUM(CASE WHEN g.category='exam' OR g.category='coursework' OR g.category='zbp' THEN g.score ELSE 0 END), 0) as exam
                FROM subjects s 
                LEFT JOIN grades g ON g.subject_id = s.id AND g.student_id = ?
                GROUP BY s.id, s.name`, [userId]);
            
            const summary = (rows || []).map(r => ({ ...r, total: Number(r.labs) + Number(r.modules) + Number(r.exam) }));
            res.json({ mode: 'summary', data: summary });
        } else {
            const [grades] = await db.query('SELECT * FROM grades WHERE subject_id = ? AND student_id = ?', [subjectId, userId]);
            const gList = grades || [];
            
            const detailData = {
                labs: gList.filter(g => g.category === 'lab'),
                modules: gList.filter(g => g.category === 'module'),
                exam: gList.filter(g => ['exam', 'coursework', 'zbp'].includes(g.category)),
            };
            
            detailData.labsSum = detailData.labs.reduce((a, b) => a + b.score, 0);
            detailData.modulesSum = detailData.modules.reduce((a, b) => a + b.score, 0);
            const examScore = detailData.exam.reduce((a, b) => a + b.score, 0);
            detailData.totalSum = detailData.labsSum + detailData.modulesSum + examScore;

            res.json({ mode: 'detail', data: detailData });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/login', (req, res) => res.render('login', { error: req.flash('error') }));
app.get('/', (req, res) => res.redirect('/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Start: http://localhost:${PORT}`));