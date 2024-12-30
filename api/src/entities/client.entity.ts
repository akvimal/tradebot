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
import { AppUser } from "./app-user.entity";

@Index("client_pk", ["id"], { unique: true })
@Index("client_un", ["username"], { unique: true })
@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "username", unique: true })
  username: string;

  @OneToMany(() => Alert, (alert) => alert.partner)
  alerts: Alert[];
  @OneToMany(() => ClientPartner, (cp) => cp.client)
  partners: ClientPartner[];

  @ManyToOne(() => AppUser, (au) => au.clients)
  @JoinColumn([{ name: "app_user_id", referencedColumnName: "id" }])
  appUser: AppUser;
 
}
