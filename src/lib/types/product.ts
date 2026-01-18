import {
  ProductType,
  ProductStatus,
  ProductLanguage,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productType: ProductType;
  productName: string;
  productAuthor?: string | null;
  productPublisher?: string | null;
  productPublicationDate?: string | null;
  productLanguage?: ProductLanguage | null;
  productPageCount?: number | null;
  productPrice: number;
  productLeftCount: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productType?: ProductType;
  search?: string;
}
