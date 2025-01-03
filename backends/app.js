import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import sequelize from './config/db.js';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import { csrfProtection } from './middlewares/csrfProtection.js';
import studentRoutes from './routes/studentRoutes.js';
import { sendOtpReg } from './utils/sendOtp.js';
import { upload } from './config/multer.js';
dotenv.config(); 

const PORT=process.env.PORT;


const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(csrfProtection);
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.get('/csrf', csrfProtection, (req, res) => {
    res.status(200).json({ message: 'CSRF token set successfully' });
  });
app.use('/students',studentRoutes);
app.use('/auth',upload(), authRoutes);


app.use(errorHandler);

export default app;