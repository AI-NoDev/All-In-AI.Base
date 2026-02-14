CREATE TABLE "ai_agent" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"allowed_user_ids" jsonb DEFAULT '[]'::jsonb,
	"allowed_role_ids" jsonb DEFAULT '[]'::jsonb,
	"allowed_dept_ids" jsonb DEFAULT '[]'::jsonb,
	"allow_sub_depts" boolean DEFAULT false NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text,
	"avatar" varchar(255),
	"color" varchar(32),
	"provider_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"system_prompt" text,
	"tool_ids" jsonb DEFAULT '[]'::jsonb,
	"native_tools" jsonb DEFAULT '[]'::jsonb,
	"temperature" real DEFAULT 0.7,
	"support_loop" boolean DEFAULT false NOT NULL,
	"max_loops" jsonb DEFAULT '10'::jsonb,
	"context_strategy" varchar(64),
	"input_schema" jsonb,
	"structured_output" boolean DEFAULT false NOT NULL,
	"output_schema" jsonb,
	"remark" text,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "ai_agent_message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"msg_seq" bigint NOT NULL,
	"role" varchar(16) NOT NULL,
	"content" jsonb,
	"content_type" char(2) DEFAULT '01' NOT NULL,
	"tool_calls" jsonb,
	"tool_results" jsonb,
	"token_count" integer DEFAULT 0,
	"model_id" uuid,
	"latency_ms" integer,
	"finish_reason" varchar(32),
	"extra" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_agent_session" (
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
	"agent_id" uuid NOT NULL,
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
CREATE TABLE "ai_model" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"allowed_user_ids" jsonb DEFAULT '[]'::jsonb,
	"allowed_role_ids" jsonb DEFAULT '[]'::jsonb,
	"allowed_dept_ids" jsonb DEFAULT '[]'::jsonb,
	"allow_sub_depts" boolean DEFAULT false NOT NULL,
	"provider_id" uuid NOT NULL,
	"name" varchar(128) NOT NULL,
	"model_id" varchar(128) NOT NULL,
	"remark" text,
	"status" char(1) DEFAULT '0',
	"support_tools" boolean DEFAULT false NOT NULL,
	"max_tokens" integer,
	"input_capabilities" jsonb DEFAULT '{"text":true,"image":false,"file":false,"audio":false,"video":false}'::jsonb,
	"output_capabilities" jsonb DEFAULT '{"text":true,"image":false,"file":false,"audio":false,"video":false}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "ai_provider" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"base_url" varchar(512) NOT NULL,
	"token" text NOT NULL,
	"remark" text,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "ai_schema" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"allowed_user_ids" jsonb DEFAULT '[]'::jsonb,
	"allowed_role_ids" jsonb DEFAULT '[]'::jsonb,
	"allowed_dept_ids" jsonb DEFAULT '[]'::jsonb,
	"allow_sub_depts" boolean DEFAULT false NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text,
	"schema" jsonb NOT NULL,
	"remark" text,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "ai_tool" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text,
	"group_id" varchar(36),
	"input_schema" jsonb,
	"output_schema" jsonb,
	"implementation" text,
	"is_async" boolean DEFAULT false,
	"remark" text,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "ai_tool_group" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text,
	"icon" varchar(64),
	"tools" jsonb DEFAULT '[]'::jsonb,
	"order_num" integer DEFAULT 1 NOT NULL,
	"remark" text,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "im_conversation" (
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
	"type" char(1) DEFAULT '1' NOT NULL,
	"name" varchar(128),
	"avatar" varchar(512),
	"owner_id" uuid,
	"last_message_id" uuid,
	"last_message_at" timestamp,
	"member_count" integer DEFAULT 0 NOT NULL,
	"max_members" integer DEFAULT 500,
	"is_top" boolean DEFAULT false NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"announcement" text,
	"extra" jsonb DEFAULT '{}'::jsonb,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "im_conversation_hidden" (
	"conversation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"is_hidden" boolean DEFAULT true NOT NULL,
	"hidden_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "im_conversation_hidden_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "im_conversation_read" (
	"conversation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"last_read_seq" bigint DEFAULT 0 NOT NULL,
	"last_read_at" timestamp DEFAULT now() NOT NULL,
	"unread_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "im_conversation_read_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "im_group_member" (
	"conversation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"nickname" varchar(64),
	"role" char(1) DEFAULT '0' NOT NULL,
	"invited_by_id" uuid,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"muted_until" timestamp,
	"extra" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "im_group_member_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "im_message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"conversation_id" uuid NOT NULL,
	"msg_seq" bigint NOT NULL,
	"sender_id" uuid NOT NULL,
	"msg_type" char(2) DEFAULT '01' NOT NULL,
	"content" jsonb NOT NULL,
	"reply_to_id" uuid,
	"forward_from_id" uuid,
	"at_user_ids" jsonb DEFAULT '[]'::jsonb,
	"is_recalled" boolean DEFAULT false NOT NULL,
	"recalled_at" timestamp,
	"recalled_by_id" uuid,
	"extra" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "im_temp_file" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"conversation_id" uuid,
	"message_id" uuid,
	"name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"extension" varchar(32),
	"mime_type" varchar(128),
	"size" bigint DEFAULT 0 NOT NULL,
	"storage_key" varchar(512) NOT NULL,
	"bucket" varchar(128) NOT NULL,
	"region" varchar(64),
	"etag" varchar(128),
	"expires_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "knowledge_favorite" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"resource_type" varchar(16) NOT NULL,
	"resource_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_file" (
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
	"folder_id" uuid,
	"name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"extension" varchar(32),
	"mime_type" varchar(128),
	"size" bigint DEFAULT 0 NOT NULL,
	"storage_key" varchar(512) NOT NULL,
	"bucket" varchar(128) NOT NULL,
	"region" varchar(64),
	"etag" varchar(128),
	"version_id" varchar(128),
	"storage_class" varchar(32) DEFAULT 'STANDARD',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"description" text,
	"process_status" char(1) DEFAULT '0',
	"process_result" jsonb,
	"download_count" integer DEFAULT 0 NOT NULL,
	"version_count" integer DEFAULT 0 NOT NULL,
	"status" char(1) DEFAULT '0',
	"is_public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_file_version" (
	"id" uuid PRIMARY KEY NOT NULL,
	"file_id" uuid NOT NULL,
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
CREATE TABLE "knowledge_folder" (
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
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"path" text NOT NULL,
	"description" text,
	"icon" varchar(64),
	"color" varchar(32),
	"order_num" integer DEFAULT 0 NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "casbin_rule" (
	"id" serial PRIMARY KEY NOT NULL,
	"ptype" varchar(100) NOT NULL,
	"v0" varchar(100),
	"v1" varchar(100),
	"v2" varchar(100),
	"v3" varchar(100),
	"v4" varchar(100),
	"v5" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(128) NOT NULL,
	"key" varchar(128) NOT NULL,
	"value" varchar(512) NOT NULL,
	"is_system" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_department" (
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
	"parent_id" uuid,
	"ancestors" text,
	"name" varchar(50) NOT NULL,
	"order_num" integer DEFAULT 1 NOT NULL,
	"leader" varchar(20),
	"phone" varchar(11),
	"email" varchar(50),
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_dict" (
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
	"group" varchar(100) NOT NULL,
	"label" varchar(100) NOT NULL,
	"value" varchar(100) NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"css_class" varchar(100),
	"list_class" varchar(100),
	"is_default" boolean DEFAULT false NOT NULL,
	"status" char(1) DEFAULT '0',
	"remark" varchar(512)
);
--> statement-breakpoint
CREATE TABLE "system_dict_group" (
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"status" char(1) DEFAULT '0',
	"remark" varchar(512)
);
--> statement-breakpoint
CREATE TABLE "system_job" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"group" varchar(64) DEFAULT 'DEFAULT' NOT NULL,
	"invoke_target" varchar(500) NOT NULL,
	"cron_expression" varchar(255),
	"misfire_policy" char(1) DEFAULT '3',
	"concurrent" boolean DEFAULT false NOT NULL,
	"status" char(1) DEFAULT '0',
	"next_valid_time" timestamp,
	"remark" varchar(512)
);
--> statement-breakpoint
CREATE TABLE "system_job_log" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"job_name" varchar(64) NOT NULL,
	"job_group" varchar(64) NOT NULL,
	"invoke_target" varchar(500) NOT NULL,
	"job_message" text,
	"status" char(1) DEFAULT '0',
	"exception_info" text,
	"start_time" timestamp,
	"stop_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "system_login_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"login_name" varchar(50),
	"ipaddr" varchar(50),
	"login_location" varchar(255),
	"browser" varchar(50),
	"os" varchar(50),
	"status" char(1) DEFAULT '0',
	"msg" text,
	"login_time" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_menu" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(50) NOT NULL,
	"parent_id" uuid,
	"order_num" integer DEFAULT 1 NOT NULL,
	"path" varchar(200),
	"type" varchar(1) NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"is_cache" boolean DEFAULT true NOT NULL,
	"is_frame" boolean DEFAULT false NOT NULL,
	"perms" varchar(100),
	"icon" varchar(64),
	"component" varchar(255),
	"remark" varchar(512)
);
--> statement-breakpoint
CREATE TABLE "system_notice" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" varchar(50) NOT NULL,
	"type" varchar(1) NOT NULL,
	"content" text NOT NULL,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "system_operation_log" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"business_type" integer,
	"business_types" text,
	"method" varchar(255),
	"request_method" varchar(50),
	"type" integer,
	"name" varchar(50),
	"department_name" varchar(50),
	"url" varchar(255),
	"ip" varchar(50),
	"location" varchar(255),
	"param" text,
	"json_result" text,
	"status" char(1) DEFAULT '0',
	"error_msg" text,
	"time" timestamp,
	"cost_time" bigint
);
--> statement-breakpoint
CREATE TABLE "system_permission" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"parent_id" uuid,
	"name" varchar(100) NOT NULL,
	"code" varchar(100) NOT NULL,
	"type" varchar(20) DEFAULT 'action' NOT NULL,
	"module" varchar(50),
	"resource" varchar(50),
	"action" varchar(50),
	"description" varchar(255),
	"order_num" integer DEFAULT 0 NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	CONSTRAINT "system_permission_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "system_post" (
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
	"code" varchar(64) NOT NULL,
	"name" varchar(50) NOT NULL,
	"sort" varchar(10) NOT NULL,
	"status" char(1) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "system_role" (
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
	"name" varchar(30) NOT NULL,
	"key" varchar(100) NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"data_scope" varchar(1) DEFAULT '5',
	"status" char(1) DEFAULT '0',
	"flag" boolean DEFAULT false,
	"description" varchar(255),
	CONSTRAINT "system_role_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "system_role_department" (
	"role_id" uuid NOT NULL,
	"department_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_role_menu" (
	"role_id" uuid NOT NULL,
	"menu_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_token" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_id" uuid,
	"created_by" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by_id" uuid,
	"updated_by" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"jti" varchar(64) NOT NULL,
	"sub" varchar(128) NOT NULL,
	"iat" timestamp DEFAULT now() NOT NULL,
	"exp" timestamp NOT NULL,
	"scopes" jsonb DEFAULT '[]'::jsonb,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "system_user" (
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
	"dept_id" uuid,
	"login_name" varchar(30) NOT NULL,
	"name" varchar(30) NOT NULL,
	"user_type" varchar(10) DEFAULT 'user',
	"email" varchar(50),
	"phonenumber" varchar(11),
	"sex" varchar(1),
	"avatar" varchar(255),
	"password" varchar(255),
	"salt" varchar(255),
	"status" varchar(1) DEFAULT '0',
	"login_ip" varchar(50),
	"login_date" timestamp,
	"pwd_update_date" timestamp,
	CONSTRAINT "system_user_login_name_unique" UNIQUE("login_name")
);
--> statement-breakpoint
CREATE TABLE "system_user_post" (
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_user_role" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_ai_agent_message_session_seq" ON "ai_agent_message" USING btree ("session_id","msg_seq");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_message_created_at" ON "ai_agent_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_session_agent" ON "ai_agent_session" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_session_user" ON "ai_agent_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_agent_session_last_message" ON "ai_agent_session" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "idx_im_conversation_read_user" ON "im_conversation_read" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_im_group_member_user" ON "im_group_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_im_message_conversation_seq" ON "im_message" USING btree ("conversation_id","msg_seq");--> statement-breakpoint
CREATE INDEX "idx_im_message_sender" ON "im_message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_im_message_created_at" ON "im_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_im_temp_file_conversation" ON "im_temp_file" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_im_temp_file_message" ON "im_temp_file" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "idx_im_temp_file_expires" ON "im_temp_file" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "favorite_unique_idx" ON "knowledge_favorite" USING btree ("user_id","resource_type","resource_id");--> statement-breakpoint
CREATE UNIQUE INDEX "file_owner_folder_name_unique_idx" ON "knowledge_file" USING btree ("created_by_id","folder_id","name");--> statement-breakpoint
CREATE INDEX "idx_casbin_rule_ptype" ON "casbin_rule" USING btree ("ptype");--> statement-breakpoint
CREATE INDEX "idx_casbin_rule_v0" ON "casbin_rule" USING btree ("v0");--> statement-breakpoint
CREATE INDEX "idx_casbin_rule_v1" ON "casbin_rule" USING btree ("v1");--> statement-breakpoint
CREATE INDEX "idx_casbin_rule_v0_v1" ON "casbin_rule" USING btree ("v0","v1");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_casbin_rule" ON "casbin_rule" USING btree ("ptype","v0","v1","v2","v3","v4","v5");