const express = require('express');
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// console.log("token before", token)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("token from header", token)
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT, (err, user) => {

        console.log("JWT Verify Error:", err);
        console.log("JWT secret:", process.env.JWT);

        if (err) return res.sendStatus(401);

        req.user = user;
        next();
    })
}

//Get all posts
router.get('/', async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
            include: {  user: true }
        });
        res.json(posts);
        } catch (err) {
            next(err);
        }
    });

//Get posts by user id
router.get('/user/:id', async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const userPosts = await prisma.post.findMany({
        where: {
          userId: userId
        },
        include: { user: true }
      });
      if (userPosts.length === 0) {
        res.status(404).send("No posts found for this user.");
      } else {
        res.json(userPosts);
      }
    } catch (err) {
      next(err);
    }
  });

//Get post by id
    router.get('/:id', async (req, res, next) => {
        try {
            const post = await prisma.post.findUnique({
                where: { id: parseInt(req.params.id) },
                include: { user: true },
            });
            if (post) {
                res.json(post);
            } else {
               res.status(404).send("Post not found");
            }
        } catch (err) {
            next (err)
        }
    });

//Create a new post, by logged-in user
router.post("/", authenticateToken, async (req, res, next) => {
    try {
        const newPost = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                userId: req.user.id
            }
        });
        res.status(201).json(newPost);
    } catch(err) {
        next(err);
    }
})

//Update a post if created by logged-in user
router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        console.log("user ID from request", req.user.id)
        console.log("user Id from db", post.userId)

        if (post.userId !== req.user.id) {
            return res.sendStatus(403).send("You can only edit your own posts.");
        }
        
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(req.params.id) },
            data: { ...req.body },
        });

        res.json(updatedPost);
    } catch(err) {
        next(err);
    }
})

//Delete a post only if created by logged-in user
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (post.userId !== req.user.id) {
            return res.sendStatus(403).send("You can only delete your own posts.");
        }
        
       await prisma.post.delete({
        where: { id: parseInt(req.params.id) },
       });

        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
});

module.exports = router;