const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const UserOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: UserOneId,
    name: "Mike",
    email: 'mike@example.com',
    password: "pass12!!",
    tokens: [{
        token: jwt.sign({ _id : UserOneId }, process.env.JWT_SECRET)
    }]
}

const UserToweId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: UserToweId,
    name: "Teodora",
    email: 'teodora@example.com',
    password: "mypass009!",
    tokens: [{
        token: jwt.sign({ _id : UserToweId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}

const setUpDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    UserOneId,
    userOne,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase
}