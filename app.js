const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const Note = require('./note');
const uuid = require('uuid/v4');
const low = require('lowdb');
const utils = require('./utils');

const success = {"status": 200};
const internal = {"status": 500};
const not_found = {"status": 404};
const bad_request = {"status": 400};

let logger = log4js.getLogger();
logger.level = 'debug';
let app = express();
app.use(bodyParser.json());
const FileSync = require('lowdb/adapters/FileSync');
let adapter;
if (require.main === module) {
    adapter = new FileSync('./data/db.json');
}
else {
    adapter = new FileSync('./data/test_db.json');

}


const db = low(adapter);
db.defaults({ notes: [] })
  .write();



app.route('/note')
    .post(function(req, res) {
        logger.debug(req.body);

        if(!Note.validate(req.body)) {
            res.status(400).send(bad_request);
            return;
        }
        let id = uuid();
        let note = Note.Note();
        note.id = id;
        note.title = req.body.title;
        note.text = req.body.text;
        note.onCreate = utils.currentTimestamp();
        note.onUpdate = note.onCreate;

        db.get('notes')
        .push(note)
        .write();

        res.send(success);

}).get(function(req, res) {
        notes = db.get('notes').value();
        logger.debug(notes);

        if(!notes)
            res.send([]);
        else
            res.send(notes);
}).delete(function(req, res) {
    if(!req.body.id) {
        res.status(400).send(bad_request);
        return;
    }

    db.get('notes')
    .remove({ id: req.body.id})
    .write();

    res.send(success);

}).patch(function(req, res) {
        obj = Note.NoteSmall();
        obj.id = '';
        if(!Note.validate(req.body, obj) || !req.body.id) {
            res.status(400).send(bad_request);
            return;
        }

        note = db.get('notes')
        .find({"id":req.body.id})
        .value();
        logger.debug(note);

        if(!Note.validate(req.body, Note.Note())) {
            res.status(500).send(internal);
            return;
        }

        let newNote = Note.Note();
        newNote.id = req.body.id;
        newNote.title = req.body.title ? req.body.title : note.title;
        newNote.text = req.body.text ? req.body.text : note.text;
        newNote.onCreate = note.onCreate;
        newNote.onUpdate = utils.currentTimestamp();

        db.get('notes')
        .find({ id: newNote.id })
        .assign(newNote)
        .write();

        res.send(success);
});

if (require.main === module) {
  app.listen(8080, function () {
    logger.info('Server started on port 8080!');
    });
}

exports = module.exports = app;