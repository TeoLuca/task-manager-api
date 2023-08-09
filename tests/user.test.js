const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { UserOneId, userOne, setUpDatabase } = require('./fixtures/db')


beforeEach(setUpDatabase)


test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Teo',
        email: 'teo11@gmail.com',
        password: 'myPas777!'
    }).expect(201)

    //assert that the db was change correctly
    const user = User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('Should login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login an nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: 'thisdoesntexists@example.com',
        password: userOne.password
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not delete account for unautheticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/watch.png')
    .expect(200)

    const user = await User.findById(UserOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
    
})


test('Should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Teo'
    })
    .expect(201)

    const user = await User.findById(UserOneId)
    expect(user.name).toEqual('Teo')
    
})


test('Should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
       location: 'Iasi'
    })
    .expect(400)
})