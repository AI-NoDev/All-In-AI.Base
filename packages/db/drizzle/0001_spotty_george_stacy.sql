DROP INDEX IF EXISTS "folder_owner_path_unique_idx";--> statement-breakpoint
ALTER TABLE "knowledge_file" ADD COLUMN IF NOT EXISTS "version_count" integer DEFAULT 0 NOT NULL;