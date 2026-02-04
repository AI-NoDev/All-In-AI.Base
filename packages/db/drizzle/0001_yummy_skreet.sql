CREATE TABLE "knowledge_resource_permission" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resource_type" varchar(16) NOT NULL,
	"resource_id" uuid NOT NULL,
	"grantee_type" varchar(16) NOT NULL,
	"grantee_id" uuid NOT NULL,
	"permission_level" char(1) DEFAULT 'r' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_model" ALTER COLUMN "input_capabilities" SET DEFAULT '{"text":true,"image":false,"file":false,"audio":false,"video":false}'::jsonb;--> statement-breakpoint
ALTER TABLE "ai_model" ALTER COLUMN "output_capabilities" SET DEFAULT '{"text":true,"image":false,"file":false,"audio":false,"video":false}'::jsonb;--> statement-breakpoint
ALTER TABLE "knowledge_base" ALTER COLUMN "embedding_config" SET DEFAULT '{"model":"text-embedding-3-small","dimensions":1536,"chunkSize":1000,"chunkOverlap":200}'::jsonb;--> statement-breakpoint
ALTER TABLE "ai_skill" ALTER COLUMN "folder_id" SET DATA TYPE uuid USING folder_id::uuid;--> statement-breakpoint
ALTER TABLE "ai_agent_session" ALTER COLUMN "token_usage" SET DEFAULT '{"promptTokens":0,"completionTokens":0,"totalTokens":0}'::jsonb;--> statement-breakpoint
CREATE UNIQUE INDEX "resource_permission_unique_idx" ON "knowledge_resource_permission" USING btree ("resource_type","resource_id","grantee_type","grantee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "file_owner_folder_name_unique_idx" ON "knowledge_file" USING btree ("created_by_id","folder_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "folder_owner_path_unique_idx" ON "knowledge_folder" USING btree ("created_by_id","path","name");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_message_session_seq" ON "ai_agent_message" USING btree ("session_id","msg_seq");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_message_created_at" ON "ai_agent_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_session_agent" ON "ai_agent_session" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_session_user" ON "ai_agent_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_session_last_message" ON "ai_agent_session" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "idx_im_message_conversation_seq" ON "im_message" USING btree ("conversation_id","msg_seq");--> statement-breakpoint
CREATE INDEX "idx_im_message_sender" ON "im_message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_im_message_created_at" ON "im_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_im_temp_file_conversation" ON "im_temp_file" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_im_temp_file_message" ON "im_temp_file" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "idx_im_temp_file_expires" ON "im_temp_file" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_im_conversation_read_user" ON "im_conversation_read" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_im_group_member_user" ON "im_group_member" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "knowledge_file" DROP COLUMN "allowed_user_ids";--> statement-breakpoint
ALTER TABLE "knowledge_file" DROP COLUMN "allowed_role_ids";--> statement-breakpoint
ALTER TABLE "knowledge_file" DROP COLUMN "allowed_dept_ids";--> statement-breakpoint
ALTER TABLE "knowledge_file" DROP COLUMN "allow_sub_depts";--> statement-breakpoint
ALTER TABLE "knowledge_folder" DROP COLUMN "allowed_user_ids";--> statement-breakpoint
ALTER TABLE "knowledge_folder" DROP COLUMN "allowed_role_ids";--> statement-breakpoint
ALTER TABLE "knowledge_folder" DROP COLUMN "allowed_dept_ids";--> statement-breakpoint
ALTER TABLE "knowledge_folder" DROP COLUMN "allow_sub_depts";--> statement-breakpoint
ALTER TABLE "system_post" DROP COLUMN "flag";