from flask_script import Manager
from InTexT import app
from InTexT import db
from InTexT.user.models import User
from InTexT.note.models import Note


manager = Manager(app)


@manager.command
def db_create():
    try:
        db.create_all()
        print('db created!')
    except:
        print('error!')

    user = User()
    test_user = {}
    test_user['username'] = 'testuser'
    test_user['password'] = '123456'
    test_user['email'] = 'testuser@example.com'

    user.save(test_user)

    note = Note()
    test_note = {}
    for i in [0, 4]:
        test_note['note_title'] = 'note' + str(i)
        test_note['content'] = 'test'
        test_note['global_id'] = str(i)
        test_note['templet'] = '1'
    note.save(test_note)
    test_note = {}
    for i in [5, 10]:
        test_note['note_title'] = 'note' + str(i)
        test_note['content'] = 'test'
        test_note['global_id'] = str(i)
        test_note['templet'] = '2'
    note.save(test_note)

    print('load over!')


if __name__ == '__main__':
    manager.run()
