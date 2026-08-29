// web/src/lib/groupOrderStore.ts — simple YZ group order for checkout popup (local + Firestore for cross-phone)
import { Product } from 'src/lib/orderStore'
import { db } from 'src/lib/firebase'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

export type GroupOrderStatus = 'active' | 'checkout' | 'completed' | 'expired'

export interface GroupMember {
  userId: string
  name: string
  role: 'host' | 'joiner'
}

export interface GroupItem {
  id: string
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  addedByUserId: string
  addedByName: string
}

export interface GroupOrder {
  id: string
  code: string // YZ-XXXX-XXXX for legacy, or hidden alphabets like DZR for product version
  hiddenAlphabets?: string // product hidden letters, e.g., DZR
  status: GroupOrderStatus
  hostUserId: string
  members: GroupMember[]
  items: GroupItem[]
  createdAt: string
  expiresAt: string
}

const STORAGE_KEY = 'yumzee_group_orders_yz'
const EVENT = 'yumzee_group_update'
const BASE_FEE = 200
const DISCOUNT = 0.3
const EXPIRY = 60 * 60 * 1000

function dispatch() { if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT)) }
export const subscribeGroupStore = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}
export function generateGroupCode(): string {
  const chars = 'BCDFGHJKLMNPQRSTUVWXYZ23456789'
  let p = ''
  for (let i = 0; i < 8; i++) p += chars[Math.floor(Math.random() * chars.length)]
  return `YZ-${p.slice(0, 4)}-${p.slice(4, 8)}`
}
const genId = (pre: string) => `${pre}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
function loadAll(): GroupOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr: GroupOrder[] = raw ? JSON.parse(raw) : []
    const now = Date.now()
    let changed = false
    const fixed = arr.map(g => {
      if (g.status === 'active' && new Date(g.expiresAt).getTime() < now) { changed = true; return { ...g, status: 'expired' as GroupOrderStatus } }
      return g
    })
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed))
    return fixed
  } catch { return [] }
}
function saveAll(a: GroupOrder[]) { if (typeof window === 'undefined') return; localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); dispatch() }
export function calculateDeliveryFee(count: number) { return count >= 2 ? Math.round(BASE_FEE * (1 - DISCOUNT)) : BASE_FEE }
export function calculateGroupTotal(g: GroupOrder) {
  const memberTotals = g.members.map(m => ({ userId: m.userId, name: m.name, role: m.role, total: g.items.filter(i => i.addedByUserId === m.userId).reduce((s, i) => s + i.price * i.quantity, 0) }))
  const subtotal = memberTotals.reduce((s, m) => s + m.total, 0)
  const deliveryFee = calculateDeliveryFee(g.members.length)
  return { memberTotals, subtotal, deliveryFee, grandTotal: subtotal + deliveryFee, baseFee: BASE_FEE }
}
// Firestore helpers — fire-and-forget, fallback to local
async function firestoreSave(g: GroupOrder) {
  try { await setDoc(doc(db, 'groupOrders', g.code), g, { merge: true }) } catch {}
}
async function firestoreGet(code: string): Promise<GroupOrder | null> {
  try {
    const snap = await getDoc(doc(db, 'groupOrders', code.toUpperCase()))
    if (snap.exists()) return snap.data() as GroupOrder
  } catch {}
  return null
}
export const GroupOrderStore = {
  getAll() { return loadAll() },
  getByCode(code: string) {
    const up = code.trim().toUpperCase().replace(/\s+/g, '')
    return loadAll().find(g => g.code.toUpperCase() === up || (g.hiddenAlphabets && g.hiddenAlphabets.toUpperCase() === up))
  },
  async getByCodeAsync(code: string): Promise<GroupOrder | null> {
    const up = code.trim().toUpperCase().replace(/\s+/g, '')
    const local = loadAll().find(g => g.code.toUpperCase() === up || (g.hiddenAlphabets && g.hiddenAlphabets.toUpperCase() === up))
    if (local) return local
    const remote = await firestoreGet(code)
    if (remote) { saveAll([remote, ...loadAll()]); return remote }
    // also try hiddenAlphabets search in Firestore via getAll
    try {
      const snap = await getDoc(doc(db, 'groupOrders', up))
      if (snap.exists()) return snap.data() as GroupOrder
    } catch {}
    return null
  },
  getActiveForUser(uid: string) { return loadAll().find(g => g.status === 'active' && g.members.some(m => m.userId === uid)) },
  // Legacy YZ code
  createGroupOrder(params: { hostUserId: string; hostName: string; items: { product: Product; quantity: number }[] }): GroupOrder {
    let code = generateGroupCode()
    if (loadAll().some(g => g.code === code)) code = generateGroupCode()
    const now = new Date()
    const hiddenAlphabets = params.items.map(it => (it.product as any).hiddenAlphabet || String.fromCharCode(65 + (it.product.id % 26))).join('')
    const g: GroupOrder = {
      id: genId('grp'), code, hiddenAlphabets, status: 'active', hostUserId: params.hostUserId,
      members: [{ userId: params.hostUserId, name: params.hostName, role: 'host' }],
      items: params.items.map(it => ({ id: genId('item'), productId: it.product.id, productName: it.product.name, productImage: it.product.image, price: it.product.price, quantity: it.quantity, addedByUserId: params.hostUserId, addedByName: params.hostName })),
      createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + EXPIRY).toISOString(),
    }
    saveAll([g, ...loadAll()])
    firestoreSave(g)
    return g
  },
  // New product hidden alphabet: code is hidden alphabets string like DZR
  createGroupOrderByAlphabets(params: { hostUserId: string; hostName: string; items: { product: Product; quantity: number }[] }): GroupOrder {
    const hiddenAlphabets = params.items.map(it => (it.product as any).hiddenAlphabet || String.fromCharCode(65 + (it.product.id % 26))).join('').toUpperCase()
    const code = hiddenAlphabets || generateGroupCode()
    const existing = loadAll().find(g => g.code.toUpperCase() === code || (g.hiddenAlphabets && g.hiddenAlphabets.toUpperCase() === code))
    if (existing && existing.status === 'active') return existing
    const now = new Date()
    const g: GroupOrder = {
      id: genId('grp'), code, hiddenAlphabets, status: 'active', hostUserId: params.hostUserId,
      members: [{ userId: params.hostUserId, name: params.hostName, role: 'host' }],
      items: params.items.map(it => ({ id: genId('item'), productId: it.product.id, productName: it.product.name, productImage: it.product.image, price: it.product.price, quantity: it.quantity, addedByUserId: params.hostUserId, addedByName: params.hostName })),
      createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + EXPIRY).toISOString(),
    }
    saveAll([g, ...loadAll()])
    firestoreSave(g)
    return g
  },
  async joinGroupOrderAsync(code: string, user: { userId: string; name: string }): Promise<GroupOrder> {
    const up = code.trim().toUpperCase()
    let g = await firestoreGet(up)
    if (g) {
      if (g.status !== 'active') throw new Error('Group not active — create new via INVITE')
      if (new Date(g.expiresAt).getTime() < Date.now()) throw new Error('Code expired after 1 hour')
      if (g.members.some(m => m.userId === user.userId)) throw new Error('Already joined')
      g.members.push({ userId: user.userId, name: user.name, role: 'joiner' })
      try { await updateDoc(doc(db, 'groupOrders', up), { members: g.members }) } catch { await setDoc(doc(db, 'groupOrders', up), g) }
      saveAll([g, ...loadAll().filter(x => x.code !== up)])
      return g
    }
    // fallback local
    return GroupOrderStore.joinGroupOrder(code, user)
  },
  joinGroupOrder(code: string, user: { userId: string; name: string }) {
    const all = loadAll()
    const idx = all.findIndex(g => g.code.toUpperCase() === code.trim().toUpperCase())
    if (idx === -1) throw new Error('No group found for ' + code.toUpperCase() + ' — click INVITE to create one')
    const g = all[idx]
    if (new Date(g.expiresAt).getTime() < Date.now()) { g.status = 'expired'; saveAll(all); throw new Error('Code expired after 1 hour — ask host to INVITE again') }
    if (g.status !== 'active') throw new Error('Group not active — create new via INVITE')
    if (g.members.some(m => m.userId === user.userId)) throw new Error('Already joined')
    g.members.push({ userId: user.userId, name: user.name, role: 'joiner' })
    saveAll(all)
    firestoreSave(g)
    return g
  },
  addItem(code: string, userId: string, product: Product, qty: number) {
    const all = loadAll(); const g = all.find(x => x.code.toUpperCase() === code.toUpperCase())
    if (!g || g.status !== 'active') throw new Error('Group not active')
    const m = g.members.find(x => x.userId === userId); if (!m) throw new Error('Join first')
    const ex = g.items.find(i => i.productId === product.id && i.addedByUserId === userId)
    if (ex) ex.quantity += qty; else g.items.push({ id: genId('item'), productId: product.id, productName: product.name, productImage: product.image, price: product.price, quantity: qty, addedByUserId: userId, addedByName: m.name })
    saveAll(all); return g
  },
  lockForCheckout(code: string, uid: string) {
    const all = loadAll(); const g = all.find(x => x.code.toUpperCase() === code.toUpperCase())
    if (!g) throw new Error('Not found'); if (g.hostUserId !== uid) throw new Error('Only host can pay'); if (g.status !== 'active') throw new Error('Not active')
    g.status = 'checkout'; saveAll(all); return g
  },
  complete(code: string) { const all = loadAll(); const g = all.find(x => x.code.toUpperCase()===code.toUpperCase()); if (g) { g.status='completed'; saveAll(all)} return g }
}
