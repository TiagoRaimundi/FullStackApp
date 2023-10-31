import User from '#/utils/models/user'
import {Router} from 'express'
import { CreateUser } from '#/@types/user'

const router = Router()

router.post("/create", async (req: CreateUser, res) => {

   const {email, password, name} = req.body
   //const newUser = new User({email, password, name})
   //newUser.save()

   const user = await User.create({name, email, password})
   res.json({user})
})

export default router