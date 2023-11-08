import { Document, Model, Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';

// Extendendo Document para incluir os métodos do esquema.
interface EmailVerificationTokenDocument extends Document {
    owner: Schema.Types.ObjectId;
    token: string;
    createdAt: Date;
}

// Interface para os métodos de instância do documento.
interface EmailVerificationTokenMethods {
    compareToken(providedToken: string): Promise<boolean>;
}

// Esquema para o token de verificação de e-mail.
const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument, Model<EmailVerificationTokenDocument>, EmailVerificationTokenMethods>(
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
emailVerificationTokenSchema.pre<EmailVerificationTokenDocument>('save', async function (next) {
    if (this.isModified('token')) {
        this.token = await hash(this.token, 10);
    }
    next();
});

// Método para comparar o token fornecido com o token hash armazenado.
emailVerificationTokenSchema.methods.compareToken = async function (providedToken: string): Promise<boolean> {
    return compare(providedToken, this.token);
};

// Criação do modelo.
const EmailVerificationTokenModel = model<EmailVerificationTokenDocument, Model<EmailVerificationTokenDocument, {}, EmailVerificationTokenMethods>>(
    "EmailVerificationToken",
    emailVerificationTokenSchema
);

export default EmailVerificationTokenModel;
