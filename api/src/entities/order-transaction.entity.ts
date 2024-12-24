import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ClientOrder } from "./client-order.entity";

@Index("order_tran_pk", ["id"], { unique: true })
@Entity("order_transactions")
export class OrderTransaction {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "order_id"})
  orderId: number;

  @Column("character varying", { name: "security_id", length: 255 })
  securityId: string;
  @Column("character varying", { name: "symbol", length: 255 })
  symbol: string;
  @Column("character varying", { name: "trans_type", length: 255 })
  transType: string;
  @Column("double precision", { name: "qty", precision: 53 })
  qty: number;
  @Column("double precision", { name: "price", precision: 53 })
  price: number;
  
  @Column("character varying", { name: "broker_order_id"})
  brokerOrderId: string;
  @Column("character varying", { name: "correlation_id" })
  correlationId: string;
  @Column("character varying", { name: "status" })
  status: string;
  @Column("date", { name: "created_on"})
  createdOn: string | null;
  @Column("date", { name: "updated_on"})
  updateddOn: string | null;

  @ManyToOne(
      () => ClientOrder,
      (order) => order.transactions
  )
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: ClientOrder;

}
