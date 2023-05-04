export class Product {
    id!:number;
    code!:number;
    name!:string;
    description?:string;
    price:number=0;
    quantity?:number;
    inventorystatus?:string;
    category?:string;
    url_image_prod!:string;
    rating?:number;
    previews:any
}