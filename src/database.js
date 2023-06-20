import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
        .then(
            data => {
                this.#database = JSON.parse(data)
            }
        )
        .catch(
            () => {
                this.#persist()
            }
        )
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {

        let data = []

        if(search) {
            data = this.#database[table].filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        } else {
            data = this.#database[table]
        }
        return data
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(task => task.id === id)

        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, data, complete = false) {
        const rowIndex = this.#database[table].findIndex(task => task.id === id)

        if(rowIndex > -1) {

            const task = this.#database[table][rowIndex]
        
            this.#database[table].splice(rowIndex, 1)

            let updatedTask = {}

            if(complete) {

                updatedTask = {
                    ...task,
                    completed_at: (task.completed_at) ? null : new Date(),
                    updated_at: new Date()
                }
                 
            } else {
                updatedTask = {
                    ...task,
                    title: data.title ? data.title : task.title,
                    description: data.description ? data.description : task.description,
                    updated_at: new Date()
                }
            }

            this.#database[table].push(updatedTask)

            this.#persist()

            return updatedTask
        }
    }
}