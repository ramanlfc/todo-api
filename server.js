const express = require('express');
const bodyParser = require('body-parser');
const { Todo } = require('./model/todo.js');
const { ObjectId } = require('mongodb');

const app = express();
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find({}).then(todos => {
        res.send({ todos });
    }).catch(e => {
        res.status(500).send(e);
    });
});


app.get('/todos/:id', (req, res) => {
    const id = req.params["id"];

    if (!ObjectId.isValid(id)) {
        res.status(400).send('invalid id');
        return;
    }

    Todo.findById(id).then(todo => {
        if (todo == null) {
            res.status(404).send('todo not found');
        }

        res.status(200).send({ todo });
    }).catch(e => {
        res.status(500).send(e);
    });
});

app.post('/todos', (req, res) => {
    var todo = new Todo(req.body);

    todo.save().then(todo => {
        // console.log(todo);
        res.send(todo);
    }, err => {
        res.status(400).send(err);
    });
});

app.put('/todos/:id', (req, res) => {
    const id = req.params["id"];

    if (!ObjectId.isValid(id)) {
        res.status(400).send('invalid id');
        return;
    }

    var todo = {
        title: req.body.title,
        completed: req.body.completed
    };

    if (todo.completed) {
        todo.completedAt = new Date();
    } else {
        todo.completed = 'false'
    }

    Todo.findByIdAndUpdate(id, { $set: todo }, { new: true }).then(todo => {
        if (todo === null) {
            res.status(404).send('no todo found for id: ' + id);
        } else {
            res.status(200).send({ todo });
        }
    }).catch(err => {
        res.status(500).send(err);
    });



});

app.delete('/todos/:id', (req, res) => {
    const id = req.params["id"];

    if (!ObjectId.isValid(id)) {
        res.status(400).send('invalid id');
        return;
    }

    Todo.findByIdAndRemove(id).then(todo => {
        if (todo === null) {
            res.status(404).send('no todo found for id: ' + id);
        } else {
            res.status(200).send({ todo });
        }
    }).catch(err => {
        res.status(500).send(err);
    });

});

app.listen(3000, () => {
    console.log('server running at port 3000');
});

module.exports = {
    app
};





