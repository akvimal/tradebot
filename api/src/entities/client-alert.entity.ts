import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Alert } from "./alert.entity";
import { ClientPartner } from "./client-partner.entity";
import { ClientOrder } from "./client-order.entity";

@Index("client_alert_pk", ["id"], { unique: true })
@Entity("client_alerts")
export class ClientAlert {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "client_partner_id" })
  clientPartnerId: number;
  @Column("integer", { name: "alert_id" })
  alertId: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_live', type: 'boolean', default: false })
  isLive: boolean;

  @Column("json", { name: "config", nullable: true })
  config: object | null;

  @ManyToOne(
    () => Alert,
    (alert) => alert.clientAlerts
  )
  @JoinColumn([{ name: "alert_id", referencedColumnName: "id" }])
  alert: Alert;

  @ManyToOne(
    () => ClientPartner,
    (cp) => cp.clientPartners
  )
  @JoinColumn([{ name: "client_partner_id", referencedColumnName: "id" }])
  clientPartner: ClientPartner;
  
  @OneToMany(() => ClientOrder, (order) => order.clientAlert)
  orders: ClientOrder[];
}