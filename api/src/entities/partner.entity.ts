import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Alert } from "./alert.entity";

@Index("partner_pk", ["id"], { unique: true })
@Index("partner_un", ["name"], { unique: true })
@Entity("partners")
export class Partner {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", nullable: true, unique: true })
  name: string | null;

  @OneToMany(() => Alert, (alert) => alert.partner)
  alerts: Alert[];
 
}
