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
import { Client } from "./client.entity";
import { Partner } from "./partner.entity";

@Index("client_part_pk", ["id"], { unique: true })
@Index("client_part_un", ["clientId","partnerId"], { unique: true })
@Entity("client_partners")
export class ClientPartner {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "client_id", unique: true })
  clientId: number;
  @Column("integer", { name: "partner_id", unique: true })
  partnerId: number;

  @Column("character varying", { name: "account_id"})
  accountId: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => ClientAlert, (ca) => ca.clientPartner)
  clientPartners: ClientPartner[];

  @ManyToOne(
      () => Client,
      (client) => client.partners
  )
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Client;


  @ManyToOne(
    () => Partner,
    (partner) => partner.clients
  )
  @JoinColumn([{ name: "partner_id", referencedColumnName: "id" }])
  partner: Partner;
}
