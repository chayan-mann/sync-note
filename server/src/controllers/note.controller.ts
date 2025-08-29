import { Request, Response } from 'express';
import { Note } from '../models/note.model';
import { redisClient } from '../config/redis';

// --- Cache Invalidation ---
const clearUserNotesCache = async (userId: string) => {
    // A more robust way than using KEYS in production
    let cursor = 0;
    do {
        const reply = await redisClient.scan(cursor.toString(), {
            MATCH: `notes:${userId}:*`,
            COUNT: 100,
        });
        cursor = Number(reply.cursor);
        const keys = reply.keys;
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } while (cursor !== 0);
};


export const addNote = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = req.userId!;

    try {
        const note = await Note.create({ title, content, userId });

        // Invalidate cache for this user since their notes have changed
        await clearUserNotesCache(userId);

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getNotes = async (req: Request, res: Response) => {
    const userId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const cacheKey = `notes:${userId}:page:${page}:limit:${limit}`;

    try {
        // 1. Check Redis Cache
        const cachedNotes = await redisClient.get(cacheKey);
        if (cachedNotes) {
            return res.status(200).json(JSON.parse(cachedNotes));
        }

        // 2. If Miss, query MongoDB
        const notes = await Note.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalNotes = await Note.countDocuments({ userId });
        const totalPages = Math.ceil(totalNotes / limit);
        
        const response = {
            notes,
            currentPage: page,
            totalPages,
            totalNotes
        };

        // 3. Store result in Redis with an expiration (e.g., 1 hour)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};