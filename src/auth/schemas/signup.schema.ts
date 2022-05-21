import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

export type SignupDocument = Signup & Document

@Schema({ collection: 'users' })
export class Signup {

    @Prop({ required: true, type: String })
    name: string

    @Prop({ required: true, type: String })
    username: string

    @Prop({ required: true, type: String })
    password: string
}

export const SignupSchema = SchemaFactory.createForClass(Signup)