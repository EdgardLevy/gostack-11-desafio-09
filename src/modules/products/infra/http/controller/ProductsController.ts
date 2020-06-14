import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import ListProductsService from '@modules/products/services/ListProductsService';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProducts = new ListProductsService(
      container.resolve('ProductsRepository'),
    );
    const products = await listProducts.execute();
    return response.json(products);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const createProduct = new CreateProductService(
      container.resolve('ProductsRepository'),
    );
    const product = await createProduct.execute({ name, price, quantity });
    return response.json(product);
  }
}
