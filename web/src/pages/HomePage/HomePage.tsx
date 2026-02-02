// src/pages/HomePage/HomePage.tsx
import { useState } from 'react'
import {
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Package,
  ChevronLeft,
  ChevronRight,
  Heart,
  TrendingDown,
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react'

import { useCart } from '../../contexts/CartContext'

// Define Product Interface
interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  tags: string[]
  isNewArrival?: boolean
}

// Categories with their definitions
const categories = [
  {
    id: 'all',
    name: 'All Products',
    icon: Package,
    filter: (products: Product[]) => products,
  },
  {
    id: 'bestsellers',
    name: 'Best Sellers',
    icon: Award,
    filter: (products: Product[]) =>
      products.filter((p) => p.tags.includes('bestseller')),
  },
  {
    id: 'lowerprice',
    name: 'Lower Price',
    icon: TrendingDown,
    filter: (products: Product[]) => products.filter((p) => p.price < 5000),
  },
  {
    id: 'highprice',
    name: 'High Price',
    icon: TrendingUp,
    filter: (products: Product[]) => products.filter((p) => p.price >= 5000),
  },
  {
    id: 'newarrivals',
    name: 'New Arrivals',
    icon: Clock,
    filter: (products: Product[]) =>
      products.filter((p) => p.tags.includes('newarrival')),
  },
]

// ============================================================
// INSTRUCTIONS: HOW TO ADD MORE PRODUCTS IN THE CODE
// ============================================================
//
// TO ADD A NEW PRODUCT:
// 1. Copy one of the product objects below
// 2. Paste it inside the `initialKilishiProducts` array
// 3. Update the values:
//    - Change the `id` (use the next number)
//    - Change `name` to your product name
//    - Change `description`
//    - Change `price` (in Naira, no commas)
//    - Change `originalPrice` if there's a discount (optional)
//    - Update `tags` array with relevant categories
//    - Set `isNewArrival: true` if it's a new product
//
// CATEGORY TAGS YOU CAN USE:
// - 'bestseller'   → Will appear in "Best Sellers"
// - 'lowerprice'   → For products under ₦5,000
// - 'highprice'    → For products ₦5,000 and above
// - 'newarrival'   → Will appear in "New Arrivals"
//
// EXAMPLE NEW PRODUCT:
// {
//   id: 8,  // ← Always use the next available number
//   name: 'Special Edition Kilishi',
//   description: 'Limited edition with exclusive spices',
//   price: 7500,
//   originalPrice: 8900,
//   image: '/images/kilishi-8.jpg',
//   tags: ['highprice', 'newarrival'],  // ← Choose your tags
//   isNewArrival: true,
// }
// ============================================================

// Initial Products Data - EDIT THIS ARRAY TO ADD MORE PRODUCTS
const initialKilishiProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Original Kilishi',
    description: 'Traditional Hausa spiced dried beef with authentic spices',
    price: 4990,
    originalPrice: 5990,
    image: '/images/kilishi-1.jpg',
    tags: ['bestseller', 'lowerprice', 'newarrival'],
    isNewArrival: true,
  },
  {
    id: 2,
    name: 'Extra Spicy Kilishi',
    description: 'For those who love intense heat with traditional flavor',
    price: 5290,
    originalPrice: 6490,
    image: '/images/kilishi-2.jpg',
    tags: ['bestseller', 'highprice'],
    isNewArrival: false,
  },
  {
    id: 3,
    name: 'Mild Kilishi Deluxe',
    description: 'Less spicy, perfect for all ages and sensitive palates',
    price: 4790,
    image: '/images/kilishi-3.jpg',
    tags: ['lowerprice'],
    isNewArrival: true,
  },
  {
    id: 4,
    name: 'Kilishi Ultimate Combo',
    description: 'Complete collection of all three premium varieties',
    price: 12900,
    originalPrice: 15900,
    image: '/images/kilishi-4.jpg',
    tags: ['highprice', 'newarrival'],
    isNewArrival: true,
  },
  {
    id: 5,
    name: 'Premium Gift Box Kilishi',
    description: 'Elegantly packaged perfect for gifts and corporate presents',
    price: 14990,
    originalPrice: 17990,
    image: '/images/kilishi-5.jpg',
    tags: ['highprice'],
    isNewArrival: false,
  },
  {
    id: 6,
    name: 'Family Pack Kilishi',
    description: 'Large pack perfect for gatherings and special occasions',
    price: 8990,
    originalPrice: 10990,
    image: '/images/kilishi-6.jpg',
    tags: ['highprice'],
    isNewArrival: false,
  },
  // ============================================================
  // ADD YOUR NEW PRODUCTS BELOW THIS LINE
  // ============================================================

  // Example: To add a new product, copy this block and modify:
  // {
  //   id: 7,  // Make sure this ID is unique
  //   name: 'Your Product Name',
  //   description: 'Your product description',
  //   price: 4500,
  //   originalPrice: 5500,  // Optional: remove if no discount
  //   image: '/images/kilishi-7.jpg',  // Change the number
  //   tags: ['lowerprice', 'bestseller'],  // Choose appropriate tags
  //   isNewArrival: true,  // Set to false if not new
  // },

  // ============================================================
  // END OF PRODUCT LIST - ADD MORE ABOVE THIS COMMENT
  // ============================================================
]

const HomePage = () => {
  // State Management
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [kilishiProducts] = useState<Product[]>(initialKilishiProducts)

  // Calculate category counts
  const getCategoryCount = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return 0

    return category.filter(kilishiProducts).length
  }

  // Filter products based on active category
  const getFilteredProducts = () => {
    const category = categories.find((c) => c.id === activeCategory)
    if (!category) return kilishiProducts

    return category.filter(kilishiProducts)
  }

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.icon || Package
  }

  // Wishlist Functions
  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll')
    if (!container) return

    const scrollAmount = 200
    const currentScroll = container.scrollLeft
    const newScroll =
      direction === 'left'
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount

    container.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    })
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Sort products by price (low to high) for display
  const displayedProducts = getFilteredProducts()

  return (
    <>
      {/* Hero Section */}
<section
  className="relative pt-24 pb-32 bg-center bg-cover"
  style={{ backgroundImage: "url('/backgroud.png')" }}
>
  {/* Dark sweet overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative text-center max-w-3xl mx-auto text-white px-4">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
      Authentic Nigerian Kilishi
    </h1>

    <p className="text-xl opacity-95 mb-8 drop-shadow">
      Premium spiced dried beef, crafted with traditional Hausa recipes.
      Perfect for snacks, gifts, and special occasions.
    </p>

    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={() => scrollToSection("products")}
        className="bg-[#FFD700] text-[#8B0000] px-8 py-3 rounded-full font-bold text-lg
                   hover:bg-[#FFC107] transition hover:scale-105 shadow-lg"
      >
        Shop Now
      </button>
    </div>
  </div>
</section>

      {/* Categories Section */}
      <section className="mb-12 relative px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => scrollCategories('left')}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Category Pills */}
        <div className="hidden md:flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.id)
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  scrollToSection('products')
                }}
                className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-[#FFD700] text-[#8B0000] font-bold shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.name}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {getCategoryCount(category.id)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Mobile/Tablet Horizontal Scroll */}
        <div className="md:hidden relative">
          <div
            id="category-scroll"
            className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.id)
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    scrollToSection('products')
                  }}
                  className={`flex-shrink-0 px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-[#FFD700] text-[#8B0000] font-bold shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {getCategoryCount(category.id)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="mb-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {activeCategory === 'all'
                ? 'Our Kilishi Collection'
                : categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <p className="text-white opacity-90 mt-2">
              Showing {displayedProducts.length} products
              {activeCategory === 'lowerprice' && ' (₦0 - ₦5,000)'}
              {activeCategory === 'highprice' && ' (₦5,000 and above)'}
              {activeCategory === 'newarrivals' && ' (Recently Added)'}
            </p>
          </div>


        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-12 bg-white/10 rounded-xl">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-bold text-white mb-2">
              No products found
            </h3>
            <p className="text-white/70">
              No products available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 group hover:shadow-xl hover:scale-[1.02]"
              >
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-b from-white/20 to-transparent flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-white">
                    <Package className="w-16 h-16 mx-auto mb-2 opacity-70 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm">Product Image</span>
                  </div>

                  {/* Wishlist Button Only */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition backdrop-blur-sm"
                    title="Add to wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-400 text-red-400' : 'text-white'}`}
                    />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {product.description}
                  </p>

                  {/* Price Section */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-white/70 line-through mt-1">
                          ₦{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[#FFD700] text-[#8B0000] px-5 py-3 rounded-lg font-bold hover:bg-[#FFC107] transition flex items-center gap-2 hover:scale-105"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: Truck,
              title: 'Free Delivery',
              desc: 'Free delivery on orders above ₦10,000',
            },
            {
              icon: Shield,
              title: '100% Natural',
              desc: 'No preservatives or artificial additives',
            },
            {
              icon: RefreshCw,
              title: 'Easy Returns',
              desc: 'Not satisfied? Return within 3 days',
            },
            {
              icon: Package,
              title: 'Gift Packaging',
              desc: 'Premium packaging for special gifts',
            },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-white opacity-90">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}

export default HomePage