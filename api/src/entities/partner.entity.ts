import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Alert } from "./alert.entity";
import { ClientPartner } from "./client-partner.entity";

@Index("partner_pk", ["id"], { unique: true })
@Index("partner_un", ["name"], { unique: true })
@Entity("partners")
export class Partner {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true })
  name: string;
  @Column("character varying", { name: "data_api", nullable: true})
  dataApi: string | null;
  @Column("character varying", { name: "trade_api", nullable: true})
  tradeApi: string | null;

  @OneToMany(() => Alert, (alert) => alert.partner)
  alerts: Alert[];
  
  @OneToMany(() => ClientPartner, (cp) => cp.partner)
  clients: ClientPartner[];
}
