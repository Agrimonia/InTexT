from flask_script import Manager
from InTexT import app
from InTexT.user.models import User

manager = Manager(app)


@manager.option('-n', '--number', dest='number', default='10')
def load_users(number):
    for i in range(0, int(number)):
        user = User()
        args = {}
        args['username'] = 'demo' + str(i)
        args['password'] = '123456'
        args['email'] = 'demo' + str(i) + '@example.com'

        try:
            user.save(args)
        except:
            print(args['username'], ' load eror!')
            continue

    print('load over!')


if __name__ == '__main__':
    manager.run()
