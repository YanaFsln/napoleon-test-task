'use strict';

let test = require('tape');
let request = require('supertest');
let app = require('../app.js');
let randomstring = require("randomstring");


test('Add note', function (t) {
  request(app)
    .post('/note')
    .send({title: "hello", text: "world"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
        t.error(err, err);
        t.end();
    });
});

test('Get notes', function (t) {
  request(app)
    .get('/note')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
        t.error(err, err);
        t.end();
    });
});

test('Update note', function (t) {
  request(app)
    .post('/note')
    .send({title: "hello", text: "world"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
        t.error(err, err);

        request(app)
        .get('/note')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.error(err, err);

            let notes = res.body;
            if(!notes.length) {
                t.error("Add not works properly");
                t.end();
                return;
            }

            let changingId = notes[0].id
            let new_title = randomstring.generate();
            let newBody = {id: changingId, title: new_title};
            request(app)
                .patch('/note')
                .send(newBody)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    t.error(err, err);
                    let notes = res.body;
                    for(let i = 0; i < notes.length; i++)
                        if(notes[i].id && notes[i].title
                            && notes[i].id === changingId && notes[i].title !== new_title)
                            t.error("Update not works properly");
                    t.end()
                });
            });
        });
    });

test('Delete notes', function (t) {
  request(app)
    .get('/note')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
        t.error(err, err);
        let notes = res.body;
        if(!notes.length) {
            t.error("Add not works properly");
            t.end();
            return;
        }
        let deletingId = notes[0].id;
        request(app)
            .delete('/note')
            .send({id: deletingId})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                t.error(err, err);
                let notes = res.body;

                for(let i = 0; i < notes.length; i++)
                    if(notes[i].id && notes[i].id === deletingId)
                        t.error("Deleting not works");
                t.end();
            });
        });
    });