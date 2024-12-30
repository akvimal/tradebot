import { Exclude } from "class-transformer";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Client } from "./client.entity";

@Index("app_user_un", ["email"], { unique: true })
@Index("app_user_pk", ["id"], { unique: true })
@Entity("app_user")
export class AppUser {

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;
  
  @Column("character varying", { name: "email", length: 40 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ name: "last_login", type: 'timestamp', nullable: true, default: null })
  public lastlogin: Date | null;

    @OneToMany(() => Client, (c) => c.appUser)
    clients: Client[];
}