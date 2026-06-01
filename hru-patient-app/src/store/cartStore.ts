import {create} from 'zustand';

interface CartState {
    cartItemNumber: number;
    saveForLaterCount: number;
    setCartItemNumber: (number: number) => void;
    setSaveForLaterCount: (number: number) => void;
}

export const useCartStore = create<CartState>(set => ({
    cartItemNumber: 0,
    saveForLaterCount: 0,
    setCartItemNumber: number => set({cartItemNumber: number}),
    setSaveForLaterCount: number => set({saveForLaterCount: number}),
}));
