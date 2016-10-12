import { EventEmitter } from "@angular/core";
import { SearchbarInputModel } from "./searchbar-input.model";
export declare class SearchbarComponent {
    value: string;
    debounceDelay: number;
    placeHolder: string;
    search: EventEmitter<{}>;
    debouncedSearch: EventEmitter<{}>;
    hideCancelButton: boolean;
    placeholder: string;
    isFocused: boolean;
    searchBarInput: SearchbarInputModel;
    shouldLeftAlign: boolean;
    private debounceObserver;
    constructor();
    ngOnInit(): void;
    inputFocused(): void;
    inputBlurred(): void;
    inputChanged(event: {
        target: {
            value: string;
        };
        keyCode: number;
        type: string;
    }): void;
    clearInput(): void;
    cancelSearchbar(): void;
    updateValue(): void;
}
