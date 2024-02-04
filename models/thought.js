import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp),
        },
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [ReactionSchema],
        },
        {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
return this.reactions.length;
});

const Thought = mongoose.model('Thought', ThoughtSchema);

export default Thought;

