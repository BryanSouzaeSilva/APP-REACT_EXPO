import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CartScreen from '../screen/CartScreen';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';

// Mocking dependencies
const mockDismiss = jest.fn();
jest.mock('@gorhom/bottom-sheet', () => {
    const RN = require('react-native');
    const React = require('react');
    const BottomSheetModal = React.forwardRef(({ children }, ref) => {
        const [isVisible, setIsVisible] = React.useState(false);

        React.useImperativeHandle(ref, () => ({
            present: () => setIsVisible(true),
            dismiss: mockDismiss,
        }));

        if (!isVisible) return null;

        return <RN.View>{children}</RN.View>;
    });
    BottomSheetModal.displayName = 'BottomSheetModal';

    return {
        BottomSheetModal,
        BottomSheetModalProvider: ({ children }) => <RN.View>{children}</RN.View>,
    };
});

const mockNavigation = {
    navigate: jest.fn(),
};

const mockCartContext = {
    cartItems: [{ id: '1', nome: 'Test Item', quantity: 1, valor: 10 }],
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    getTotalPrice: () => 10,
};

const mockThemeContext = {
    theme: 'light',
    handleAddOrder: jest.fn(),
    showNotification: jest.fn(),
};

const renderCartScreen = () => {
    return render(
        <ThemeContext.Provider value={mockThemeContext}>
            <CartContext.Provider value={mockCartContext}>
                <CartScreen navigation={mockNavigation} />
            </CartContext.Provider>
        </ThemeContext.Provider>
    );
};

describe('CartScreen', () => {
    it('should dismiss the bottom sheet when the confirm button is pressed', () => {
        const { getByText } = renderCartScreen();

        fireEvent.press(getByText('Finalizar Compra'));

        const orderSummary = getByText('Resumo da Compra');
        expect(orderSummary).toBeTruthy();

        fireEvent.press(getByText('Confirmar Compra'));

        expect(mockDismiss).toHaveBeenCalled();
    });
});
