const LocalStrategy = require('passport-local').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const db = require('./database'); 

module.exports = function(passport) {
    if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
        passport.use(new MicrosoftStrategy({
            clientID: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            callbackURL: process.env.MICROSOFT_CALLBACK_URL,
            scope: ['user.read']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
                
                if (rows.length > 0) {
                    return done(null, rows[0]); 
                } else {
                    const [result] = await db.query('INSERT INTO users (email, full_name, role) VALUES (?, ?, ?)', 
                        [email, profile.displayName, 'student']);
                    return done(null, { id: result.insertId, email, full_name: profile.displayName });
                }
            } catch (err) { return done(err); }
        }));
    }


    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            console.log(`Спроба входу: ${email} з паролем ${password}`);
 
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            
            if (rows.length === 0) {
                console.log('Помилка: Пошту не знайдено');
                return done(null, false, { message: 'Пошта не знайдена.' });
            }

            const user = rows[0];

          
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

  
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, rows[0]);
    });
};