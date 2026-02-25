CREATE TABLE "system_notice_read" (
	"notice_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"read_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "system_notice_read_notice_id_user_id_pk" PRIMARY KEY("notice_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "ai_workflow" DROP COLUMN "version";--> statement-breakpoint
ALTER TABLE "ai_workflow" DROP COLUMN "published_version";