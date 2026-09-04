import { relations } from "drizzle-orm/relations";
import { orders, delivers, attachments, users, quotes, vectors, roles, orderDeliveries, priceCategories, vectorDeliveries, vectorAttachments, quoteAttachments, paymentTransactions } from "./schema";

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
	orders: many(orders),
	vectors: many(vectors),
	role: one(roles, {
		fields: [users.role],
		references: [roles.roleId]
	}),
	priceCategories: many(priceCategories),
	quotes: many(quotes),
	paymentTransactions: many(paymentTransactions),
}));

export const quotesRelations = relations(quotes, ({one, many}) => ({
	orders: many(orders),
	vectors: many(vectors),
	user: one(users, {
		fields: [quotes.userId],
		references: [users.id]
	}),
	quoteAttachments: many(quoteAttachments),
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

export const rolesRelations = relations(roles, ({many}) => ({
	users: many(users),
}));

export const orderDeliveriesRelations = relations(orderDeliveries, ({one}) => ({
	order: one(orders, {
		fields: [orderDeliveries.orderId],
		references: [orders.id]
	}),
}));

export const priceCategoriesRelations = relations(priceCategories, ({one}) => ({
	user: one(users, {
		fields: [priceCategories.userId],
		references: [users.id]
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

export const paymentTransactionsRelations = relations(paymentTransactions, ({one}) => ({
	user: one(users, {
		fields: [paymentTransactions.userId],
		references: [users.id]
	}),
}));