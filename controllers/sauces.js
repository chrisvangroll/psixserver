
const Sauce = require('../models/sauces');
const fs = require('fs');
const { restart } = require('nodemon');

exports.createThing = async (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
  });
  try{
    const savedSauce = await sauce.save();
    res.status(201).json({message: 'Post saved successfully!'});
  } catch (err){
    res.status(400).json({error: error});
  }
};

exports.likeThing = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({_id: req.params.id})

    const userId = req.body.userId;
    const userLike = (req.body.like ===1);
    const userDislike = (req.body.like === -1);
    const userCancel = (req.body.like === 0);
    const hasLiked = (sauce.usersLiked.includes(req.body.userId));
    const hasDisliked = (sauce.usersDisliked.includes(userId));

    if (userLike && hasLiked === false) {
      sauce.usersLiked.push(userId);
      sauce.likes += 1;
      if (hasDisliked) {
        sauce.usersDisliked.remove(userId);
        sauce.dislikes -= 1
      }
    }

    else if (userLike && hasLiked) {
      res.status(201).json({ message: "You already liked" })
    }

    else if (userCancel && hasLiked) {
      sauce.usersLiked.remove(userId);
      sauce.likes -= 1;
    }

    else if (userDislike && hasDisliked === false) {
      sauce.usersDisliked.push(userId);
      sauce.dislikes += 1;
      if (hasLiked) {
        sauce.usersLiked.remove(userId);
        sauce.likes -= 1
      }
    }

    else if (userDislike && hasDisliked) {
      res.status(201).json({ message: "You already Disliked" })
    }

    else if (userCancel && hasDisliked) {
      sauce.usersDisliked.remove(userId);
      sauce.dislikes -= 1;
    }
  
    sauce.save()
    res.status(201).json({ message: "Preference sended to the system." })
  } catch (err) {
    res.status(404).json({ message: err });
  }
}

exports.getOneThing = async (req, res, next) => {
    try{
      const oneSauce = await Sauce.findOne({_id: req.params.id});
      res.status(200).json(oneSauce);
    }catch (err) {
      res.status(404).json({message: err})
    }
  }

  exports.updateThing = async (req, res, next) => {
  let sauce = {...req.body}
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
   sauce.imageUrl = url + '/images/' + req.file.filename
  }
  try{
    const updatedSauce = await Sauce.updateOne({_id: req.params.id}, sauce);
    res.status(201).json({message: 'Thing updated successfully!'});
  }catch (err){
    res.status(400).json({message: err});
  }
};

exports.deleteThing = async (req, res, next) => {
  try{
    const oneSauce =  await Sauce.findOne({_id: req.params.id});
    const filename = oneSauce.imageUrl.split('/images/')[1];
     fs.unlink('images/' + filename, async () => {
     const deleteSauce = await Sauce.deleteOne({_id: req.params.id});
    res.status(200).json({message: 'Deleted'});
    });
  }catch (err){
    res.status(400).json({message: err})
  }      
};

  exports.getAllthings = async (req, res, next) => {
    try{
      const sauces = await Sauce.find();
      res.status(200).json(sauces);
    }catch (err){
      res.status(400).json({message: err});
    }
  }