import { Database } from 'bun:sqlite';
import { join } from 'path';

const DB_PATH = join(import.meta.dir, '../../../../data/monitor.db');

// 确保目录存在
await Bun.$`mkdir -p ${join(import.meta.dir, '../../../../data')}`.quiet();

export const monitorDb = new Database(DB_PATH);

// 开启 WAL 模式
monitorDb.run('PRAGMA journal_mode = WAL');

// 创建表
monitorDb.run(`
  CREATE TABLE IF NOT EXISTS metrics_raw (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    value REAL NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

monitorDb.run(`CREATE INDEX IF NOT EXISTS idx_raw_time ON metrics_raw(created_at)`);
monitorDb.run(`CREATE INDEX IF NOT EXISTS idx_raw_type ON metrics_raw(type)`);

monitorDb.run(`
  CREATE TABLE IF NOT EXISTS metrics_5m (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    avg REAL NOT NULL,
    max REAL NOT NULL,
    min REAL NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

monitorDb.run(`CREATE INDEX IF NOT EXISTS idx_5m_time ON metrics_5m(created_at)`);
monitorDb.run(`CREATE INDEX IF NOT EXISTS idx_5m_type ON metrics_5m(type)`);

monitorDb.run(`
  CREATE TABLE IF NOT EXISTS metrics_1h (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    avg REAL NOT NULL,
    max REAL NOT NULL,
    min REAL NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

monitorDb.run(`CREATE INDEX IF NOT EXISTS idx_1h_time ON metrics_1h(created_at)`);
monitorDb.run(`CREATE INDEX IF NOT EXISTS idx_1h_type ON metrics_1h(type)`);

console.log('Monitor database initialized at:', DB_PATH);
