import { Document, Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';

// Documento do Mongoose que inclui os campos do Schema e os métodos de instância.
interface IPasswordResetTokenDocument extends Document {
    owner: Schema.Types.ObjectId;
    token: string;
    createdAt: Date;
    compareToken(providedToken: string): Promise<boolean>;
}

// Esquema para o token de redefinição de senha.
const passwordResetTokenSchema = new Schema<IPasswordResetTokenDocument>({
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
        default: Date.now,
        expires: 3600, // Token expira após 1 hora
    }
});

// Middleware para pré-salvamento que hasheia o token.
passwordResetTokenSchema.pre<IPasswordResetTokenDocument>('save', async function (next) {
    if (this.isModified('token')) {
        this.token = await hash(this.token, 10);
    }
    next();
});

// Método para comparar o token fornecido com o token hash armazenado.
passwordResetTokenSchema.methods.compareToken = async function (providedToken: string): Promise<boolean> {
    return compare(providedToken, this.token);
};

// Criação do modelo.
const PasswordResetTokenModel = model<IPasswordResetTokenDocument>('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetTokenModel;
