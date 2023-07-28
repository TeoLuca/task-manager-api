const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router =  new express.Router()


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,         //ES6 - spread operator - copy all prop from body
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


// GET /tasks?completed=true
//GET /tasks?limit=10&skip=10
//GET /tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true' //comes as a string from the query params
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //alternative
        // const tasks = await Task.find({ owner: req.user._id })
        // res.send(tasks)
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.limit) * (parseInt(req.query.page) -1),
                sort
            }
        })
        res.send(req.user.tasks)
        
    } catch (e) {
        res.status(500).send(e)
    }

})


router.patch('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((item) =>  allowedUpdates.includes(item))

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        if(!task){
            return  res.status(404).send()
        }

        res.status(201).send(task)

    }catch(e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }

        res.send(task)

    }catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
