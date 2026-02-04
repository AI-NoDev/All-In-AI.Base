import { relations } from "drizzle-orm";
import { folder } from "./folder";
import { file } from "./file";
import { fileVersion } from "./fileVersion";

// 文件夹关系
export const folderRelations = relations(folder, ({ one, many }) => ({
  parent: one(folder, {
    fields: [folder.parentId],
    references: [folder.id],
    relationName: "folderParent",
  }),
  children: many(folder, { relationName: "folderParent" }),
  files: many(file),
}));

// 文件关系
export const fileRelations = relations(file, ({ one, many }) => ({
  folder: one(folder, {
    fields: [file.folderId],
    references: [folder.id],
  }),
  versions: many(fileVersion),
}));

// 文件版本关系
export const fileVersionRelations = relations(fileVersion, ({ one }) => ({
  file: one(file, {
    fields: [fileVersion.fileId],
    references: [file.id],
  }),
}));
