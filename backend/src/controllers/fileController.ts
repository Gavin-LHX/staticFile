import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import db from '../models/database';
import { generateShortLink, calculateExpirationDate } from '../utils/helpers';

export const uploadFile = (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { password, expiresInDays } = req.body;
  const userId = req.userId;

  try {
    let shortLink = generateShortLink();
    let linkExists = true;

    while (linkExists) {
      const existing = db.prepare('SELECT id FROM files WHERE shortLink = ?').get(shortLink);
      if (!existing) {
        linkExists = false;
      } else {
        shortLink = generateShortLink();
      }
    }

    const expiresAt = expiresInDays ? calculateExpirationDate(parseInt(expiresInDays)) : null;

    const stmt = db.prepare(`
      INSERT INTO files (userId, originalName, fileName, filePath, fileSize, mimeType, shortLink, password, expiresAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      req.file.originalname,
      req.file.filename,
      req.file.path,
      req.file.size,
      req.file.mimetype,
      shortLink,
      password || null,
      expiresAt ? expiresAt.toISOString() : null
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      shortLink,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      expiresAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const getFiles = (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { search } = req.query;

  try {
    let query = 'SELECT * FROM files WHERE userId = ?';
    const params: any[] = [userId];

    if (search) {
      query += ' AND originalName LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY createdAt DESC';

    const files = db.prepare(query).all(...params);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

export const getFile = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND userId = ?').get(id, userId) as any;

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};

export const deleteFile = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND userId = ?').get(id, userId) as any;

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fs = require('fs');
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    db.prepare('DELETE FROM files WHERE id = ?').run(id);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

export const updateFile = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const { password, expiresInDays } = req.body;

  try {
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND userId = ?').get(id, userId) as any;

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const expiresAt = expiresInDays ? calculateExpirationDate(parseInt(expiresInDays)) : file.expiresAt;

    db.prepare('UPDATE files SET password = ?, expiresAt = ? WHERE id = ?').run(
      password || null,
      expiresAt ? expiresAt.toISOString() : null,
      id
    );

    res.json({ message: 'File updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update file' });
  }
};

export const getStats = (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const totalFiles = db.prepare('SELECT COUNT(*) as count FROM files WHERE userId = ?').get(userId) as any;
    const totalSize = db.prepare('SELECT SUM(fileSize) as size FROM files WHERE userId = ?').get(userId) as any;
    const totalDownloads = db.prepare('SELECT SUM(downloadCount) as downloads FROM files WHERE userId = ?').get(userId) as any;
    const popularFiles = db.prepare('SELECT * FROM files WHERE userId = ? ORDER BY downloadCount DESC LIMIT 5').all(userId);

    res.json({
      totalFiles: totalFiles.count,
      totalSize: totalSize.size || 0,
      totalDownloads: totalDownloads.downloads || 0,
      popularFiles
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
