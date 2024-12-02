import { UploadFile } from './file.model';
import { Variant } from './variant.model';

export type Product = {
  id: string;
  name: string;
  brand?: number;
  description: string;
  weight: number;
  dateStock: string;
  price: number;
  type?: number;
  images: UploadFile[];
  variants: Variant[];
  visible: boolean;
};
