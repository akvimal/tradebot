import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ClientAlert } from "./client-alert.entity";

@Index("client_order_pk", ["id"], { unique: true })
@Entity("client_orders")
export class ClientOrder {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id?: number;

  @Column("integer", { name: "client_alert_id"})
  clientAlertId?: number;

  @Column("character varying", { name: "exch_segment", length: 255 })
  exchSegment: string;
  @Column("character varying", { name: "security_id", length: 255 })
  securityId: string;
  @Column("character varying", { name: "symbol", length: 255 })
  symbol: string;
  @Column("character varying", { name: "trans_type", length: 255 })
  transType: string;
  @Column("double precision", { name: "entry_qty", precision: 53 })
  entryQty: number;
  @Column("double precision", { name: "entry_price", precision: 53 })
  entryPrice?: number;

  @Column("double precision", { name: "exit_qty", precision: 53 })
  exitQty: number;
  @Column("double precision", { name: "exit_price", precision: 53 })
  exitPrice?: number;
  
  @Column("character varying", { name: "order_type", length: 255 })
  orderType: string;
  @Column("character varying", { name: "product_type", length: 255 })
  productType: string;

  @Column("character varying", { name: "broker_order_id"})
  brokerOrderId?: string;
  @Column("character varying", { name: "correlation_id" })
  correlationId?: string;
  @Column("character varying", { name: "status" })
  status?: string;
  @Column("date", { name: "created_on"})
  createdOn?: string | null;
  @Column("date", { name: "updated_on"})
  updateddOn?: string | null;

  @ManyToOne(
      () => ClientAlert,
      (ca) => ca.orders
  )
  @JoinColumn([{ name: "client_alert_id", referencedColumnName: "id" }])
  clientAlert?: ClientAlert;
}