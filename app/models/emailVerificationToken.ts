import { compare, genSalt, hash } from "bcrypt";
import { Mode } from "fs";
import mongoose, {
  Document,
  Model,
  ObjectId,
  Schema,
  model,
  models,
} from "mongoose";

interface EmailVerificationTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const EmailVerificationTokenSchema = new Schema<
  EmailVerificationTokenDocument,
  {},
  Methods
>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 64 * 64 * 24 },
});

EmailVerificationTokenSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("token")) return next();

    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

EmailVerificationTokenSchema.methods.compareToken = async function (
  tokenToCompare
) {
  try {
    return await compare(tokenToCompare, this.token);
  } catch (error) {
    throw error;
  }
};

const EmailVerificationToken =
  models.EmailVerificationToken ||
  model("EmailVerificationToken", EmailVerificationTokenSchema);

export default EmailVerificationToken as Model<
  EmailVerificationTokenDocument,
  {},
  Methods
>;
