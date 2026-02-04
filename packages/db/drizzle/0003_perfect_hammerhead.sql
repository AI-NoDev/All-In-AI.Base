CREATE TABLE "im_conversation_hidden" (
	"conversation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"is_hidden" boolean DEFAULT true NOT NULL,
	"hidden_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "im_conversation_hidden_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
