from InTexT import db
import time


def get_time():
    lt = time.localtime()
    noon = time.strftime("%p", lt)
    if noon == "PM":
        st = time.strftime("%Y/%m/%d %H:%M", lt)
    else:
        st = time.strftime("%Y/%m/%d %H:%M", lt)
    return st


class Note(db.Model):
    __tablename__ = 'notes'

    note_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=True)
    note_title = db.Column(db.String(80), nullable=False)
    author = db.Column(db.Integer, db.ForeignKey('users.id'))
    create_time = db.Column(db.String(30), nullable=False)
    update_time = db.Column(db.String(30))
    is_del = db.Column(db.Boolean, nullable=False)
    global_id = db.Column(db.String(21), nullable=True)
    template = db.Column(db.String(30), nullable=False)

    def save(self, args):
        self.note_title = args['note_title']
        self.author = args['author']
        self.content = args['content']
        self.global_id = args['global_id']
        self.template = args['template']
        self.create_time = get_time()
        self.update_time = get_time()
        self.is_del = 0

        db.session.add(self)
        db.session.commit()

    def delete(self, args):
        note = Note.query.filter_by(global_id=args['global_id']).first()
        # print(args['global_id'])
        note.is_del = 1

        db.session.commit()

    def update(self, args):
        note = Note.query.filter_by(global_id=args['global_id']).first()
        if 'content' in args:
            note.content = args['content']
        if 'note_title' in args:
            note.note_title = args['note_title']
        note.update_time = get_time()
        db.session.commit()

    def getnote(self, global_id):
        note = Note.query.filter_by(global_id=global_id).first()
        content = str(note.content)
        note_title = str(note.note_title)
        update_time = str(note.update_time)
        create_time = str(note.create_time)
        author = str(note.author)
        is_del = str(note.is_del)
        template = str(note.template)

        data = {"content": content, "note_title": note_title, "update_time": update_time,
                "create_time": create_time, "author": author, "is_del": is_del, "template": template}

        return data

