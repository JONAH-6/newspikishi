// web/src/pages/FavoritesPage/FavoritesPage.tsx
import { useState } from 'react'

import { Heart, Plus, Check, ArrowRight, Trash2 } from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useCart } from 'src/contexts/CartContext'

interface FavoriteItem {
  id: number
  name: string
  price: number
  image: string
  category: string
  calories: string
  description: string
}

const initialFavorites: FavoriteItem[] = [
  {
    id: 1,
    name: 'Ultimate Meat Pie',
    price: 700,
    image:
      'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    category: 'Savory Snacks',
    calories: '420 Cal',
    description:
      'Crispy flaky crust with seasoned minced beef, potatoes and carrots.',
  },
  {
    id: 6,
    name: 'Chicken Sandwich',
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    category: 'Pastries',
    calories: '520 Cal',
    description:
      'Grilled chicken breast with fresh lettuce, tomatoes and special YumZee sauce.',
  },
  {
    id: 10,
    name: 'Pepperoni Pizza Slice',
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'Fast Food',
    calories: '580 Cal',
    description:
      'Generous pepperoni slices with melted mozzarella cheese on fresh dough.',
  },
  {
    id: 13,
    name: 'Chocolate Cake Slice',
    price: 1000,
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    category: 'Cakes & Treats',
    calories: '480 Cal',
    description:
      'Decadent moist chocolate sponge cake layered with rich fudge icing.',
  },
]

const FavoritesPage = () => {
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites)
  const [addedIds, setAddedIds] = useState<number[]>([])

  const handleAddToCart = (item: FavoriteItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    })

    setAddedIds((prev) => [...prev, item.id])
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== item.id))
    }, 1500)
  }

  const handleRemove = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#FBF9FE] py-6">
      <Metadata title="Favorites — YumZee" description="Your saved items" />

      <div className="container mx-auto max-w-5xl space-y-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-pink-600 text-pink-600" />
              <h1 className="text-xl font-black text-[#211F26]">Favorites</h1>
            </div>
            <p className="mt-1 text-xs text-[#6F6B76]">Your saved snacks.</p>
          </div>

          <Link
            to={routes.home()}
            className="flex items-center gap-1 text-xs font-bold text-[#4B2E83] transition hover:text-[#FFC928]"
          >
            Explore Menu <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* List */}
        {favorites.length === 0 ? (
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 text-center shadow-sm">
            <Heart className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <h3 className="text-sm font-bold text-[#211F26]">No favorites yet</h3>
            <p className="mx-auto mb-4 mt-1 max-w-sm text-xs text-[#6F6B76]">Browse and save snacks to see them here.</p>
            <Link to={routes.home()} className="inline-flex items-center gap-2 rounded-xl bg-[#FFC928] px-6 py-3 text-sm font-bold text-[#4B2E83]">Browse Menu <ArrowRight className="h-4 w-4" /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {favorites.map((item) => {
              const isAdded = addedIds.includes(item.id)
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E9E5EE] bg-white p-4 shadow-sm sm:flex-row"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-full rounded-2xl border border-[#E9E5EE] object-cover sm:w-28"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6F6B76]">
                          {item.category}
                        </span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1 text-gray-400 transition hover:text-red-500"
                          title="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <h3 className="mt-0.5 text-base font-bold text-[#211F26]">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-[#6F6B76]">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#E9E5EE] pt-3">
                      <span className="text-base font-extrabold text-[#4B2E83]">
                        ₦{item.price.toLocaleString()}
                      </span>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#FFC928] text-[#4B2E83] shadow-sm hover:bg-[#E5B420]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>In Bag!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
