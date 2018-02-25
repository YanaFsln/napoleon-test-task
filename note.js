const Note = function() {
    let note = {};
    note.id = 0;
    note.title = '';
    note.text = '';
    note.onCreate = '';
    note.onUpdate = '';
    return note;
};

const NoteSmall = function () {
    let note = {};
    note.title = '';
    note.text = '';
    return note;
};


function validate(obj, origin = NoteSmall()) {
    let containsIn = function (key) {
        noteKeys = Object.keys(origin);
        return noteKeys.includes(key);
    };

    return Object.keys(obj).every(containsIn);
}

module.exports.Note = Note;
module.exports.NoteSmall = NoteSmall;
module.exports.validate = validate;