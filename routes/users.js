import express from 'express'
import { create, login, logout, heartbeat, user, edit, mute, findUser, sold } from '../controller/users.js'

const router = express.Router()

router.post('/', create)
router.post('/login', login)
router.patch('/edit', edit)
router.patch('/:id', mute)
router.delete('/logout', logout)
router.get('/heartbeat', heartbeat)
router.get('/user', user)
router.get('/sold/:id', sold)
router.get('/find/:id', findUser)

export default router
