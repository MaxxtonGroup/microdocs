import { AfterContentInit } from "@angular/core";
import { EaseAnimationUtil } from "../../helpers/ease-animation.util";
import { HotLinkModel, HotlinkService } from "../../services/hotlink.service";
export declare class HotLinksComponent implements AfterContentInit {
    private hotlinkService;
    title: string;
    private container;
    private hotLinks;
    private animation;
    constructor(animation: EaseAnimationUtil, hotlinkService: HotlinkService);
    ngAfterContentInit(): void;
    gotoMain(): void;
    getBaseRoute(): void;
    private setHotlinks(hotLinks);
    getVisibleHotlinks(): HotLinkModel[];
    scrollToCard(hotlink: HotLinkModel): void;
    setActiveHotlink(): void;
}
