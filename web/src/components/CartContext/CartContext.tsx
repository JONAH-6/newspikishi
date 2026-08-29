// web/src/components/CartContext/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, INITIAL_PRODUCTS, OrderStore } from 'src/lib/orderStore'

export interface CartItem {
  id: number
  name: string
  category: string
  description?: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  hiddenAlphabet?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: { id: number; name: string; price: number; image?: string; category?: string; description?: string }, quantity?: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  itemCount: number
  deliveryType: 'delivery' | 'pickup'
  setDeliveryType: (type: 'delivery' | 'pickup') => void
  selectedHostel: string
  setSelectedHostel: (hostel: string) => void
  activeGroupCode: string | null
  setActiveGroupCode: (code: string | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

const CART_STORAGE_KEY = 'yumzee_student_cart'

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [selectedHostel, setSelectedHostel] = useState<string>('Moremi Hall — Main Gate')
  const [activeGroupCode, setActiveGroupCode] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to persist cart to localStorage', e)
    }
  }, [cart])

  const addToCart = (
    product: { id: number; name: string; price: number; image?: string; category?: string; description?: string; hiddenAlphabet?: string },
    quantity = 1
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      } else {
        const fullProd = INITIAL_PRODUCTS.find((p) => p.id === product.id)
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category || fullProd?.category || 'Snack',
            description: product.description || fullProd?.description || '',
            price: product.price,
            originalPrice: fullProd?.originalPrice,
            image: product.image || fullProd?.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop',
            quantity: Math.max(1, quantity),
            hiddenAlphabet: (product as any).hiddenAlphabet || fullProd?.hiddenAlphabet || String.fromCharCode(65 + (product.id % 26)),
          },
        ]
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        itemCount,
        deliveryType,
        setDeliveryType,
        selectedHostel,
        setSelectedHostel,
        activeGroupCode,
        setActiveGroupCode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
