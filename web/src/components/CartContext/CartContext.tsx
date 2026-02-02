// src/contexts/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

interface Product {
  id: number
  name: string
  category: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
}

interface CartContextType {
  cart: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
  totalPrice: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Product[]>([])

  const addToCart = (product: Product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)
  const itemCount = cart.length

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
