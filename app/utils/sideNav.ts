import type { IconName } from "~/components/Icon.vue";
import { ROLE } from "~~/shared/constants";

const ALL_ITEMS: Record<string, { title: string; icon: IconName; href: string }> = {
    DASHBOARD: {
        title: 'Dashboard',
        icon: 'ChartNoAxesCombined',
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
    ALL_ITEMS.PROFILES,
    ALL_ITEMS.INVOICES,
];

const ADMIN_NAV_ITEMS = [
    ALL_ITEMS.DASHBOARD,
    ALL_ITEMS.PROFILES,
];

const SALESMAN_NAV_ITEMS = [
    ALL_ITEMS.DASHBOARD,
];

const NAV_ITEMS = {
    [ROLE.User]: USER_NAV_ITEMS,
    [ROLE.Admin]: ADMIN_NAV_ITEMS,
    [ROLE.Salesman]: SALESMAN_NAV_ITEMS,
}

export const getNavItems = (role: ROLE) => NAV_ITEMS[role];