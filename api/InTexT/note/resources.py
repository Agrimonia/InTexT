from flask_restful import Resource
from flask import request
from InTexT.note.models import Note
from flask_login import login_required, current_user


class NoteCreate(Resource):
    @login_required
    def post(self):
        note = Note()
        args = {}
        args['note_title'] = request.json.get('note_title', False)
        args['author'] = current_user.id
        args['content'] = request.json.get('content', False)
        args['global_id'] = request.json.get('global_id', False)
        args['template'] = request.json.get('template', False)
        try:
            note.save(args)
            return {'message': 'Note was created'}
        except:
            return {'message': 'Something went wrong'}, 500


class NoteUpdate(Resource):
    @login_required
    def post(self):
        args = {}
        args['global_id'] = request.json.get('global_id', False)
        if request.json.get('content', False):
            args['content'] = request.json.get('content', False)
        if request.json.get('note_title', False):
            args['note_title'] = request.json.get('note_title', False)
        note = Note()
        try:
            note.update(args)
            return {'message': 'Note was updated'}
        except:
            return {'message': 'Something went wrong'}, 500


class NoteDelete(Resource):
    @login_required
    def post(self):
        args = {}
        args['global_id'] = request.json.get('global_id', False)
        print(args)
        note = Note()
        try:
            note.delete(args)
            return {'message': 'Note was deleted'}
        except:
            return {'message': 'Something went wrong'}, 500


class NoteSearch(Resource):
    @login_required
    def get(self, global_id):
        note = Note()
        data = note.getnote(global_id)

        if data:
            return data
        else:
            return {'message': 'Something went wrong'}, 500
