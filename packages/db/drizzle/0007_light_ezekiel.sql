DROP TABLE "ai_tool" CASCADE;--> statement-breakpoint
ALTER TABLE "ai_tool_group" ADD COLUMN "tools" jsonb DEFAULT '[]'::jsonb;