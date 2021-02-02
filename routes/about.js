import express from 'express'
import { create, edit, aboutCYB } from '../controller/about.js'

const router = express.Router()

router.post('/', create)
router.patch('/:id', edit)
router.get('/', aboutCYB)

export default router
