import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.ormRepository.find();
    return products;
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findProducts = await this.ormRepository.find({
      where: { id: In(products.map(product => product.id)) },
    });
    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsIds = products.map(product => {
      return { id: product.id };
    });

    const findProducts = await this.ormRepository.find({
      where: { id: In(productsIds) },
    });

    const updatedProducts = findProducts.map(productdb => {
      const product = products.find(inProduct => inProduct.id === productdb.id);

      const updatedProduct = {
        ...productdb,
        quantity: productdb.quantity - (product?.quantity || 0),
      };
      this.ormRepository.save(updatedProduct);
      return updatedProduct;
    });

    return updatedProducts;
  }
}

export default ProductsRepository;
