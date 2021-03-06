import bcript from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: "teste user",
        email: "teste@email.com",
        password: bcript.hashSync('12345678')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: "my post",
        body: "",
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: "my post 2",
        body: "",
        published: false,
    },
    post: undefined
}

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id}, process.env.JWT_SECRET)

    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne, postOne, postTwo}