import { Schema } from "microdocs-core-ts/dist/domain";
export declare class ModelPanel {
    schema: Schema;
    example: {};
    ngOnInit(): void;
    getSubTitle(schema: Schema): string;
}
