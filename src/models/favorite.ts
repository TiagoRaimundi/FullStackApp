import { AudioValidationSchema } from "#/utils/validationSchema";
import { Model, ObjectId, Schema, model, models } from "mongoose";

interface FavoriteDocument{
    owner: ObjectId
    items: ObjectId[]
}

const favoriteSchema = new Schema<FavoriteDocument>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"

        },
        items: [{type: Schema.Types.ObjectId, ref: "Audio" }]
    }, {timestamps: true})

const Favorite = models.Favorite || model("Favorite", favoriteSchema );

export default model("Favorite", favoriteSchema) as Model<FavoriteDocument>;