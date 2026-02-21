CREATE TABLE "ai_user_memory" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"agent_id" uuid,
	"session_id" uuid,
	"memory_type" varchar(16) DEFAULT 'LTM' NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"importance" integer DEFAULT 5 NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"last_access_at" timestamp,
	"expire_at" timestamp,
	"embedding" vector(1536),
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE INDEX "idx_user_memory_user" ON "ai_user_memory" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_memory_agent" ON "ai_user_memory" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_user_memory_type" ON "ai_user_memory" USING btree ("memory_type");--> statement-breakpoint
CREATE INDEX "idx_user_memory_session" ON "ai_user_memory" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_user_memory_importance" ON "ai_user_memory" USING btree ("importance");--> statement-breakpoint
CREATE INDEX "idx_user_memory_expire" ON "ai_user_memory" USING btree ("expire_at");