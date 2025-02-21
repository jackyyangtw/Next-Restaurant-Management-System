import type { Category } from "./category";
interface DescriptionText {
    type: "text";
    text: string;
}
interface DescriptionBlock {
    type: "paragraph";
    children: DescriptionText[];
}
export interface Restaurant {
    id: number | null;
    Name: string;
    Description: DescriptionBlock[];
    categories: Category[];
    documentId: string;
}
