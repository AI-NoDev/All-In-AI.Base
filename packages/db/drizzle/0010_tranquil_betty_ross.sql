CREATE TABLE "ai_schema" (
	"id" uuid PRIMARY KEY NOT NULL,
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
