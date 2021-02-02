import express from 'express'
import { create, edit, connectUs } from '../controller/connection.js'

const router = express.Router()

router.post('/', create)
router.patch('/:id', edit)
router.get('/connectUs', connectUs)

export default router
