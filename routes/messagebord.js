import express from 'express'
import { create, reply, deletee, messages } from '../controller/messagebord.js'

const router = express.Router()

router.post('/', create)
router.patch('/reply/:id', reply)
router.delete('/:id', deletee)
router.get('/messages', messages)

export default router