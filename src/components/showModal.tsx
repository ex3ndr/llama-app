import * as React from 'react';

export type ModalController = {
    show(node: React.ReactNode): void;
}

let controller: ModalController | null = null;

export function registerModalController(c: ModalController) {
    controller = c;
}

export const ModalContext = React.createContext<{ close: () => void }>({ close: () => { } });

export function useModal() {
    return React.useContext(ModalContext);
}

export function showModal(node: React.ReactNode) {
    controller!.show(node);
}