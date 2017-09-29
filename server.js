const express = require('express');
const bodyParser = require('body-parser');
const { Todo } = require('./model/todo.js');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo(req.body);

    todo.save().then(todo =>{
       // console.log(todo);
        res.send(todo);
    },err=>{
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('server running at port 3000');
});

module.exports = {
    app
};





