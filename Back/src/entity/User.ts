import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn, UpdateDateColumn
} from "typeorm"
import { IsEmail } from "class-validator"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    private id: Number

    @Column({ unique: true })
    @IsEmail()
    private email: string

    @CreateDateColumn()
    private created_at: Date

    @UpdateDateColumn()
    private updated_at: Date

    constructor(email: string) {
        this.email = email;
    }

    public getId(): Number {
        return this.id;
    }
    
    public getMail(): string {
        return this.email;
    }
    public setMail(Email: string): void {
        this.email = Email;
    }
}
