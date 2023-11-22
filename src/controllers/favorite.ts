import Audio from "#/models/audio";
import Favorite from "#/models/favorite";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const toggleFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as String
    let status : "added" | "removed"

    if (!isValidObjectId(audioId)) return res.status(422).json({ error: "Audio id is invalid!" })

    const audio = await Audio.findById(audioId)
    if (!audio) return res.status(404).json({ error: 'Resources not found!' })
    // audio is already in fav
    const alreadyExists = await Favorite.findOne({ owner: req.user.id, items: audioId })
    if (alreadyExists) {
        //we want to remove from old lists
        await Favorite.updateOne({ owner: req.user.id }, {
            $pull: { items: audioId }
        })
        status = "removed"
    } else {
        // trying to create fresh fav list
        const favorite = await Favorite.findOne({ owner: req.user.id })
        if (favorite) {

            await Favorite.updateOne({ owner: req.user.id, }, {
                $addToSet: { items: audioId }
            })

        } else {

            await Favorite.create({ owner: req.user.id, items: [audioId] })
            // trying to add new audio to the old list

        }
        status ="added"

    }
    res.json({ status })
}