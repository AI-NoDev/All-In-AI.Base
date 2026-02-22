ALTER TABLE "system_notice" ALTER COLUMN "title" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "system_notice" ALTER COLUMN "type" SET DEFAULT '1';--> statement-breakpoint
ALTER TABLE "system_notice" ALTER COLUMN "content" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "system_notice" ADD COLUMN "target_type" varchar(10) DEFAULT 'all' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_notice" ADD COLUMN "target_user_ids" uuid[];--> statement-breakpoint
ALTER TABLE "system_notice" ADD COLUMN "published_at" timestamp with time zone;