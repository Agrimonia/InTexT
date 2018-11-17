from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_login import LoginManager
from flask_docs import ApiDoc

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
app.config.from_pyfile('config.py')
app.config['RESTFUL_API_DOC_EXCLUDE'] = []
db = SQLAlchemy(app)
api = Api(app)
ApiDoc(app)

login_manager = LoginManager()
login_manager.init_app(app)


@app.before_first_request
def create_tables():
    db.create_all()


from InTexT.user.models import User


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


import InTexT.user.resources
import InTexT.note.resources

api.add_resource(InTexT.user.resources.UserRegistration, '/api/register')
api.add_resource(InTexT.user.resources.UserLogin, '/api/login')
api.add_resource(InTexT.user.resources.UserLogout, '/api/logout')
api.add_resource(InTexT.note.resources.NoteCreate, '/api/note/create')
api.add_resource(InTexT.note.resources.NoteUpdate, '/api/note/update')
api.add_resource(InTexT.note.resources.NoteDelete, '/api/note/delete')
api.add_resource(InTexT.note.resources.NoteSearch, '/api/note/<string:global_id>')
