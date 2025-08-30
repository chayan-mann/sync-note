import Dexie from 'dexie';
import type {Table} from 'dexie';

export interface Note {
  _id: string; // We'll use the server's ID as the primary key
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  needsSync?: boolean; 
}

export class MySubClassedDexie extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('noteAppDatabase');
    this.version(1).stores({
      // Primary key is _id, needsSync is an index for querying
      notes: '&_id, needsSync',
    });
  }
}

export const db = new MySubClassedDexie();

