import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

export type LoginDocument = Login & Document

@Schema({ collection: 'users' })
export class Login {

    @Prop({ required: true, type: String })
    username: string

    @Prop({ required: true, type: String })
    password: string
}

export const LoginSchema = SchemaFactory.createForClass(Login)