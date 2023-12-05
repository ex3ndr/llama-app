import * as React from 'react';

export type ModalController = {
    hide(id: number): void;
    show(element: React.ReactElement): number;
}