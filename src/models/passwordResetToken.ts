

import { Document, Model, Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';

// Extendendo Document para incluir os métodos do esquema.
interface passwordResetTokenDocument extends Document {
    owner: Schema.Types.ObjectId;
    token: string;
    createdAt: Date;
}

// Interface para os métodos de instância do documento.
interface Methods {
    compareToken(providedToken: string): Promise<boolean>;
}

// Esquema para o token de verificação de e-mail.
const passwordResetTokenSchema = new Schema<passwordResetTokenDocument,{}, Methods>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now, // Alterado para ser uma referência à função
            expires: 3600, // Token expira após 1 hora
        }
    }
);

// Middleware para pré-salvamento que hasheia o token.
passwordResetTokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        this.token = await hash(this.token, 10);
    }
    next();
});

// Método para compa rar o token fornecido com o token hash armazenado.
passwordResetTokenSchema.methods.compareToken = async function (token) {
    const result = compare(token, this.token);
    return result
};

// Criação do modelo.
export default model(
    "PassordResetToken",
    passwordResetTokenSchema

)as Model<passwordResetTokenDocument, {}, Methods>
