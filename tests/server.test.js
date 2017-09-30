const request = require('supertest');
const expect = require('expect');
const { app } = require('./../server');
const { Todo } = require('./../model/todo');

var todos = [{
    title: 'dummy todo1'
}, {
    title: 'dummy todo 2'
}];

beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST  /todos', () => {
    it('should add a new todo', done => {
        var todo = {
            title: 'todo dummy'
        };

        request(app)
            .post('/todos')
            .send(todo)
            .expect(200)
            .expect(res => {
                expect(res.body.title).toBe(todo.title);
            })
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch(e => {
                    done(e);
                });
            });// end request
    });

    it('should not add a new todo', done => {
        var todo = {
            title: ''
        };

        request(app)
            .post('/todos')
            .send(todo)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => {
                    done(e);
                });
            });// end request
    });
});


describe('GET /todos',()=>{

    it('should return all todos',done =>{
         request(app)
            .get('/todos')
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => {
                    done(e);
                });
            });// end request
    });
});