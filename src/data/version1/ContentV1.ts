import { DocumentV1 } from "./DocumentV1";

export class ContentV1 {
    public type: string;

    public text?: string;
    public loc_name?: string;
    public loc_pos?: any; // GeoJson
    public start?: Date;
    public end?: Date;
    public all_day?: boolean;
    public pic_ids?: string[];
    public video_url?: string;
    public docs?: DocumentV1[];
    public custom?: any;
}