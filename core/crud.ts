import fs from "fs";
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = "./core/db";
console.log('[CRUD]');

type UUID = string;

interface ITodo {
    id: UUID,
    date: string,
    content: string,
    done: boolean
}
function create(content: string): ITodo {
    const todo: ITodo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false
    };
    const todos: ITodo[] = [
        ...read(),
        todo,
    ];
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos
    }, null, 2));
    return todo;
}
function read(): ITodo[] {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}
function CLEAR_BD() {
    fs.writeFileSync(DB_FILE_PATH, "")
}

function update(id: UUID, partialTodo: Partial<ITodo>): ITodo {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo)
        }

    });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 2))
    if (!updatedTodo) {
        throw new Error('Please, provide another ID!')
    }
    return updatedTodo;
}

function updateContentById(id: UUID, content: string){
    return update(id, {
        content,
    })

}
function deleteById(id: UUID){
    const todos = read();
    const todosWithoutOne = todos.filter((todo) => {
        if(id === todo.id){
            return false;
        }
        return true
    })
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos: todosWithoutOne
    }, null, 2))
}

CLEAR_BD();
create('primeira TODO');
const secondTodo = create('segunda TODO');
deleteById(secondTodo.id);
const thirdTodo = create('Terceira TODO');
updateContentById(thirdTodo.id, 'Atualizada!');
console.log(read());
