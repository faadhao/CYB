import express from 'express'
import { create, deletee, edit, getTicket, tickets } from '../controller/ticket.js'
import { bookTicket } from '../controller/users.js'


const router = express.Router()

router.post('/', create)
router.post('/bookticket', bookTicket)
router.patch('/:id', edit)
router.delete('/:id', deletee)
router.get('/tickets', tickets)
router.get('/getTicket', getTicket)

export default router
