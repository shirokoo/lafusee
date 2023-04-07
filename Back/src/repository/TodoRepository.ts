import { Todo } from '../entity/Todo';
import { AppDataSource } from '../db/data-source';

export function GetUserTask(id, userid){
     const todo = AppDataSource
    .createQueryBuilder()
    .select()
    .from(Todo, "Todo")
    .where("userId = :userid", { userid: userid })
    .andWhere("id = :id", {id: id})
    .execute()
    return todo;
}