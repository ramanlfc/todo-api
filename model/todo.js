const {mongoose} = require('./../db/db.js');


const Todo = mongoose.model('Todo', {
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim : true
    }, completed: {
        type: Boolean,
        default: false
    }, completedAt: {
        type: Date
    }
});

module.exports ={
    Todo
};