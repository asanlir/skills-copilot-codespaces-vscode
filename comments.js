// Create web server
// Created: 03/09/2021 11:50 PM

const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { check, validationResult } = require('express-validator');

// @route   GET /comments/:postId
// @desc    Get comments of a post
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /comments/:postId
// @desc    Create comment
// @access  Private
router.post(
  '/:postId',
  [check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    try {
      const { text } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
      }
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      const comment = new Comment({
        user: req.user.id,
        post: req.params.postId,
        text,
      });
      await comment.save();
      res.json(comment);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;