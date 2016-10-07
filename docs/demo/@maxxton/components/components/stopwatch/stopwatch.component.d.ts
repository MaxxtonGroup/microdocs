import { OnInit } from "@angular/core";
export declare class StopwatchComponent implements OnInit {
    startTime: Date;
    autoStart: boolean;
    private runTime;
    private stopwatchInterval;
    private stopwatchSubscription;
    constructor();
    ngOnInit(): void;
    start(): void;
    stop(): void;
    pause(): void;
    getCurrentRunDuration(): string;
}
