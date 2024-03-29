import { Model, model, models } from "mongoose"
import { ObjectId, Schema } from "mongoose"


interface PlaylistDocument {
    title: string
    owner: ObjectId
    items: ObjectId[]
    visibility: "public" | "private" | "auto"
}

const playlistSchema = new Schema<PlaylistDocument>({
    title: {
        type: String,
        required: true
    },
    owner:{
        type: String,
        required: true,
        ref: "user"
    },
    items: 
        [{
            type: String,
            required: true,
            ref: "Audio"
        }],

    visibility: {
        type: String,
        enum: ["public", "private", "auto"],
        default: 'public'
    }

}, {timestamps: true})

const Playlist = models.Playlist || model("Playlist", playlistSchema)

export default Playlist as Model<PlaylistDocument>
