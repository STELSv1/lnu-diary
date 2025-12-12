const LocalStrategy = require('passport-local').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const db = require('./database'); // Підключаємо базу даних

module.exports = function(passport) {
    
    // 1. Вхід через Microsoft (OpenID)
    // Цей блок працює тільки якщо ти вписав ключі в .env. Якщо ні - він просто пропускається.
    if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
        passport.use(new MicrosoftStrategy({
            clientID: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            callbackURL: process.env.MICROSOFT_CALLBACK_URL,
            scope: ['user.read']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                // Шукаємо студента за поштою
                const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
                
                if (rows.length > 0) {
                    return done(null, rows[0]); // Знайшли - пускаємо
                } else {
                    // Не знайшли - реєструємо нового
                    const [result] = await db.query('INSERT INTO users (email, full_name, role) VALUES (?, ?, ?)', 
                        [email, profile.displayName, 'student']);
                    return done(null, { id: result.insertId, email, full_name: profile.displayName });
                }
            } catch (err) { return done(err); }
        }));
    }

    // 2. РУЧНИЙ ВХІД (ПРОСТИЙ ТЕКСТ)
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            console.log(`Спроба входу: ${email} з паролем ${password}`);

            // Шукаємо користувача в базі
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            
            // Якщо такої пошти немає
            if (rows.length === 0) {
                console.log('Помилка: Пошту не знайдено');
                return done(null, false, { message: 'Пошта не знайдена.' });
            }

            const user = rows[0];

            // === ПЕРЕВІРКА ПАРОЛЯ (ЯК ТЕКСТ) ===
            // Порівнюємо те, що в базі, з тим, що ти ввів
            if (user.password_hash === password) {
                console.log('Успіх: Пароль вірний');
                return done(null, user);
            } else {
                console.log(`Помилка: Паролі не співпадають. В базі: ${user.password_hash}, Введено: ${password}`);
                return done(null, false, { message: 'Невірний пароль.' });
            }

        } catch (err) { 
            console.error(err);
            return done(err); 
        }
    }));

    // Серіалізація (технічні функції для сесії)
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, rows[0]);
    });
};