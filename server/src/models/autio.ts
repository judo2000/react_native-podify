import { categories, categoriesTypes } from "#/utils/audo_category";
import { Model, ObjectId, Schema, model } from "mongoose";

export interface AudioDocument {
  title: string;
  about: string;
  owner: ObjectId;
  file: {
    url: string;
    publicId: string;
  };
  poster: {
    url: string;
    publicId: string;
  };
  likes: ObjectId[];
  category: categoriesTypes;
}

const AudioSchema = new Schema<AudioDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    about: {
      type: String,
      required: true,
    },
    file: {
      type: Object,
      url: String,
      publicId: String,
      required: true,
    },
    poster: {
      type: Object,
      url: String,
      publicId: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: categories,
      default: "Others",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Audio", AudioSchema) as Model<AudioDocument>;
