/**
 * Casbin 迁移脚本
 * 将 role.sort 从 varchar 转换为 integer，并清理废弃字段
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

// 直接从环境变量或默认值获取数据库连接
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/allinai';
const queryClient = postgres(DATABASE_URL);
const db = drizzle({ client: queryClient });

async function migrate() {
  console.log('🔧 Starting Casbin migration...');

  try {
    // 1. 转换 sort 列类型
    console.log('📝 Converting system_role.sort to integer...');
    await db.execute(sql`
      ALTER TABLE system_role 
      ALTER COLUMN sort TYPE integer 
      USING CASE 
        WHEN sort ~ '^[0-9]+$' THEN sort::integer 
        ELSE 0 
      END
    `);
    console.log('✅ sort column converted');

    // 2. 删除 system_role 废弃字段
    console.log('📝 Dropping deprecated columns from system_role...');
    const roleColumns = ['menu_ids', 'dept_ids', 'permissions'];
    for (const col of roleColumns) {
      try {
        await db.execute(sql.raw(`ALTER TABLE system_role DROP COLUMN IF EXISTS ${col}`));
        console.log(`   ✅ Dropped ${col}`);
      } catch (e) {
        console.log(`   ⚠️ ${col} already dropped or doesn't exist`);
      }
    }

    // 3. 删除 system_user 废弃字段
    console.log('📝 Dropping deprecated columns from system_user...');
    const userColumns = ['parent_id', 'role_id', 'role_ids', 'post_ids', 'permissions'];
    for (const col of userColumns) {
      try {
        await db.execute(sql.raw(`ALTER TABLE system_user DROP COLUMN IF EXISTS ${col}`));
        console.log(`   ✅ Dropped ${col}`);
      } catch (e) {
        console.log(`   ⚠️ ${col} already dropped or doesn't exist`);
      }
    }

    // 4. 添加 description 列（如果不存在）
    console.log('📝 Adding description column to system_role...');
    try {
      await db.execute(sql`
        ALTER TABLE system_role 
        ADD COLUMN IF NOT EXISTS description varchar(255)
      `);
      console.log('   ✅ description column added');
    } catch (e) {
      console.log('   ⚠️ description column already exists');
    }

    // 5. 添加 key 唯一约束（如果不存在）
    console.log('📝 Adding unique constraint on system_role.key...');
    try {
      await db.execute(sql`
        ALTER TABLE system_role 
        ADD CONSTRAINT system_role_key_unique UNIQUE (key)
      `);
      console.log('   ✅ unique constraint added');
    } catch (e) {
      console.log('   ⚠️ unique constraint already exists');
    }

    // 6. 创建 casbin_rule 表
    console.log('📝 Creating casbin_rule table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS casbin_rule (
        id SERIAL PRIMARY KEY,
        ptype varchar(100) NOT NULL,
        v0 varchar(100),
        v1 varchar(100),
        v2 varchar(100),
        v3 varchar(100),
        v4 varchar(100),
        v5 varchar(100)
      )
    `);
    console.log('   ✅ casbin_rule table created');

    // 7. 创建 casbin_rule 索引
    console.log('📝 Creating casbin_rule indexes...');
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_casbin_rule_ptype ON casbin_rule(ptype)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_casbin_rule_v0 ON casbin_rule(v0)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_casbin_rule_v1 ON casbin_rule(v1)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_casbin_rule_v0_v1 ON casbin_rule(v0, v1)`);
    try {
      await db.execute(sql`
        CREATE UNIQUE INDEX IF NOT EXISTS uniq_casbin_rule 
        ON casbin_rule(ptype, v0, v1, v2, v3, v4, v5)
      `);
    } catch (e) {
      console.log('   ⚠️ unique index may already exist');
    }
    console.log('   ✅ indexes created');

    // 8. 创建 system_permission 表
    console.log('📝 Creating system_permission table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS system_permission (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        code varchar(100) NOT NULL UNIQUE,
        name varchar(100) NOT NULL,
        type varchar(20) NOT NULL,
        module varchar(50),
        resource varchar(50),
        action varchar(50),
        description varchar(255),
        parent_id uuid REFERENCES system_permission(id),
        order_num integer DEFAULT 0,
        status boolean DEFAULT true,
        created_by varchar(64) NOT NULL,
        updated_by varchar(64) NOT NULL,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now()
      )
    `);
    console.log('   ✅ system_permission table created');

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
