import data from '../data/media.json';
export interface MediaRecord {id:string;project:string;title:string;description:string;duration:string;kind:string;status:string;src:string;poster:string;width:number;height:number;mobileSrc?:string;webm?:string;variants?:{src:string;width:number;format:string}[];transcript?:string;audioRequired?:boolean;}
export const media=data as MediaRecord[];
