// web/src/lib/orderStore.ts
// Comprehensive reactive state store for YumZee Single & Group Ordering

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export interface Product {
  id: number
  name: string
  category: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  isPopular?: boolean
  prepTimeMinutes?: number
  sellerName?: string
  hiddenAlphabet?: string // A-Z, same for all users, for Group Order INVITE
}

export interface CartItem {
  product: Product
  quantity: number
  selectedOptions?: string[]
}

export interface StudentOrderItem {
  productId: number
  name: string
  price: number
  quantity: number
  image: string
}

export interface GroupParticipant {
  id: string
  name: string
  phone: string
  roomOrHostel?: string
  items: StudentOrderItem[]
  subtotal: number
  deliveryShare: number
  totalAmount: number
  isPaid: boolean
  isHost: boolean
  joinedAt: string
  paidAt?: string
}

export type OrderStatus =
  | 'created'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'sent_to_sellers'
  | 'preparing'
  | 'ready_for_pickup'
  | 'assigned_to_rider'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled'

export interface SingleOrder {
  id: string
  type: 'single'
  status: OrderStatus
  // Customer info
  customerName?: string
  customerPhone?: string
  // Items
  items: StudentOrderItem[]
  // Delivery
  deliveryType: 'delivery' | 'pickup'
  deliveryAddress?: string
  hostelAddress?: string
  roomNumber?: string
  deliveryInstructions?: string
  // Financials — both naming conventions supported
  foodTotal?: number
  foodSubtotal?: number
  deliveryFee: number
  serviceFee?: number
  grandTotal?: number
  totalAmount?: number
  // Meta
  estimatedDeliveryTime?: string
  assignedRider?: { name: string; phone: string; vehicle: string }
  createdAt: string
  updatedAt: string
}

export interface GroupOrder {
  id: string
  groupCode: string
  title: string
  type: 'group'
  hostId: string
  hostName: string
  hostPhone: string
  hostelAddress: string
  deliveryNote: string
  deadline: string
  status: OrderStatus
  isLocked: boolean
  participants: GroupParticipant[]
  baseDeliveryFee: number
  discountPercent: number
  finalDeliveryFee: number
  foodTotal: number
  grandTotal: number
  assignedRider?: { name: string; phone: string; vehicle: string }
  createdAt: string
  updatedAt: string
}

export interface EligibleLocation {
  id: string
  name: string
  zone: string
  active: boolean
}

export interface GroupOrderRules {
  baseDeliveryFee: number
  minGroupSizeForDiscount: number
  discountTiers: { minParticipants: number; discountPercent: number }[]
  maxDeadlineMinutes: number
  serviceFee: number
  eligibleLocations: EligibleLocation[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  SINGLE_ORDERS: 'yumzee_single_orders',
  GROUP_ORDERS: 'yumzee_group_orders',
  GROUP_RULES: 'yumzee_group_rules',
  CURRENT_USER_NAME: 'yumzee_user_name',
  CURRENT_USER_PHONE: 'yumzee_user_phone',
} as const

export const DEFAULT_GROUP_RULES: GroupOrderRules = {
  baseDeliveryFee: 600,
  minGroupSizeForDiscount: 2,
  discountTiers: [
    { minParticipants: 2, discountPercent: 30 },
    { minParticipants: 4, discountPercent: 50 },
    { minParticipants: 6, discountPercent: 70 },
    { minParticipants: 8, discountPercent: 100 },
  ],
  maxDeadlineMinutes: 60,
  serviceFee: 100,
  eligibleLocations: [
    { id: 'moremi', name: 'Moremi Hall — Main Gate', zone: 'Female Halls', active: true },
    { id: 'awolowo', name: 'Awolowo Hall — Junction', zone: 'Male Halls', active: true },
    { id: 'mozambique', name: 'Mozambique Hall — Block A', zone: 'Male Halls', active: true },
    { id: 'queen-idia', name: 'Queen Idia Hall — Side Gate', zone: 'Female Halls', active: true },
    { id: 'independence', name: 'Independence Hall — Main Gate', zone: 'Male Halls', active: true },
    { id: 'sultan-bello', name: 'Sultan Bello Hall', zone: 'Male Halls', active: true },
    { id: 'kuti', name: 'Kuti Hall — Main Gate', zone: 'Female Halls', active: true },
    { id: 'nnamdi-azikiwe', name: 'Nnamdi Azikiwe Hall', zone: 'Mixed Halls', active: true },
    { id: 'campus-gate', name: 'Main Campus Gate', zone: 'Central', active: true },
    { id: 'faculty-arts', name: 'Faculty of Arts Courtyard', zone: 'Academic', active: true },
  ],
}

export const INITIAL_SINGLE_ORDERS: SingleOrder[] = []
export const INITIAL_GROUP_ORDERS: GroupOrder[] = []

// ─── Campus Product Catalogue ─────────────────────────────────────────────────

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Jollof Rice + Chicken',
    category: 'Fast Food',
    description: 'Rich tomato-based party jollof with grilled chicken and coleslaw.',
    price: 1800,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=400&fit=crop',
    rating: 4.9,
    isPopular: true,
    prepTimeMinutes: 15,
    sellerName: 'Mama Chisom Kitchen',
    hiddenAlphabet: 'A',
  },
  {
    id: 2,
    name: 'Shawarma (Chicken)',
    category: 'Savory Snacks',
    description: 'Spicy grilled chicken wrap with cabbage, carrots, and special sauce.',
    price: 1200,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=500&h=400&fit=crop',
    rating: 4.8,
    isPopular: true,
    prepTimeMinutes: 10,
    sellerName: 'Campus Grill Hub',
    hiddenAlphabet: 'B',
  },
  {
    id: 3,
    name: 'Indomie (Spicy) + Egg',
    category: 'Fast Food',
    description: 'Stir-fried spicy noodles topped with a perfectly fried egg.',
    price: 600,
    originalPrice: 800,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop',
    rating: 4.7,
    isPopular: true,
    prepTimeMinutes: 8,
    sellerName: 'Hostel Kitchen Co.',
    hiddenAlphabet: 'C',
  },
  {
    id: 4,
    name: 'Fried Plantain (Dodo)',
    category: 'Savory Snacks',
    description: 'Crispy golden fried plantain slices — perfect savory snack.',
    price: 400,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop',
    rating: 4.6,
    prepTimeMinutes: 7,
    sellerName: 'Mama Chisom Kitchen',
    hiddenAlphabet: 'D',
  },
  {
    id: 5,
    name: 'Puff Puff (6 pcs)',
    category: 'Pastries',
    description: 'Soft, sweet, deep-fried doughnuts — perfect pastry treat.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=400&fit=crop',
    rating: 4.5,
    prepTimeMinutes: 5,
    sellerName: 'Campus Bites',
    hiddenAlphabet: 'E',
  },
  {
    id: 6,
    name: 'Egusi Soup + 2 Wraps',
    category: 'Fast Food',
    description: 'Rich melon-seed soup with assorted meat, served with pounded yam wraps.',
    price: 2200,
    originalPrice: 2700,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop',
    rating: 4.9,
    isPopular: true,
    prepTimeMinutes: 20,
    sellerName: 'Naija Pot',
    hiddenAlphabet: 'F',
  },
  {
    id: 7,
    name: 'Chapman Drink (500ml)',
    category: 'Beverages',
    description: 'Classic Nigerian party drink — fruity, refreshing and ice cold.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
    rating: 4.7,
    prepTimeMinutes: 2,
    sellerName: 'Campus Bites',
    hiddenAlphabet: 'G',
  },
  {
    id: 8,
    name: 'Moi Moi (2 wraps)',
    category: 'Savory Snacks',
    description: 'Steamed bean pudding with egg and fish, wrapped in leaves.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=400&fit=crop',
    rating: 4.6,
    prepTimeMinutes: 10,
    sellerName: 'Naija Pot',
    hiddenAlphabet: 'H',
  },
  {
    id: 9,
    name: 'Zobo Drink (500ml)',
    category: 'Beverages',
    description: 'Chilled hibiscus flower drink with ginger and pineapple flavour.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=500&h=400&fit=crop',
    rating: 4.5,
    prepTimeMinutes: 2,
    sellerName: 'Campus Bites',
    hiddenAlphabet: 'I',
  },
  {
    id: 10,
    name: 'Fried Rice + Turkey',
    category: 'Fast Food',
    description: 'Nigerian-style fried rice loaded with vegetables, served with a turkey leg.',
    price: 2000,
    originalPrice: 2500,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=400&fit=crop',
    rating: 4.8,
    isPopular: true,
    prepTimeMinutes: 15,
    sellerName: 'Mama Chisom Kitchen',
    hiddenAlphabet: 'J',
  },
  {
    id: 11,
    name: 'Akara (Bean Cake) x5',
    category: 'Savory Snacks',
    description: 'Hot, crispy deep-fried bean cakes — perfect savory snack.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=400&fit=crop',
    rating: 4.4,
    prepTimeMinutes: 6,
    sellerName: 'Hostel Kitchen Co.',
    hiddenAlphabet: 'K',
  },
  {
    id: 12,
    name: 'Suya (100g)',
    category: 'Savory Snacks',
    description: 'Peppery grilled beef skewers with spiced yaji and sliced onions.',
    price: 800,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop',
    rating: 4.9,
    isPopular: true,
    prepTimeMinutes: 12,
    sellerName: 'Campus Grill Hub',
    hiddenAlphabet: 'L',
  },
  {
    id: 13,
    name: 'Meat Pie (Large)',
    category: 'Savory Snacks',
    description: 'Flaky pastry filled with seasoned minced meat, potatoes and carrots — campus favourite.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    rating: 4.8,
    isPopular: true,
    prepTimeMinutes: 8,
    sellerName: 'Campus Bites',
    hiddenAlphabet: 'M',
  },
  {
    id: 14,
    name: 'Sausage Roll (2 pcs)',
    category: 'Pastries',
    description: 'Soft rolls wrapped around juicy sausage — perfect for quick bites between lectures.',
    price: 700,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    rating: 4.6,
    prepTimeMinutes: 6,
    sellerName: 'Campus Bites',
    hiddenAlphabet: 'N',
  },
  {
    id: 15,
    name: 'Chicken Sandwich',
    category: 'Pastries',
    description: 'Grilled chicken breast with fresh lettuce, tomatoes and special YumZee sauce.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    rating: 4.7,
    prepTimeMinutes: 7,
    sellerName: 'Hostel Kitchen Co.',
    hiddenAlphabet: 'O',
  },
  {
    id: 16,
    name: 'Pepperoni Pizza Slice',
    category: 'Fast Food',
    description: 'Generous pepperoni slices with melted mozzarella on fresh dough.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    rating: 4.8,
    isPopular: true,
    prepTimeMinutes: 12,
    sellerName: 'Campus Grill Hub',
    hiddenAlphabet: 'P',
  },
  {
    id: 17,
    name: 'Chocolate Cake Slice',
    category: 'Cakes & Desserts',
    description: 'Decadent moist chocolate sponge layered with rich fudge icing.',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    rating: 4.9,
    isPopular: true,
    prepTimeMinutes: 5,
    sellerName: 'Sweet Tooth',
    hiddenAlphabet: 'Q',
  },
  {
    id: 18,
    name: 'Cupcake (2 pcs)',
    category: 'Cakes & Desserts',
    description: 'Soft vanilla cupcakes topped with creamy frosting — sweet study treat.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=400&h=300&fit=crop',
    rating: 4.7,
    prepTimeMinutes: 4,
    sellerName: 'Sweet Tooth',
    hiddenAlphabet: 'R',
  },
  {
    id: 19,
    name: 'Fruit Cup (Mixed)',
    category: 'Healthy Bites',
    description: 'Fresh seasonal fruits — pineapple, watermelon, banana & apple mix.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop',
    rating: 4.6,
    prepTimeMinutes: 3,
    sellerName: 'Healthy Bites Co.',
    hiddenAlphabet: 'S',
  },
  {
    id: 20,
    name: 'Greek Yogurt Parfait',
    category: 'Healthy Bites',
    description: 'Creamy Greek yogurt layered with granola and fresh berries.',
    price: 900,
    image: 'https://images.unsplash.com/photo-1488477181946-64290103bb53?w=400&h=300&fit=crop',
    rating: 4.7,
    prepTimeMinutes: 3,
    sellerName: 'Healthy Bites Co.',
    hiddenAlphabet: 'T',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORE_EVENT = 'yumzee-store-update'

export const dispatchStoreEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORE_EVENT))
  }
}

export const subscribeToStore = (callback: () => void) => {
  if (typeof window === 'undefined') return () => { }
  window.addEventListener(STORE_EVENT, callback)
  return () => window.removeEventListener(STORE_EVENT, callback)
}

export const recomputeGroupTotals = (group: GroupOrder, rules: GroupOrderRules): GroupOrder => {
  const count = group.participants.length
  let discountPercent = 0
  for (const tier of rules.discountTiers) {
    if (count >= tier.minParticipants) discountPercent = tier.discountPercent
  }
  const finalDeliveryFee = Math.round(rules.baseDeliveryFee * (1 - discountPercent / 100))
  const perPersonDelivery =
    group.participants.length > 0 ? finalDeliveryFee / group.participants.length : finalDeliveryFee
  const participants = group.participants.map((p) => {
    const subtotal = p.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return {
      ...p,
      subtotal,
      deliveryShare: Math.round(perPersonDelivery),
      totalAmount: subtotal + Math.round(perPersonDelivery),
    }
  })
  const foodTotal = participants.reduce((sum, p) => sum + p.subtotal, 0)
  return {
    ...group,
    participants,
    discountPercent,
    finalDeliveryFee,
    foodTotal,
    grandTotal: foodTotal + finalDeliveryFee,
    updatedAt: new Date().toISOString(),
  }
}

// ─── ID Generators ────────────────────────────────────────────────────────────

const generateId = (prefix: string) =>
  `${prefix}${Date.now()}${Math.random().toString(36).substring(2, 6)}`

const generateCode = (prefix: string) =>
  `${prefix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`

// ─── OrderStore ───────────────────────────────────────────────────────────────

export const OrderStore = {
  getRules(): GroupOrderRules {
    if (typeof window === 'undefined') return DEFAULT_GROUP_RULES
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROUP_RULES)
      const parsed = data ? JSON.parse(data) : DEFAULT_GROUP_RULES
      // Always merge with defaults to ensure new fields exist
      return { ...DEFAULT_GROUP_RULES, ...parsed }
    } catch {
      return DEFAULT_GROUP_RULES
    }
  },

  saveRules(rules: GroupOrderRules) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.GROUP_RULES, JSON.stringify(rules))
    const groups = this.getGroupOrders()
    const updated = groups.map((g) =>
      g.status === 'created' ? recomputeGroupTotals(g, rules) : g
    )
    localStorage.setItem(STORAGE_KEYS.GROUP_ORDERS, JSON.stringify(updated))
    dispatchStoreEvent()
  },

  getSingleOrders(): SingleOrder[] {
    if (typeof window === 'undefined') return INITIAL_SINGLE_ORDERS
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SINGLE_ORDERS)
      return data ? JSON.parse(data) : INITIAL_SINGLE_ORDERS
    } catch {
      return INITIAL_SINGLE_ORDERS
    }
  },

  getGroupOrders(): GroupOrder[] {
    if (typeof window === 'undefined') return INITIAL_GROUP_ORDERS
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROUP_ORDERS)
      return data ? JSON.parse(data) : INITIAL_GROUP_ORDERS
    } catch {
      return INITIAL_GROUP_ORDERS
    }
  },

  getGroupOrderByCode(code: string): GroupOrder | undefined {
    return this.getGroupOrders().find(
      (g) => g.groupCode.toUpperCase() === code.toUpperCase() || g.id === code
    )
  },

  createSingleOrder(
    orderData: Omit<SingleOrder, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status'>
  ): SingleOrder {
    const orders = this.getSingleOrders()
    const id = generateId('sgl-')
    const newOrder: SingleOrder = {
      ...orderData,
      id,
      type: 'single',
      status: 'payment_confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDeliveryTime: '20-25 mins',
    }
    localStorage.setItem(STORAGE_KEYS.SINGLE_ORDERS, JSON.stringify([newOrder, ...orders]))
    dispatchStoreEvent()
    return newOrder
  },

  createGroupOrder(params: {
    title: string
    hostName: string
    hostPhone: string
    hostelAddress: string
    deliveryNote?: string
    deadlineMinutes: number
    hostInitialItems?: StudentOrderItem[]
  }): GroupOrder {
    const groups = this.getGroupOrders()
    const rules = this.getRules()
    const randomCode = generateCode('YUM-')
    const id = generateId('grp-')
    const hostId = generateId('usr-')
    const hostItems = params.hostInitialItems || []
    const hostSubtotal = hostItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const initialHost: GroupParticipant = {
      id: hostId,
      name: `${params.hostName} (Host)`,
      phone: params.hostPhone,
      items: hostItems,
      subtotal: hostSubtotal,
      deliveryShare: rules.baseDeliveryFee,
      totalAmount: hostSubtotal + rules.baseDeliveryFee,
      isPaid: false,
      isHost: true,
      joinedAt: new Date().toISOString(),
    }

    const newGroup: GroupOrder = {
      id,
      groupCode: randomCode,
      title: params.title || `${params.hostelAddress} Group Order`,
      type: 'group',
      hostId,
      hostName: params.hostName,
      hostPhone: params.hostPhone,
      hostelAddress: params.hostelAddress,
      deliveryNote: params.deliveryNote || '',
      deadline: new Date(Date.now() + params.deadlineMinutes * 60 * 1000).toISOString(),
      status: 'created',
      isLocked: false,
      participants: [initialHost],
      baseDeliveryFee: rules.baseDeliveryFee,
      discountPercent: 0,
      finalDeliveryFee: rules.baseDeliveryFee,
      foodTotal: hostSubtotal,
      grandTotal: hostSubtotal + rules.baseDeliveryFee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const calculated = recomputeGroupTotals(newGroup, rules)
    localStorage.setItem(STORAGE_KEYS.GROUP_ORDERS, JSON.stringify([calculated, ...groups]))
    dispatchStoreEvent()
    return calculated
  },

  joinGroupOrder(
    groupCode: string,
    participantData: {
      name: string
      phone: string
      roomOrHostel?: string
      items?: StudentOrderItem[]
    }
  ): GroupOrder | null {
    const groups = this.getGroupOrders()
    const rules = this.getRules()
    const index = groups.findIndex(
      (g) => g.groupCode.toUpperCase() === groupCode.toUpperCase() || g.id === groupCode
    )
    if (index === -1) return null
    const group = groups[index]
    if (group.isLocked || new Date(group.deadline).getTime() < Date.now()) {
      throw new Error('This group order has already closed.')
    }
    const participantId = generateId('usr-')
    const items = participantData.items || []
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newParticipant: GroupParticipant = {
      id: participantId,
      name: participantData.name,
      phone: participantData.phone,
      roomOrHostel: participantData.roomOrHostel,
      items,
      subtotal,
      deliveryShare: 0,
      totalAmount: subtotal,
      isPaid: false,
      isHost: false,
      joinedAt: new Date().toISOString(),
    }
    const updatedGroup = { ...group, participants: [...group.participants, newParticipant] }
    const recalculated = recomputeGroupTotals(updatedGroup, rules)
    groups[index] = recalculated
    localStorage.setItem(STORAGE_KEYS.GROUP_ORDERS, JSON.stringify(groups))
    dispatchStoreEvent()
    return recalculated
  },

  updateParticipantItems(
    groupCode: string,
    participantId: string,
    items: StudentOrderItem[]
  ): GroupOrder | null {
    const groups = this.getGroupOrders()
    const rules = this.getRules()
    const index = groups.findIndex(
      (g) => g.groupCode.toUpperCase() === groupCode.toUpperCase() || g.id === groupCode
    )
    if (index === -1) return null
    const group = groups[index]
    const updatedParticipants = group.participants.map((p) =>
      p.id === participantId ? { ...p, items } : p
    )
    const recalculated = recomputeGroupTotals({ ...group, participants: updatedParticipants }, rules)
    groups[index] = recalculated
    localStorage.setItem(STORAGE_KEYS.GROUP_ORDERS, JSON.stringify(groups))
    dispatchStoreEvent()
    return recalculated
  },

  payParticipantShare(groupCode: string, participantId: string): GroupOrder | null {
    const groups = this.getGroupOrders()
    const index = groups.findIndex(
      (g) => g.groupCode.toUpperCase() === groupCode.toUpperCase() || g.id === groupCode
    )
    if (index === -1) return null
    const group = groups[index]
    const updatedParticipants = group.participants.map((p) =>
      p.id === participantId ? { ...p, isPaid: true, paidAt: new Date().toISOString() } : p
    )
    const allPaid =
      updatedParticipants.length > 0 && updatedParticipants.every((p) => p.isPaid)
    const updatedGroup: GroupOrder = {
      ...group,
      participants: updatedParticipants,
      status: allPaid && group.status === 'created' ? 'payment_confirmed' : group.status,
      updatedAt: new Date().toISOString(),
    }
    groups[index] = updatedGroup
    localStorage.setItem(STORAGE_KEYS.GROUP_ORDERS, JSON.stringify(groups))
    dispatchStoreEvent()
    return updatedGroup
  },

  lockAndSubmitGroupOrder(groupCode: string): GroupOrder | null {
    const groups = this.getGroupOrders()
    const index = groups.findIndex(
      (g) => g.groupCode.toUpperCase() === groupCode.toUpperCase() || g.id === groupCode
    )
    if (index === -1) return null
    const updatedGroup: GroupOrder = {
      ...groups[index],
      isLocked: true,
      status: 'sent_to_sellers',
      updatedAt: new Date().toISOString(),
    }
    groups[index] = updatedGroup
    localStorage.setItem(STORAGE_KEYS.GROUP_ORDERS, JSON.stringify(groups))
    dispatchStoreEvent()
    return updatedGroup
  },

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    assignedRider?: { name: string; phone: string; vehicle: string }
  ) {
    const singleOrders = this.getSingleOrders()
    const sIdx = singleOrders.findIndex((s) => s.id === orderId)
    if (sIdx !== -1) {
      singleOrders[sIdx] = {
        ...singleOrders[sIdx],
        status,
        ...(assignedRider ? { assignedRider } : {}),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEYS.SINGLE_ORDERS, JSON.stringify(singleOrders))
      dispatchStoreEvent()
      return
    }
    const groupOrders = this.getGroupOrders()
    const gIdx = groupOrders.findIndex((g) => g.id === orderId || g.groupCode === orderId)
    if (gIdx !== -1) {
      groupOrders[gIdx] = {
        ...groupOrders[gIdx],
        status,
        ...(assignedRider ? { assignedRider } : {}),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEYS.GROUP_ORDERS, JSON.stringify(groupOrders))
      dispatchStoreEvent()
    }
  },

  getUserProfile(): { name: string; phone: string } {
    if (typeof window === 'undefined') return { name: '', phone: '' }
    return {
      name: localStorage.getItem(STORAGE_KEYS.CURRENT_USER_NAME) || 'Student User',
      phone: localStorage.getItem(STORAGE_KEYS.CURRENT_USER_PHONE) || '08123456789',
    }
  },

  saveUserProfile(name: string, phone: string) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_NAME, name)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_PHONE, phone)
  },
}
