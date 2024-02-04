import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/user.js';
import Thought from './models/thought.js';

const app = express();
// Use bodyParser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use cors middleware to enable Cross-Origin Resource Sharing
app.use(cors());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetworkapi');

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}).populate('thoughts friends');
        res.json(users);
    } catch (err) {
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ error: 'Something went wrong' });
    }
});
app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('thoughts friends');
    if (!user) {
        return res.status(404).json({message: 'No user with this ID'});
    }
    res.json(user);
});

app.post('/api/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});
app.put('/api/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!user) {
        return res.status(404).json({message: 'No user with this ID'});
    }
    res.json(user);
});

app.delete('/api/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({message: 'No user with this ID'});
    }
    res.json(user);
});

app.post('/api/users/:userid/friends/:friendid', async (req, res) => {
    // TODO - add a new friend to a user's friend list
});

app.delete('/api/users/:userid/friends/:friendid', async (req, res) => {
    // TODO - remove friend to a user's friend list
});

app.get('/api/thoughts', async (req, res) => {
    const thoughts = await Thought.find({});
    res.json(thoughts);
});

app.get('/api/thoughts/:id', async (req, res) => {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
        return res.status(404).json({message: 'No thought with this ID'});
    }
    res.json(thought);
});

app.post('/api/thoughts', async (req, res) => {
    const thought = new Thought(req.body);
    try {
        const savedThought = await thought.save();
        await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: savedThought._id } });
        res.status(201).json(savedThought);
    } catch (err) {
        res.status(400).json(err);
    }
});

app.put('/api/thoughts/:id', async (req, res) => {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!thought) {
        return res.status(404).json({message: 'No thought with this ID'});
    }
    res.json(thought);
});

app.delete('/api/thoughts/:id', async (req, res) => {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
        return res.status(404).json({message: 'No thought with this ID'});
    }
    res.json(thought);
});

app.post('/api/thoughts/:thoughtId/reactions', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: req.body } }, { new: true });
        if (!thought) {
            return res.status(404).json({message: 'No thought with this ID'});
        }
        res.json(thought);
    } catch (err) {
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!thought) {
            return res.status(404).json({message: 'No thought with this ID'});
        }
        res.json(thought);
    } catch (err) {
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));



