export declare class MenuItemModel {
    title: string;
    action: string;
    icon: string;
    inMenu: boolean;
    parent: string;
    childrenVisible: boolean;
    active: boolean;
    id: string;
    constructor(title: string, action: string, icon?: string, inMenu?: boolean, parent?: string);
    setActive(): void;
    setInactive(): void;
    toggleActive(): void;
    showChildren(): void;
    hideChildren(): void;
    toggleChildren(): void;
}
