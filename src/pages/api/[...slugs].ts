export const prerender = false

import { Elysia } from 'elysia'

const app = new Elysia({ prefix: '/api' }) 
    .get('/test', () => 'hi')

const handle = ({ request }: { request: Request }) => app.handle(request) 

export const GET = handle 
export const POST = handle 