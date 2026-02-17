import { relations } from "drizzle-orm/relations";
import { orders, delivers, attachments, roles, users, vectors, quotes, orderDeliveries, vectorDeliveries, vectorAttachments, quoteAttachments } from "./schema";

export const deliversRelations = relations(delivers, ({one}) => ({
	order: one(orders, {
		fields: [delivers.orderId],
		references: [orders.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	delivers: many(delivers),
	attachments: many(attachments),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	quote: one(quotes, {
		fields: [orders.fromQuoteId],
		references: [quotes.id]
	}),
	orderDeliveries: many(orderDeliveries),
}));

export const attachmentsRelations = relations(attachments, ({one}) => ({
	order: one(orders, {
		fields: [attachments.orderId],
		references: [orders.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	role: one(roles, {
		fields: [users.role],
		references: [roles.roleId]
	}),
	vectors: many(vectors),
	orders: many(orders),
	quotes: many(quotes),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	users: many(users),
}));

export const vectorsRelations = relations(vectors, ({one, many}) => ({
	user: one(users, {
		fields: [vectors.userId],
		references: [users.id]
	}),
	quote: one(quotes, {
		fields: [vectors.fromQuoteId],
		references: [quotes.id]
	}),
	vectorDeliveries: many(vectorDeliveries),
	vectorAttachments: many(vectorAttachments),
}));

export const quotesRelations = relations(quotes, ({one, many}) => ({
	vectors: many(vectors),
	orders: many(orders),
	user: one(users, {
		fields: [quotes.userId],
		references: [users.id]
	}),
	quoteAttachments: many(quoteAttachments),
}));

export const orderDeliveriesRelations = relations(orderDeliveries, ({one}) => ({
	order: one(orders, {
		fields: [orderDeliveries.orderId],
		references: [orders.id]
	}),
}));

export const vectorDeliveriesRelations = relations(vectorDeliveries, ({one}) => ({
	vector: one(vectors, {
		fields: [vectorDeliveries.vectorId],
		references: [vectors.id]
	}),
}));

export const vectorAttachmentsRelations = relations(vectorAttachments, ({one}) => ({
	vector: one(vectors, {
		fields: [vectorAttachments.vectorId],
		references: [vectors.id]
	}),
}));

export const quoteAttachmentsRelations = relations(quoteAttachments, ({one}) => ({
	quote: one(quotes, {
		fields: [quoteAttachments.quoteId],
		references: [quotes.id]
	}),
}));