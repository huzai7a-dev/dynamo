import type { IconName } from "~/components/Icon.vue";
import { ROLE } from "~~/shared/constants";

const ALL_ITEMS: Record<string, { title: string; icon: IconName; href: string }> = {
    DASHBOARD: {
        title: 'Overall Records',
        icon: 'LayoutDashboard',
        href: '/dashboard',
    },
    ORDERS: {
        title: 'Orders',
        icon: 'ShoppingCart',
        href: '/orders',
    },
    VECTORS: {
        title: 'Vectors',
        icon: 'PenTool',
        href: '/vectors',
    },
    QUOTES: {
        title: "Quotes",
        icon: "Quote",
        href: "/quotes",
    },
    PROFILES: {
        title: "Profiles",
        icon: "User",
        href: "/profiles",
    },
    INVOICES: {
        title: "Invoices",
        icon: "ReceiptText",
        href: "/invoices",
    },
}

const USER_NAV_ITEMS = [
    ALL_ITEMS.DASHBOARD,
    ALL_ITEMS.ORDERS,
    ALL_ITEMS.VECTORS,
    ALL_ITEMS.QUOTES,
    ALL_ITEMS.INVOICES,
];

const ADMIN_NAV_ITEMS = [
    ALL_ITEMS.DASHBOARD,
    ALL_ITEMS.PROFILES,
];

const SALESMAN_NAV_ITEMS = [
    ALL_ITEMS.DASHBOARD,
];

export const CREATE_NAV_ITEMS = [
    { title: "Create Order", icon: "ShoppingCart", href: "/orders/create" },
    { title: "Create Quote", icon: "Quote", href: "/quotes/create" },
    { title: "Create Vector", icon: "PenTool", href: "/vectors/create" },
];
const NAV_ITEMS = {
    [ROLE.User]: USER_NAV_ITEMS,
    [ROLE.Admin]: ADMIN_NAV_ITEMS,
    [ROLE.Salesman]: SALESMAN_NAV_ITEMS,
}

export const getNavItems = (role: ROLE) => NAV_ITEMS[role];