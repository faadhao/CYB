import express from 'express'
import { create, edit, deletee, concerts } from '../controller/concert.js'

const router = express.Router()

router.post('/', create)
router.patch('/:id', edit)
router.delete('/:id', deletee)
router.get('/concerts', concerts)

export default router
