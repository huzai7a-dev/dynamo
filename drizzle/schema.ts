import { pgTable, foreignKey, serial, integer, numeric, text, timestamp, bigint, unique, varchar, bigserial, jsonb, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const blending = pgEnum("blending", ['No', 'Yes'])
export const quoteStatus = pgEnum("quote_status", ['pending', 'approved', 'rejected', 'converted', 'quoted'])
export const quoteType = pgEnum("quote_type", ['order', 'vector'])
export const rushFlag = pgEnum("rush_flag", ['No', 'Yes'])
export const userRole = pgEnum("user_role", ['admin', 'user', 'salesman'])


export const delivers = pgTable("delivers", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	estimateAmount: numeric("estimate_amount", { precision: 10, scale: 2 }).notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
		columns: [table.orderId],
		foreignColumns: [orders.id],
		name: "fk_delivers_order_id"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const attachments = pgTable("attachments", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "attachments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	orderId: integer("order_id").notNull(),
	url: text().notNull(),
	publicId: text("public_id").notNull(),
	resourceType: text("resource_type").notNull(),
	format: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bytes: bigint({ mode: "number" }),
	originalFilename: text("original_filename"),
	fieldName: text("field_name"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.orderId],
		foreignColumns: [orders.id],
		name: "attachments_order_id_fkey"
	}).onDelete("cascade"),
]);

export const roles = pgTable("roles", {
	roleId: serial("role_id").primaryKey().notNull(),
	roleName: varchar("role_name", { length: 50 }).notNull(),
}, (table) => [
	unique("roles_role_name_key").on(table.roleName),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	userName: varchar("user_name", { length: 100 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	primaryEmail: varchar("primary_email", { length: 255 }).notNull(),
	secondaryEmail: varchar("secondary_email", { length: 255 }),
	invoiceEmail: varchar("invoice_email", { length: 255 }).notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	contactName: varchar("contact_name", { length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
	cellNumber: varchar("cell_number", { length: 50 }),
	faxNumber: varchar("fax_number", { length: 10 }),
	country: varchar({ length: 100 }).default('United States'),
	city: varchar({ length: 100 }),
	zipCode: varchar("zip_code", { length: 20 }),
	reference: varchar({ length: 255 }),
	address: text(),
	website: varchar({ length: 255 }),
	state: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	role: integer().default(2).notNull(),
	refrenence: varchar({ length: 50 }),
	salesMan: varchar("sales_man", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.role],
		foreignColumns: [roles.roleId],
		name: "fk_role"
	}),
	unique("users_user_name_key").on(table.userName),
	unique("users_primary_email_key").on(table.primaryEmail),
]);

export const vectors = pgTable("vectors", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	vectorName: text("vector_name").notNull(),
	poNumber: text("po_number"),
	blending: blending().notNull(),
	rush: rushFlag().notNull(),
	numColors: integer("num_colors"),
	instructions: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	paymentStatus: varchar("payment_status", { length: 50 }).default('unpaid').notNull(),
	price: numeric({ precision: 10, scale: 2 }).default('0').notNull(),
	requiredFormat: text("required_format").notNull(),
	vectorType: varchar("vector_type", { length: 50 }),
	metadata: jsonb(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fromQuoteId: bigint("from_quote_id", { mode: "number" }),
	isFromQuote: boolean("is_from_quote").default(false).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "vectors_user_id_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
		columns: [table.fromQuoteId],
		foreignColumns: [quotes.id],
		name: "fk_vectors_from_quote"
	}).onDelete("set null"),
]);

export const orders = pgTable("orders", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "orders_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	orderName: text("order_name").notNull(),
	poNumber: text("po_number"),
	requiredFormat: text("required_format").notNull(),
	widthIn: numeric("width_in", { precision: 10, scale: 2 }),
	heightIn: numeric("height_in", { precision: 10, scale: 2 }),
	fabric: text().notNull(),
	placement: text().notNull(),
	numColors: integer("num_colors"),
	blending: blending().default('No').notNull(),
	rush: rushFlag().default('No').notNull(),
	instructions: text(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	faceless: varchar({ length: 255 }).default(sql`NULL`),
	userId: integer("user_id").default(12).notNull(),
	paymentStatus: varchar("payment_status", { length: 50 }).default('pending').notNull(),
	price: numeric({ precision: 10, scale: 2 }).default('0').notNull(),
	metadata: jsonb(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fromQuoteId: bigint("from_quote_id", { mode: "number" }),
	isFromQuote: boolean("is_from_quote").default(false).notNull(),
	requiredStitch: varchar("required_stitch", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_user"
	}),
	foreignKey({
		columns: [table.fromQuoteId],
		foreignColumns: [quotes.id],
		name: "fk_orders_from_quote"
	}).onDelete("set null"),
]);

export const orderDeliveries = pgTable("order_deliveries", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("order_id", { mode: "number" }).notNull(),
	stitches: integer(),
	price: numeric({ precision: 12, scale: 2 }),
	discount: numeric({ precision: 12, scale: 2 }),
	totalPrice: numeric("total_price", { precision: 12, scale: 2 }),
	isFree: boolean("is_free"),
	height: numeric({ precision: 10, scale: 2 }),
	width: numeric({ precision: 10, scale: 2 }),
	comments: text(),
	designerLevel: text("designer_level"),
	assignPercentage: numeric("assign_percentage", { precision: 5, scale: 2 }),
	priceCriteria: jsonb("price_criteria"),
	customerRequirement: jsonb("customer_requirement"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.orderId],
		foreignColumns: [orders.id],
		name: "order_deliveries_order_id_fkey"
	}).onDelete("cascade"),
]);

export const vectorDeliveries = pgTable("vector_deliveries", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vectorId: bigint("vector_id", { mode: "number" }).notNull(),
	stitches: integer(),
	price: numeric({ precision: 12, scale: 2 }),
	discount: numeric({ precision: 12, scale: 2 }),
	totalPrice: numeric("total_price", { precision: 12, scale: 2 }),
	isFree: boolean("is_free"),
	height: numeric({ precision: 10, scale: 2 }),
	width: numeric({ precision: 10, scale: 2 }),
	comments: text(),
	designerLevel: text("designer_level"),
	assignPercentage: numeric("assign_percentage", { precision: 5, scale: 2 }),
	priceCriteria: jsonb("price_criteria"),
	customerRequirement: jsonb("customer_requirement"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.vectorId],
		foreignColumns: [vectors.id],
		name: "vector_deliveries_vector_id_fkey"
	}).onDelete("cascade"),
]);

export const vectorAttachments = pgTable("vector_attachments", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "vector_attachments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	vectorId: integer("vector_id").notNull(),
	url: text().notNull(),
	publicId: text("public_id").notNull(),
	resourceType: text("resource_type").notNull(),
	format: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bytes: bigint({ mode: "number" }),
	originalFilename: text("original_filename"),
	fieldName: text("field_name"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.vectorId],
		foreignColumns: [vectors.id],
		name: "fk_vector_attachments_order"
	}).onDelete("cascade"),
]);

export const quotes = pgTable("quotes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	qType: quoteType("q_type").notNull(),
	status: quoteStatus().default('pending').notNull(),
	title: text().notNull(),
	poNumber: text("po_number"),
	instructions: text(),
	estimatedPrice: numeric("estimated_price", { precision: 10, scale: 2 }).default('0'),
	quoteData: jsonb("quote_data").notNull(),
	isConverted: boolean("is_converted").default(false).notNull(),
	convertedAt: timestamp("converted_at", { withTimezone: true, mode: 'string' }),
	targetId: integer("target_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_user"
	}),
]);

export const quoteAttachments = pgTable("quote_attachments", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "quote_attachments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quoteId: bigint("quote_id", { mode: "number" }).notNull(),
	url: text().notNull(),
	publicId: text("public_id").notNull(),
	resourceType: text("resource_type").notNull(),
	format: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bytes: bigint({ mode: "number" }),
	originalFilename: text("original_filename"),
	fieldName: text("field_name"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.quoteId],
		foreignColumns: [quotes.id],
		name: "fk_quote_attachments_quote"
	}).onDelete("cascade"),
]);

export const paymentTransactions = pgTable("payment_transactions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	transactionRef: text("transaction_ref").notNull(), // Our internal reference
	externalRef: text("external_ref"), // 2Checkout Order Reference
	userId: integer("user_id").notNull(),
	amount: numeric({ precision: 10, scale: 2 }).notNull(),
	currency: varchar({ length: 3 }).default('USD').notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(), // pending, paid, failed, refunded
	items: jsonb().notNull(), // [{ type: 'order' | 'vector', id: 123 }]
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_payment_transactions_user"
	}),
	unique("payment_transactions_transaction_ref_key").on(table.transactionRef),
]);
