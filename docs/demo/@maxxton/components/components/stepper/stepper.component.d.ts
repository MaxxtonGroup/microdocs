/**
 * Created by Reinartz.T on 7-7-2016.
 */
import { QueryList, EventEmitter } from "@angular/core";
import { StepComponent } from "./step/step.component";
import { EaseAnimationUtil } from "../../helpers/ease-animation.util";
export declare class StepperComponent {
    private stepComponents;
    private animate;
    secondary: string;
    vertical: string;
    steps: StepComponent[];
    private activeStep;
    loaderValue: number;
    loading: boolean;
    completeLabel: string;
    completeChange: EventEmitter<boolean>;
    constructor(stepComponents: QueryList<StepComponent>, animate: EaseAnimationUtil);
    ngOnInit(): void;
    selectStep(step: StepComponent): void;
    gotoNextStep(): void;
    gotoPrevStep(): void;
    canActivate(index: number): boolean;
    private startLoader();
    complete(): void;
    handleKeyPress(keyboardEvent: KeyboardEvent): void;
}
export declare const STEPPER_DIRECTIVES: any[];
