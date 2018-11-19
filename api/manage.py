from flask_script import Manager
from InTexT import app
from InTexT import db
from InTexT.user.models import User


manager = Manager(app)


@manager.command
def db_create():
    try:
        db.create_all()
        print('you had create db')
    except:
        print('error!')


@manager.command
def load_test_users():
    user = User()
    args = {}
    args['username'] = 'testuser'
    args['password'] = '123456'
    args['email'] = 'testuser@example.com'

    try:
        user.save(args)
    except:
        print(args['username'], ' load error!')

    print('load over!')


if __name__ == '__main__':
    manager.run()
