const { AuthenticationError, UserInputError } = require('apollo-server')
const Post = require('../../models/Post')
const auth = require('../../utils/auth')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId)
                if (!post) {
                    throw new Error('Post not found!')
                }
                return post
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = auth(context)
            if (body.trim() === '') {
                throw new UserInputError('Post body must not be empty!')
            }
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save()
            context.pubSub.publish('NEW_POST', {
                newPost: post
            })
            return post
        },

        async deletePost(_, { postId }, context) {
            const user = auth(context)
            try {
                const post = await Post.findById(postId)
                if (!post) {
                    throw new Error('Post Not Found!')
                }
                if (user.username === post.username) {
                    await post.delete()
                    return 'Post deleted successfully!'
                } else {
                    throw new AuthenticationError('Action not allowed!')
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        async likePost(_, { postId }, context) {
            const { username } = auth(context)
            const post = await Post.findById(postId)
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save()
                return post
            } else throw UserInputError('Post not found!')
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_POST')
        }
    }
}