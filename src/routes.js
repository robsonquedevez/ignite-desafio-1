import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"
import { Database } from "./database.js"

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { 
                title,
                description
            } = req.body

            if(!title || !description) {
                return res.writeHead(401).end(JSON.stringify({ message: 'title or description not found' }))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const { title, description } = req.body

            const checkedTaskExist = database.select('tasks', { id })

            if(checkedTaskExist.length <= 0) {
                return res.writeHead(401).end(JSON.stringify({ message: 'Task not found' }))
            }

            const task = database.update('tasks', id, { title, description })

            return res.writeHead(204).end(JSON.stringify(task))
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const checkedTaskExist = database.select('tasks', { id })

            if(checkedTaskExist.length <= 0) {
                return res.writeHead(401).end(JSON.stringify({ message: 'Task not found' }))
            }

            const task = database.update('tasks', id, {}, true)

            return res.writeHead(204).end(JSON.stringify(task))
        }
    }    
]