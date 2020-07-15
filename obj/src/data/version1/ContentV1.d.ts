import { DocumentV1 } from "./DocumentV1";
export declare class ContentV1 {
    type: string;
    text?: string;
    loc_name?: string;
    loc_pos?: any;
    start?: Date;
    end?: Date;
    all_day?: boolean;
    pic_ids?: string[];
    video_url?: string;
    docs?: DocumentV1[];
    custom?: any;
}
