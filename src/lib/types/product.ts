import {
  ProductType,
  ProductStatus,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productType: ProductType;
  productName: string;
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
