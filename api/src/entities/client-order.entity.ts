import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ClientAlert } from "./client-alert.entity";
import { OrderTransaction } from "./order-transaction.entity";

@Index("order_pk", ["id"], { unique: true })
@Entity("client_orders")
export class ClientOrder {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "client_alert_id", unique: true })
  clientAlertId: number;

  @Column("character varying", { name: "status" })
  status: string;
  @Column("date", { name: "created_on"})
  createdOn: string | null;
  @Column("date", { name: "updated_on"})
  updateddOn: string | null;
  
  @ManyToOne(
      () => ClientAlert,
      (ca) => ca.orders
  )
  @JoinColumn([{ name: "client_alert_id", referencedColumnName: "id" }])
  clientAlert: ClientAlert;

  @OneToMany(() => OrderTransaction, (ot) => ot.order)
  transactions: OrderTransaction[];
}
