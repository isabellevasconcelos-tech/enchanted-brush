import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

const ACRESCIMO_BABYLOOK = 20

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('enchanted-cart')
      if (!saved) return []
      // Normalize old items that may lack modelagem
      return JSON.parse(saved).map((item) => ({
        ...item,
        modelagem: item.modelagem || 'slim',
      }))
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('enchanted-cart', JSON.stringify(items))
  }, [items])

  function getPrecoItem(item) {
    const base = Number(item.camisa.preco)
    return item.modelagem === 'babylook' ? base + ACRESCIMO_BABYLOOK : base
  }

  function addToCart(camisa, tamanho, quantidade = 1, modelagem = 'slim') {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.camisa.id === camisa.id && item.tamanho === tamanho && item.modelagem === modelagem
      )
      if (existing) {
        return prev.map((item) =>
          item.camisa.id === camisa.id && item.tamanho === tamanho && item.modelagem === modelagem
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      }
      return [...prev, { camisa, tamanho, quantidade, modelagem }]
    })
  }

  function removeFromCart(camisaId, tamanho, modelagem = 'slim') {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.camisa.id === camisaId && item.tamanho === tamanho && (item.modelagem || 'slim') === modelagem)
      )
    )
  }

  function updateQuantity(camisaId, tamanho, modelagem = 'slim', quantidade) {
    if (quantidade < 1) return
    setItems((prev) =>
      prev.map((item) =>
        item.camisa.id === camisaId && item.tamanho === tamanho && (item.modelagem || 'slim') === modelagem
          ? { ...item, quantidade }
          : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + getPrecoItem(item) * item.quantidade,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getPrecoItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
