import { sqliteTable, integer, text, blob } from 'drizzle-orm/sqlite-core';

export const signatures = sqliteTable('signatures', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  linkedinUrl: text('linkedin_url'),
  instagramUrl: text('instagram_url'),
  whatsappUrl: text('whatsapp_url'),
  html: text('html').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull(),
  contentType: text('content_type').notNull(),
  data: blob('data').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});