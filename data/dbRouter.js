const router = require('express').Router();

const db = require('./db')


router.get('/', (req, res) => {
    db
    .find()
    .then(posts => {
        res.json({ posts });
    })
    .catch(err => {
        res.status(500).json({ error: 'posts could not be retrieved' })
    }) 
}) // finished

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db
    .findById(id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).json({ message: 'the post with the specified id does not exist' });
            return;
        } res.json(post);
    })
    .catch(err => {
        res.status(500).json({ error: 'the post information could not be retrieved' });
    })
}) // finished 

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    db
    .findCommentById(id)
    .then(comment => {
        if(comment.length === 0) {
            res.status(404).json({ message: 'the post with the specified id does not exist.' });
            return;
        } res.json(comment);
    })
    .catch(err => {
        res.status(500).json({ error: 'the comments information could not be retrieved' });
    })
}) // finished 

router.post('/', (req, res) => {
    const { title, contents, created_at, updated_at } = req.body;
    if(!title || !contents ) {
        res.status(400).json({ errorMessage: "please provide title and contents for the post" })
        return;
    }
    db.insert({
        title,
        contents, 
        created_at,
        updated_at
    })
    .then(post => {
        res.status(201).json(post);
    })
    .catch(err => {
        res.status(500).json({ message: 'error saving post to database' })
    })
}) // finished 

router.post('/:id/comments', (req, res) => {
    db.insertComment(req.params.id)
    .then(comment => {
        res.status(201).json(comment);
        return;
    })
    .catch(err => {
        res.status(500).json({ error: 'there was an error saving the comment to the database'});
    })
}) // undone 

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db
    .remove(id)
    .then(response => {
      if(response === 0) {
        res.status(404).json({message: 'the post with the specified ID does not exist' })
        return;
      }  
      res.json({ success: ` user with id: ${id} removed from system`})
    })
    .catch(err => {
        res.status(500).json({ error: "the post could not be removed" })
    })
}) // finished

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    db
    .update(id, changes)
    .then(updated => {
        if(updated) {
            res.status(200).json(updated);
        } else {
            res
            .status(400)
            .json({ errorMessage: 'please provide title and contents for the post' })
        }
    })
    .catch(error => {
        res
        .status(500)
        .json({  error: 'the post information could not be modified' })
    })
}) // finished

module.exports = router;