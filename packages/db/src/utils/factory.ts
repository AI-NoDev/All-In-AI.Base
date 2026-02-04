import { createSchemaFactory as createSchemaZodFactory } from 'drizzle-zod';
import z from 'zod/v4';

export const { 
    createInsertSchema: createInsertZodSchema,
    createUpdateSchema: createUpdateZodSchema,
    createSelectSchema: createSelectZodSchema,
} = createSchemaZodFactory({ zodInstance: z });
