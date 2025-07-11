
import dotenv  from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        // port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD
    },
    jwtSecret: process.env.JWT_SECRET
}


