import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ProductsService {
    private products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

    private async findProduct(productId: string): Promise<Product> {
        const product = await this.productModel.findById(productId);
        if(!product) {
            throw new NotFoundException('Product not found!');
        }
        return product;
    }
    async insertProduct(title: string, description: string, price: number) {
        const newProduct = new this.productModel({
            title,
            description,
            price
        }
        );

        const result = await newProduct.save();
        return result.id as string;
    }

    async getProducts() {
        const products = await this.productModel.find();
        return products;
    }

    async getSingleProduct(productId: string) {
        const product = await this.productModel.findById(productId);
        return product;
    }

    async updateProduct(productId: string, title: string, description: string, price: number): Promise<Product> {
        const updatedProduct = await this.findProduct(productId);

        if (title) {
            updatedProduct.title = title;
        }
        if (description) {
            updatedProduct.description = description;
        }
        if (price) {
            updatedProduct.price = price;
        }

        const result = await updatedProduct.save();
        return result;
    }

    async deleteProduct(productId: string) {
        const result = await this.productModel.findOneAndDelete({_id: productId});
        return result;
    }
}