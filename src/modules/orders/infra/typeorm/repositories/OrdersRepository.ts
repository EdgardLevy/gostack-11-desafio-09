import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrderProduct from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  private orderProductsRepository: Repository<OrderProduct>;

  constructor() {
    this.ormRepository = getRepository(Order);
    this.orderProductsRepository = getRepository(OrderProduct);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: [],
    });
    await this.ormRepository.save(order);

    for (let index = 0; index < products.length; index += 1) {
      const product = products[index];
      const order_product = this.orderProductsRepository.create({
        order_id: order.id,
        product_id: product.product_id,
        price: product.price * product.quantity,
        quantity: product.quantity,
      });
      order.order_products.push(order_product);
    }
    await this.orderProductsRepository.save(order.order_products);
    await this.ormRepository.save(order);
    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne({
      where: { id },
      relations: ['order_products', 'customer'],
    });
    return order;
  }
}

export default OrdersRepository;
