import { integer, json, pgTable, timestamp, varchar, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(2),
});

export const projectTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar(),
  createdBy: varchar().references(() => usersTable.email),
  createdOn: timestamp().defaultNow(),
});

export const framesTable = pgTable("frames", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  frameId: varchar(),
  designCode: text(),
  projectId: varchar().references(() => projectTable.projectId),
  createdOn: timestamp().defaultNow(),
});

export const chatTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chatMessage: json(),
  frameId: varchar().references(() => framesTable.frameId),
  createdBy: varchar().references(() => usersTable.email),
  createdOn: timestamp().defaultNow(),
});

// User's deployed websites
export const deployedSitesTable = pgTable("deployed_sites", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  siteId: varchar({ length: 100 }).notNull().unique(),
  userId: varchar().references(() => usersTable.clerkId),
  projectId: varchar().references(() => projectTable.projectId),
  customData: json(),
  deploymentUrl: varchar({ length: 500 }),
  deploymentStatus: varchar({ length: 50 }),
  deploymentPlatform: varchar({ length: 50 }),
  createdOn: timestamp().defaultNow(),
  updatedOn: timestamp().defaultNow(),
});
