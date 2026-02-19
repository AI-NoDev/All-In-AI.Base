CREATE TABLE "ai_api_key" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(128) NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"token_prefix" varchar(16) NOT NULL,
	"access_all" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"revoked_at" timestamp,
	"last_used_at" timestamp,
	"remark" text,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "ai_api_key_mcp" (
	"api_key_id" uuid NOT NULL,
	"mcp_server_id" uuid NOT NULL,
	CONSTRAINT "ai_api_key_mcp_api_key_id_mcp_server_id_pk" PRIMARY KEY("api_key_id","mcp_server_id")
);
--> statement-breakpoint
CREATE TABLE "ai_mcp_server" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text,
	"actions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"remark" text,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "knowledge_node" (
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
	"type" varchar(16) NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"path" text DEFAULT '/' NOT NULL,
	"materialized_path" text DEFAULT '' NOT NULL,
	"description" text,
	"icon" varchar(64),
	"color" varchar(32),
	"order_num" integer DEFAULT 0 NOT NULL,
	"original_name" varchar(255),
	"extension" varchar(32),
	"mime_type" varchar(128),
	"size" bigint DEFAULT 0 NOT NULL,
	"storage_key" varchar(512),
	"bucket" varchar(128),
	"region" varchar(64),
	"etag" varchar(128),
	"version_id" varchar(128),
	"storage_class" varchar(32) DEFAULT 'STANDARD',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"process_status" char(1) DEFAULT '0',
	"process_result" jsonb,
	"download_count" integer DEFAULT 0 NOT NULL,
	"version_count" integer DEFAULT 0 NOT NULL,
	"status" char(1) DEFAULT '0',
	"is_public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_node_version" (
	"id" uuid PRIMARY KEY NOT NULL,
	"node_id" uuid NOT NULL,
	"version_number" varchar(32) NOT NULL,
	"storage_key" varchar(512) NOT NULL,
	"bucket" varchar(128) NOT NULL,
	"s3_version_id" varchar(128),
	"etag" varchar(128),
	"size" bigint DEFAULT 0 NOT NULL,
	"change_log" text,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_file" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "knowledge_file_version" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "knowledge_folder" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "knowledge_file" CASCADE;--> statement-breakpoint
DROP TABLE "knowledge_file_version" CASCADE;--> statement-breakpoint
DROP TABLE "knowledge_folder" CASCADE;--> statement-breakpoint
DROP INDEX "idx_ai_session_message_agent";--> statement-breakpoint
ALTER TABLE "ai_agent_session" ALTER COLUMN "agent_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_agent_message" ADD COLUMN "token_usage" jsonb;--> statement-breakpoint
ALTER TABLE "ai_agent_session" ADD COLUMN "provider_id" uuid;--> statement-breakpoint
ALTER TABLE "ai_agent_session" ADD COLUMN "model_id" uuid;--> statement-breakpoint
ALTER TABLE "ai_session" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "ai_session" ADD COLUMN "provider_id" uuid;--> statement-breakpoint
ALTER TABLE "ai_session" ADD COLUMN "model_id" uuid;--> statement-breakpoint
ALTER TABLE "ai_session_message" ADD COLUMN "token_usage" jsonb;--> statement-breakpoint
ALTER TABLE "ai_provider" ADD COLUMN "provider_type" varchar(32) DEFAULT 'openai-compatible' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "node_owner_parent_name_unique_idx" ON "knowledge_node" USING btree ("created_by_id","parent_id","name");--> statement-breakpoint
CREATE INDEX "node_materialized_path_idx" ON "knowledge_node" USING btree ("materialized_path");--> statement-breakpoint
CREATE INDEX "node_parent_id_idx" ON "knowledge_node" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "node_type_idx" ON "knowledge_node" USING btree ("type");--> statement-breakpoint
CREATE INDEX "node_created_by_id_idx" ON "knowledge_node" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "node_version_node_id_idx" ON "knowledge_node_version" USING btree ("node_id");--> statement-breakpoint
ALTER TABLE "ai_agent_message" DROP COLUMN "token_count";--> statement-breakpoint
ALTER TABLE "ai_agent_message" DROP COLUMN "agent_id";--> statement-breakpoint
ALTER TABLE "ai_agent_message" DROP COLUMN "provider_id";--> statement-breakpoint
ALTER TABLE "ai_agent_message" DROP COLUMN "model_id";--> statement-breakpoint
ALTER TABLE "ai_session_message" DROP COLUMN "token_count";--> statement-breakpoint
ALTER TABLE "ai_session_message" DROP COLUMN "agent_id";--> statement-breakpoint
ALTER TABLE "ai_session_message" DROP COLUMN "provider_id";--> statement-breakpoint
ALTER TABLE "ai_session_message" DROP COLUMN "model_id";