import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import OrderProduct from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import ColumnNumericTransformer from '@shared/infra/typeorm/utils/ColumnNumericTransformer';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column()
  quantity: number;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
  order_products: OrderProduct[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
