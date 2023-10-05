import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import Audio from "#/models/audio";
import Favorite from "#/models/favorites";

export const toggleFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId;
  let status: "added" | "removed";

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Audio id is invalid" });
  const audio = await Audio.findById(audioId);

  if (!audio) return res.status(404).json({ error: "Resource not found!" });

  // if audioId is already in favorites
  const alreadyExists = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });

  if (alreadyExists) {
    await Favorite.updateOne(
      { owner: req.user.id },
      {
        $pull: { items: audioId },
      }
    );

    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user.id });
    if (favorite) {
      // trying to update old fav list
      await Favorite.updateOne(
        { owner: req.user.id },
        {
          // addToSet will not allow dupliate items so it will
          // add the audioId only if it is not already in there
          $addToSet: { items: audioId },
        }
      );
    } else {
      // trying to create a new fav list
      await Favorite.create({ owner: req.user.id, items: [audioId] });
    }

    status = "added";
  }
  res.json({ status });
};
