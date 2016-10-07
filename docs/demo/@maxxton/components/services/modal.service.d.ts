import { ModalComponent } from "../components/modal/modal.component";
export declare class ModalService {
    private modal;
    constructor();
    setModal(modal: ModalComponent): void;
    unSetModal(modal: ModalComponent): void;
    getCurrentActiveModal(): any;
}
