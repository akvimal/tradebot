import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Partner } from "./partner.entity";
import { AlertSecurity } from "./alert-security.entity";

@Index("alert_pk", ["id"], { unique: true })
@Index("alert_un", ["name", "partnerId"], { unique: true })
@Entity("alerts")
export class Alert {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true })
  name: string;

  @Column("character varying", { name: "exchange"})
  exchange: string;
  @Column("character varying", { name: "segment"})
  segment: string;
  @Column("character varying", { name: "order_type"})
  orderType: string;

  @Column("integer", { name: "partner_id", unique: true })
  partnerId: number;
  
  @ManyToOne(
    () => Partner,
    (partner) => partner.alerts
  )
  @JoinColumn([{ name: "partner_id", referencedColumnName: "id" }])
  partner: Partner;

  @OneToMany(() => AlertSecurity, (securities) => securities.alert)
  securities: AlertSecurity[];

}
