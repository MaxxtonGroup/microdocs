import { OnInit, ChangeDetectorRef, EventEmitter } from "@angular/core";
import { ModalService } from "../../services/modal.service";
export declare class ModalComponent implements OnInit {
    private cd;
    id: string;
    private _active;
    private animateIn;
    private modalService;
    private _overlayClass;
    private _modalClass;
    title: string;
    size: string;
    showModal: boolean;
    stateChanges: EventEmitter<{}>;
    constructor(modalService: ModalService, cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private generateUUID();
    hide(): void;
    show(): void;
    private setCssClasses();
    private setOverlayClass();
    private setModalClass();
    overlayClass: Object;
    modalClass: Object;
    active: boolean;
}
