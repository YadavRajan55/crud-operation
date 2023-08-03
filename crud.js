const express = require('express');
const uservalidation = require('./validation')
const bodyParser = require('body-parser');
const app = express()
let port = 3000;
app.use(bodyParser.json());
app.use(express.json())
let router = express.Router();
app.use(router)
app.use('/api', router)

var database = [];


const validateID = (req, res, next) => {
    const { id } = req.body;
    const userExists = database.some((user) => user.id === id);
    if (userExists) {
        return res.status(400).json({ error: 'ID must be unique.' });
    }
    next();
};


// Get all users
router.get('/users', (req, res) => {
    res.status(200).json(database);
});

// Get a user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(typeof (id))
        const user = database.find((user) => user.id == id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

// Create a new user
router.post('/createUser', validateID, async (req, res) => {
    const { name, age, city, id } = req.body;
    try {
        // Validate the user data
        await uservalidation.userValidate.validate(req.body);

        // Validation passed, proceed to create the user
        // const id = uuidv4();
        const newUser = { id, name, age, city };
        database.push(newUser);
        res.status(200).json({ message: "success", data: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a user by ID
router.put('/updateUser', async (req, res) => {
    const { id, name, age, city } = req.body;

    try {
        await uservalidation.updateValidation.validate(req.body);

        const userIndex = database.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found.' });
        }
        let currentData = database[userIndex];
        const updatedUser = { id, name: name ?? currentData['name'], age: age ?? currentData['age'], city: city ?? currentData['city'] };

        database[userIndex] = updatedUser;
        res.status(200).json({ message: "success", data: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user by ID
router.delete('/user', async (req, res) => {
    const { id } = req.body;
    try {
        await uservalidation.deleteValidation.validate(req.body);
        database = database.filter((user) => user.id !== id);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Running on ${port}`)
})

