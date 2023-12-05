import * as React from 'react';
import Modal from 'react-modal';
import { ModalContext, ModalController, registerModalController } from './showModal';
import { randomKey } from '../utils/randomKey';

type ModalItem = {
    key: string,
    node: React.ReactNode,
    state: 'visible' | 'hidden'
}

export const ModalProvider = React.memo((props: { children: React.ReactElement }) => {
    const [modals, setModals] = React.useState<ModalItem[]>([]);
    const close = React.useCallback((id: string) => {
        setModals((e) => e.map((v) => v.key === id ? { ...v, state: 'hidden' } : v));
    }, []);
    const remove = React.useCallback((id: string) => {
        setModals((e) => e.filter((v) => v.key !== id));
    }, []);
    const controller: ModalController = React.useMemo(() => {
        return ({
            show(node) {
                let key = randomKey();
                setModals((e) => [...e, { key, node: node, state: 'visible' }]);
            }
        });
    }, []);
    React.useEffect(() => { registerModalController(controller); }, []);
    return (
        <>
            {props.children}
            {modals.map((modal) => (
                <Modal
                    key={modal.key}
                    isOpen={modal.state == 'visible'}
                    onRequestClose={() => close(modal.key)}
                    onAfterClose={() => remove(modal.key)}
                    className={'modal'}
                    closeTimeoutMS={500}
                    overlayClassName={'modal-backdrop'}
                >
                    <ModalContext.Provider value={{ close: () => close(modal.key) }}>
                        {modal.node}
                    </ModalContext.Provider>
                </Modal>
            ))}
        </>
    )
});