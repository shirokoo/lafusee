import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "./User";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  private id: Number;

  @Column()
  private task: string;

  @Column()
  private status: number;

  @CreateDateColumn()
  private created_at: Date;

  @UpdateDateColumn()
  private updated_at: Date;

  @ManyToOne((type) => User) // Init many to one relation with User
  @JoinColumn()
  private user: User; // Join user table with Article table

  constructor(task: string) {
    this.task = task;
  }

  public getId(): Number {
    return this.id;
  }

  public getTask(): string {
    return this.task;
  }
  public setTask(Task: string): void {
    this.task = Task;
  }

  public getStatus(): number {
    return this.status;
  }
  public setStatus(status: number) {
    this.status = status;
  }

  public getCreated_at(): Date {
    return this.created_at;
  }
  public getUpdated_at(): Date {
    return this.updated_at;
  }

  //Relations
  public getUser(): User {
    return this.user;
  }
  public setUser(User: User) {
    this.user = User;
  }
}
