const request = require('supertest');
const expect = require('expect');
const { app } = require('./../server');
const { Todo } = require('./../model/todo');

beforeEach(done => {
    Todo.remove({}).then(() => done());
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
                    expect(todos.length).toBe(1);
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch(e => {
                    done(e);
                });
            });// end request
         });
});
