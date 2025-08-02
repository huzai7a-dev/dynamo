<template>
  <component :is="iconComponent" v-bind="iconProps" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  color: { type: String, default: undefined },
})

// Lazy icon mapping - each icon is imported only when accessed
const iconMap = {
  Mail: () => import('lucide-vue-next').then(m => m.Mail),
  Phone: () => import('lucide-vue-next').then(m => m.Phone),
  Instagram: () => import('lucide-vue-next').then(m => m.Instagram),
  Facebook: () => import('lucide-vue-next').then(m => m.Facebook),
  Linkedin: () => import('lucide-vue-next').then(m => m.Linkedin),
  Twitter: () => import('lucide-vue-next').then(m => m.Twitter),
  X: () => import('lucide-vue-next').then(m => m.X),
  PenTool: () => import('lucide-vue-next').then(m => m.PenTool),
  Palette: () => import('lucide-vue-next').then(m => m.Palette),
  BadgePercent: () => import('lucide-vue-next').then(m => m.BadgePercent),
  PenLine: () => import('lucide-vue-next').then(m => m.PenLine),
  Anchor: () => import('lucide-vue-next').then(m => m.Anchor),
  Users: () => import('lucide-vue-next').then(m => m.Users),
  Quote: () => import('lucide-vue-next').then(m => m.Quote),
  ShoppingCart: () => import('lucide-vue-next').then(m => m.ShoppingCart),
  Handshake: () => import('lucide-vue-next').then(m => m.Handshake),
  HandCoins: () => import('lucide-vue-next').then(m => m.HandCoins),
  Shield: () => import('lucide-vue-next').then(m => m.Shield),
  Info: () => import('lucide-vue-next').then(m => m.Info),
  Lock: () => import('lucide-vue-next').then(m => m.Lock),
  RefreshCw: () => import('lucide-vue-next').then(m => m.RefreshCw),
  FileText: () => import('lucide-vue-next').then(m => m.FileText),
  Cookie: () => import('lucide-vue-next').then(m => m.Cookie),
  DollarSign: () => import('lucide-vue-next').then(m => m.DollarSign),
  Truck: () => import('lucide-vue-next').then(m => m.Truck),
  Undo2: () => import('lucide-vue-next').then(m => m.Undo2),
  Link2: () => import('lucide-vue-next').then(m => m.Link2),
  AlertTriangle: () => import('lucide-vue-next').then(m => m.AlertTriangle),
  ArrowRight: () => import('lucide-vue-next').then(m => m.ArrowRight),
  Pencil: () => import('lucide-vue-next').then(m => m.Pencil),
  Brush: () => import('lucide-vue-next').then(m => m.Brush),
  Ruler: () => import('lucide-vue-next').then(m => m.Ruler),
  FileSignature: () => import('lucide-vue-next').then(m => m.FileSignature),
  Building2: () => import('lucide-vue-next').then(m => m.Building2),
  Image: () => import('lucide-vue-next').then(m => m.Image),
  Type: () => import('lucide-vue-next').then(m => m.Type),
  Shapes: () => import('lucide-vue-next').then(m => m.Shapes),
  Feather: () => import('lucide-vue-next').then(m => m.Feather),
  Gem: () => import('lucide-vue-next').then(m => m.Gem),
  BadgeCheck: () => import('lucide-vue-next').then(m => m.BadgeCheck),
  User: () => import('lucide-vue-next').then(m => m.User),
  Minus: () => import('lucide-vue-next').then(m => m.Minus),
  Cuboid: () => import('lucide-vue-next').then(m => m.Cuboid),
  Smile: () => import('lucide-vue-next').then(m => m.Smile),
  Film: () => import('lucide-vue-next').then(m => m.Film),
  BookOpen: () => import('lucide-vue-next').then(m => m.BookOpen),
  Star: () => import('lucide-vue-next').then(m => m.Star),
  Move3d: () => import('lucide-vue-next').then(m => m.Move3d),
  Layers: () => import('lucide-vue-next').then(m => m.Layers),
  Badge: () => import('lucide-vue-next').then(m => m.Badge),
  Waves: () => import('lucide-vue-next').then(m => m.Waves),
  ShoppingBag: () => import('lucide-vue-next').then(m => m.ShoppingBag),
  CircleDot: () => import('lucide-vue-next').then(m => m.CircleDot),
  PaintBucket: () => import('lucide-vue-next').then(m => m.PaintBucket),
  MessageSquare: () => import('lucide-vue-next').then(m => m.MessageSquare),
  PhoneCall: () => import('lucide-vue-next').then(m => m.PhoneCall),
  Clock: ()=> import('lucide-vue-next').then(m => m.Clock),
  Menu: ()=> import('lucide-vue-next').then(m => m.Menu),
  Shirt: ()=> import('lucide-vue-next').then(m => m.Shirt),
  Pen: ()=> import('lucide-vue-next').then(m => m.Pen),
  Building: ()=> import('lucide-vue-next').then(m => m.Building),
  Type: ()=> import('lucide-vue-next').then(m => m.Type),
  Zap: ()=> import('lucide-vue-next').then(m => m.Zap),
  Slash: ()=> import('lucide-vue-next').then(m => m.Slash),
  Box: ()=> import('lucide-vue-next').then(m => m.Box),
  PawPrint: ()=> import('lucide-vue-next').then(m => m.PawPrint),
  Heart: ()=> import('lucide-vue-next').then(m => m.Heart),
  Spool: ()=> import('lucide-vue-next').then(m => m.Spool),
  Logout: ()=> import('lucide-vue-next').then(m => m.LogOut),
  ChartNoAxesCombined: ()=> import('lucide-vue-next').then(m => m.ChartNoAxesCombined),
  ReceiptText: ()=> import('lucide-vue-next').then(m => m.ReceiptText),
  ChevronDown: ()=> import('lucide-vue-next').then(m => m.ChevronDown),
  ChevronUp: ()=> import('lucide-vue-next').then(m => m.ChevronUp),
  Settings: ()=> import('lucide-vue-next').then(m => m.Settings),
}

const iconComponent = computed(() => {
  const iconLoader = iconMap[props.name]
  if (!iconLoader) {
    console.warn(`Icon "${props.name}" not found`)
    return null
  }
  return defineAsyncComponent(iconLoader)
})

const iconProps = computed(() => ({ size: props.size, color: props.color }))
</script> 