CREATE TABLE "ai_session" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_by_id" uuid,
	"deleted_by" varchar(64),
	"deleted_at" timestamp,
	"user_id" uuid NOT NULL,
	"title" varchar(255),
	"summary" text,
	"message_count" integer DEFAULT 0 NOT NULL,
	"token_usage" jsonb DEFAULT '{"promptTokens":0,"completionTokens":0,"totalTokens":0}'::jsonb,
	"last_message_at" timestamp,
	"is_archived" boolean DEFAULT false NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"extra" jsonb DEFAULT '{}'::jsonb,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "ai_session_message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"msg_seq" bigint NOT NULL,
	"role" varchar(16) NOT NULL,
	"content" jsonb,
	"content_type" char(2) DEFAULT '01' NOT NULL,
	"tool_calls" jsonb,
	"tool_results" jsonb,
	"token_count" integer DEFAULT 0,
	"agent_id" uuid,
	"provider_id" uuid,
	"model_id" uuid,
	"latency_ms" integer,
	"finish_reason" varchar(32),
	"extra" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_agent_message" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "ai_agent_message" ADD COLUMN "provider_id" uuid;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_thinking" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_prefix_completion" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_fim" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_json_output" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_image_input" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_video_input" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_audio_input" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_image_output" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_video_output" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "support_audio_output" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "context_window" integer;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "max_input_tokens" integer;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "max_output_tokens" integer;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "max_thinking_tokens" integer;--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "input_price_per_million" numeric(10, 4);--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "output_price_per_million" numeric(10, 4);--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "cache_hit_price_per_million" numeric(10, 4);--> statement-breakpoint
ALTER TABLE "ai_model" ADD COLUMN "cache_miss_price_per_million" numeric(10, 4);--> statement-breakpoint
CREATE INDEX "idx_ai_session_user" ON "ai_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_session_last_message" ON "ai_session" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "idx_ai_session_message_session_seq" ON "ai_session_message" USING btree ("session_id","msg_seq");--> statement-breakpoint
CREATE INDEX "idx_ai_session_message_created_at" ON "ai_session_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_ai_session_message_agent" ON "ai_session_message" USING btree ("agent_id");--> statement-breakpoint
ALTER TABLE "ai_model" DROP COLUMN "max_tokens";--> statement-breakpoint
ALTER TABLE "ai_model" DROP COLUMN "input_capabilities";--> statement-breakpoint
ALTER TABLE "ai_model" DROP COLUMN "output_capabilities";