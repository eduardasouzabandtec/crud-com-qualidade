import fs from "fs"

const DB_FILE_PATH = "./core/db";
console.log('[CRUD]')

interface ITodo {
    date: string,
    content: string,
    done: boolean
}
function create(content: string) {
    const todo: ITodo = {
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
    return content;
}
function read(): ITodo[] {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if(!db.todos){
        return [];
    }
    return db.todos;
}
function CLEAR_BD(){
    fs.writeFileSync(DB_FILE_PATH, "")
}

CLEAR_BD();
create('primeira TODO');
create('segunda TODO');
console.log(read());
