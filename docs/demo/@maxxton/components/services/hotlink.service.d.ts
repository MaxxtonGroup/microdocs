import { CardComponent } from "../components/card/card.component";
export declare class HotlinkService {
    private _hotlinks;
    hotLinkAdded: CustomEvent;
    constructor();
    hotlinks: any;
    setHotlinkFromCard(card: CardComponent): void;
    removeHotlink(id: string): void;
}
export declare class HotLinkModel {
    id: string;
    title: string;
    subTitle: string;
    cardObject: CardComponent;
    private _active;
    constructor(card: CardComponent);
    active: boolean;
    offSetTop: number;
    card: HTMLElement;
}
