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
import { Alert } from "./alert.entity";

@Index("alert_sec_pk", ["id"], { unique: true })
@Entity("alert_securities")
export class AlertSecurity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "symbol", length: 255 })
  symbol: string;

  @Column("double precision", { name: "price", precision: 53 })
  price: number;
  
  @Column("date", { name: "created_on"})
  createdOn: string | null;

  @Column("integer", { name: "alert_id" })
  alertId: number;
  
  @ManyToOne(
    () => Alert,
    (alert) => alert.securities
  )
  @JoinColumn([{ name: "alert_id", referencedColumnName: "id" }])
  alert: Alert;

}
