import express from 'express'
import { create, edit, deletee, file, about } from '../controller/member.js'

const router = express.Router()

router.post('/', create)
router.patch('/:id', edit)
router.delete('/:id', deletee)
router.get('/file/:file', file)
router.get('/about', about)

export default router
