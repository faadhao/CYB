import express from 'express'
import { createFilm, createImg, deletee, editFilm, editImg, getFile, img } from '../controller/home.js'

const router = express.Router()

router.post('/img', createImg)
router.post('/film', createFilm)
router.patch('/editImg/:id', editImg)
router.patch('/editFilm/:id', editFilm)
router.delete('/:id', deletee)
router.get('/getFile', getFile)
router.get('/img/:file', img)

export default router
