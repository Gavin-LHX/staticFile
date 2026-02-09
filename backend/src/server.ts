import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import db from './models/database';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import shareRoutes from './routes/share';
import { handleMulterError } from './middleware/upload';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/share', shareRoutes);

app.use(handleMulterError);

cron.schedule('0 2 * * *', () => {
  console.log('Running expired files cleanup...');
  const expiredFiles = db.prepare('SELECT * FROM files WHERE expiresAt < ?').get(new Date().toISOString()) as any[];
  
  if (expiredFiles) {
    expiredFiles.forEach((file: any) => {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }
      db.prepare('DELETE FROM files WHERE id = ?').run(file.id);
    });
    console.log(`Cleaned up ${expiredFiles.length} expired files`);
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
