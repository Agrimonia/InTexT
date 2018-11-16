from flask_restful import Resource, reqparse
from flask import session
from InTexT.user.models import User
from flask_login import login_user, logout_user, login_required
from InTexT.user.encrypt import decrypt


login_parser = reqparse.RequestParser()
login_parser.add_argument('username', help='This field cannot be blank', required=True)
login_parser.add_argument('password', help='This field cannot be blank', required=True)


class UserRegistration(Resource):
    def post(self):
        data = login_parser.parse_args()

        if User.find_by_username(data['username']):
            return {'message': 'User {} already exists'.format(data['username'])}

        new_user = User(
            username=data['username'],
            password=User.generate_hash(data['password'])
        )

        try:
            new_user.save_to_db()
            return {
                'message': 'User {} was created'.format(data['username']),
            }
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):
    def post(self):
        args = login_parser.parse_args()
        user = User.query.filter_by(username=args['username']).first()
        if user:
            if decrypt(args['password'], user.password):
                login_user(user)

                return {'token': session['_id']}, 200
            else:
                return {'message': {'password': 'password is wrong'}}, 400
        else:
            return {'message': {'username': 'no user'}}, 400


class UserLogout(Resource):
    @login_required
    def get(self):
        logout_user()
        return {'status': 200}
