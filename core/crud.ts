import fs from "fs";
import { json } from "stream/consumers";
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = "./core/db";
console.log('[CRUD]')

interface ITodo {
    id: string,
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

function update(id: string, partialTodo: Partial<ITodo>): ITodo {
    let updatedTodo;
    console.log(partialTodo);
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
    console.log('atualizados:', todos);
    return updatedTodo;
}

function updateContentById(id: string, content: string){
    return update(id, {
        content,
    })

}

CLEAR_BD();
create('primeira TODO');
create('segunda TODO');
const terceiraTodo = create('segunda TODO');
// update(terceiraTodo.id, {
//     content: 'Segunda TODO atualizada',
//     done: true
// });
updateContentById(terceiraTodo.id, 'Atualizada!')
console.log(read());
