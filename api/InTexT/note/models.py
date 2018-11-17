from InTexT import db
from datetime import datetime


class Note(db.Model):
    __tablename__ = 'notes'

    note_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=True)
    notetitle = db.Column(db.String(80), nullable=False)
    author = db.Column(db.String(20), db.ForeignKey('users.username'))
    createtime = db.Column(db.String(30), nullable=False)
    updatetime = db.Column(db.String(30))
    isdel = db.Column(db.Boolean, nullable=False)
    global_id = db.Column(db.Integer, nullable=True)

    def save(self, args):
        self.notetitle = args['notetitle']
        self.author = args['author']
        self.content = args['content']
        self.global_id = args['global_id']
        self.createtime = datetime.now()
        self.isdel = 0

        db.session.add(self)
        db.session.commit()

    def delete(args):
        note = Note.query.filter_by(global_id=args['global_id']).first()
        note.isdel = 1

        db.session.commit()

    def update(args):
        note = Note.query.filter_by(global_id=args['global_id']).first()
        note.content = args['content']
        note.notetitle = args['notetitle']
        note.updatetime = datetime.now()

        db.session.commit()

    def getnote(self, global_id):
        note = Note.query.filter_by(global_id=global_id).first()
        content = str(note.content)
        notetitle = str(note.notetitle)
        updatetime = str(note.updatetime)
        createtime = str(note.createtime)
        author = str(note.author)
        isdel = str(note.isdel)

        data = {"content": content, "notetitle": notetitle, "updatetime": updatetime,
                "createtime": createtime, "author": author, "isdel": isdel}

        return data
