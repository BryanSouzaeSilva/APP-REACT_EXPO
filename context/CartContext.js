import React, { createContext, useState, useEffect } from 'react';
import { 
  getCarrinho, 
  addItemCarrinho, 
  removeItemCarrinho, 
  clearCarrinhoDB 
} from '../banco_de_dados/database/service';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const itensDoBanco = await getCarrinho();
        
        const itensFormatados = itensDoBanco.map(item => ({
            ...item,
            id: item.produtoId,
            dbId: item.id
        }));

        setCartItems(itensFormatados);
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  const addToCart = (product, qtdParaAdicionar = 1) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      
      if (itemInCart) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qtdParaAdicionar } : item
        );
      }
      
      return [...prevItems, { ...product, quantity: qtdParaAdicionar }];
    });
  };

  const removeFromCart = async (productId) => {
    try {
        await removeItemCarrinho(productId);
        
        const itensAtualizados = await getCarrinho();
        setCartItems(itensAtualizados.map(item => ({
            ...item, 
            id: item.produtoId 
        })));
    } catch (error) {
        console.error("Erro ao remover do carrinho:", error);
    }
  };

  const clearCart = async () => {
    try {
        await clearCarrinhoDB();
        setCartItems([]);
    } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.valor * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};