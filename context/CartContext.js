import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const carregarCarrinho = async () => {
      try {
        const carrinhoSalvo = await AsyncStorage.getItem('@carrinho_loja');
        if (carrinhoSalvo !== null) {
          setCartItems(JSON.parse(carrinhoSalvo));
        }
      } catch (error) {
        console.error("Erro ao puxar carrinho da memória:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    carregarCarrinho();
  }, []);

  useEffect(() => {
    const salvarCarrinho = async () => {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('@carrinho_loja', JSON.stringify(cartItems));
        } catch (error) {
          console.error("Erro ao salvar carrinho na memória:", error);
        }
      }
    };
    salvarCarrinho();
  }, [cartItems, isLoaded]);

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

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.valor * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};