import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({
        id: authorId
    })
    
    if( !userExists) {
        throw new Error('User not fouund')
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ author { id name email posts { id title published } } }')
    return post.author
}

// createPostForUser('ckcfloerq016n0780nxl8ln5a', {
//     title: "Using async await",
//     body: "You can do it",
//     published: true,
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })


const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({
        id: postId
    })

    if(!postExists){
        throw new Error('Post not found')
    }

    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    }, '{ author { id name email posts { id title body published } } }')
    return post.author
}

// updatePostForUser('ckcmqj3gi003a0780po49sfqy', {
//     published: false,
//     body: "Updated with async-await lalala"
// }).then((user) => {console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })
