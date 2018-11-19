from flask_restful import Resource
from flask import session, request
from InTexT.user.models import User
from flask_login import login_user, logout_user, login_required, current_user
from InTexT.user.encrypt import decrypt


class UserRegistration(Resource):
    def post(self):
        if User.query.filter_by(username=request.json.get('username', False)).first():
            return {'message': 'User {} already exists'.format(request.json.get('username', False))}

        user = User()
        args = {}
        args['username'] = request.json.get('username', False)
        args['password'] = request.json.get('password', False)
        args['email'] = request.json.get('email', False)
        try:
            user.save(args)
            return {
                'message': 'User {} was created'.format(request.json.get('username', False)),
            }
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):
    def post(self):
        user = User.query.filter_by(username=request.json.get("username", False)).first()
        if user:
            if decrypt(request.json.get("password", False), user.password):
                login_user(user)

                return {'token': session['_id']}, 200
            else:
                return {'message': 'password is wrong'}, 400
        else:
            return {'message': 'no user'}, 400


class UserLogout(Resource):
    @login_required
    def get(self):
        logout_user()
        return {'status': 200}


class UserNotes(Resource):
    @login_required
    def get(self):
        note_list = current_user.user_notes.all()
        print(current_user.user_notes)
        notes = {}
        for note in note_list:
            name = note.global_id
            notes[name] = {"global_id": note.global_id, "note_title": note.note_title, "template": note.template,
                           "create_time": str(note.create_time), "update_time": str(note.update_time)}
        if note_list:
            return notes
        else:
            return {'message': 'Something went wrong'}, 500
