import hashlib
import uuid
import pymongo
import secrets
from flask import Flask, request, make_response, jsonify, redirect
from flask_cors import CORS
from bson.json_util import dumps
from bson.json_util import loads
from bson.objectid import ObjectId

TOKEN_SIZE_BYTES = 32

mongo = pymongo.MongoClient('mongo', 27017)
db = mongo.appdb
app = Flask(__name__)
CORS(app, supports_credentials=True)

# https://circleci.com/blog/authentication-decorators-flask/
def login_required(func):
    def _func_wrapper(*args, **kwargs):
        # checking database for authenticated user
        auth_token = request.cookies.get('auth_token')
        current_user = db.users.find_one({'auth_tokens': auth_token})
        if not current_user:
            return make_response({'message': 'Invalid credentials'}, 400)

        return func(current_user, *args, **kwargs)

    _func_wrapper.__name__ = func.__name__
    return _func_wrapper


@app.route('/register', methods=['POST'])
def register():
    # getting user data
    data = request.json
    if 'username' not in data or 'password' not in data:
        return make_response({'message': 'Invalid input'}, 400)

    username = data['username']
    password = data['password']

    # checking if existing user
    existing_user = db.users.find_one({'username': username})
    if existing_user:
        return make_response({'message': 'Existing username'}, 400)

    # hashing password
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)

    # inserting into database
    new_user = db.users.insert_one({'username': username, 'hashed_password': hashed_password, 'auth_tokens': [auth_token]})

    # returning result to user
    res = make_response({'message': 'User registered'}, 200)
    res.set_cookie('auth_token', auth_token)
    return res


@app.route('/login', methods=['POST'])
def login():
    # getting user data
    data = request.json
    if 'username' not in data or 'password' not in data:
        return make_response({'message': 'Invalid input'}, 400)

    username = data['username']
    password = data['password']

    # hashing password
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()

    # checking against database
    user = db.users.find_one({'username': username, 'hashed_password': hashed_password})
    if not user:
        return make_response({'message': 'Invalid username/password'}, 400)

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)
    db.users.update_one({'_id': user['_id']}, {'$push': {'auth_tokens': auth_token}})

    # returning result to user
    res = make_response({'message': 'User authenticated'})
    res.set_cookie('auth_token', auth_token)
    return res


@app.route('/myboards', methods=['GET'])
@login_required
def get_boards(current_user):
    boards = db.boards.find({'owner': current_user['username']}, {'_id': 0})
    return make_response({'boards': loads(dumps(boards))})


@app.route('/newboard', methods=['POST'])
@login_required
def new_board(current_user):
    new_id = str(uuid.uuid4())
    new_board = db.boards.insert_one({'owner': current_user['username'], 'name': 'Untitled Board', 'id': new_id})
    return make_response({'board_id': new_id})


@app.route('/boards/<board_id>', methods=['GET', 'POST'])
@login_required
def board(current_user, board_id):
    # getting the board from the database
    if request.method == 'GET':
        board = db.boards.find_one({'id': board_id}, {'_id': 0})
        if board:
            return make_response({'board': loads(dumps(board))})
        else:
            return make_response({'message': 'Could not retrieve board'}, 400)
    else:
        data = request.get_json()
        db.boards.update_one({'id': board_id}, {'$set': data['board']})
        return make_response({'message': 'Successfully updated board'})
