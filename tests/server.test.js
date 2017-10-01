const request = require('supertest');
const expect = require('expect');
const { app } = require('./../server');
const { Todo } = require('./../model/todo');
const { ObjectId } = require('mongodb');

var todos = [{
    _id: new ObjectId(),
    title: 'dummy todo1'
}, {
    _id: new ObjectId(),
    title: 'dummy todo 2',
    completed: true
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


describe('GET /todos', () => {

    it('should return all todos', done => {
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

describe('GET /todos/id', () => {

    it('should return todo by id', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.title).toBe(todos[0].title);
            }).end(done);// end request
    });


    it('should return 404', done => {

        var id = new ObjectId();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);// end request
    });

    it('should return 400', done => {

        var id = new ObjectId();
        request(app)
            .get(`/todos/4654`)
            .expect(400)
            .end(done);// end request
    });

});


describe('PUT /todos/id', () => {

    it('should update todo by id', done => {
        request(app)
            .put(`/todos/${todos[0]._id.toHexString()}`)
            .send({
                title: 'foo bar'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.title).toBe('foo bar');
            }).end(done);// end request
    });


    it('should return 404', done => {

        var id = new ObjectId();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);// end request
    });

    it('should return 400', done => {

        var id = new ObjectId();
        request(app)
            .get(`/todos/4654`)
            .expect(400)
            .end(done);// end request
    });

});



describe('DELETE /todos/id', () => {

    it('should remove todo by id', done => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.title).toBe(todos[0].title);
            }).end((err, res) => {
                if (err)
                    return done(err);

                Todo.findById(todos[0]._id).then(todo => {
                    expect(todo).toBe(null);
                    done();
                }).catch(err => done(err));
            });// end request
    });


    it('should return 404', done => {

        var id = new ObjectId();
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);// end request
    });

    it('should return 400', done => {

        var id = new ObjectId();
        request(app)
            .delete(`/todos/4654`)
            .expect(400)
            .end(done);// end request
    });

});