#!/usr/bin/env python3

from modules.user.user import User
from modules.user.user import registration, get_enter_user
from modules.conferences.conferences import get_list_conferences, add_new_conf, reg_to_conf
from werkzeug.utils import secure_filename
from modules.memrole.memrole import (
    get_atri_reviewer, get_atri_participant, new_comment, get_list_admin,
    admin_confirm_role
)
from modules.downfile.downfile import (
    upload_file, get_file_db, get_file_rewiever_db
)
from datetime import timedelta, datetime, timezone
from flask import ( 
        Flask, jsonify, redirect, 
        make_response, abort, request,
        send_from_directory
)
from flask_jwt_extended import ( 
        create_access_token,get_jwt,get_jwt_identity, 
        unset_jwt_cookies, jwt_required, JWTManager, 
        set_access_cookies, set_refresh_cookies, create_refresh_token 
)
from flask_cors import CORS

UPLOAD_FOLDER = '/storage'
ALLOWED_EXTENSIONS = {'pdf', 'docx' }

app = Flask ( __name__ )
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_ACCESS_COOKIE_PATH"] = '/'
app.config["JWT_SECRET_KEY"] = "Zdratute"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta ( hours=1 )

jwt = JWTManager ( app )

users = {}

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        new = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(new + timedelta ( minutes=30 ) )
        if target_timestamp > exp_timestamp:
            access_token = create_access_token ( identity=get_jwt_identity())
            refresh_token = create_refresh_token ( identity=get_jwt_identity() )
            set_access_cookies ( response, access_token )
            set_refresh_cookies ( response, refresh_token )
        return response
    except ( RuntimeError, KeyError):
        return response

@app.route ( '/', methods=["GET", "POST"] )
def main_page():
    return jsonify ( { "msg": "Nice cock bro" } )

@app.route ( '/profile', methods=["GET"] )
@jwt_required()
def profile_user():
    user = get_jwt_identity()
    user = users[str(user)]
    

@app.route ( '/login', methods=['POST'] )
def login_user():
    user = User()
    ui = user.get_user_id()
    if ui is None:
        return make_response ( jsonify ( { 'login': False } ), 401 )
    else:
        users[str(ui)] = user
        response = user.set_token_user()
        print ( response )
        return response, 201

#TODO - поменять на гет
@app.route ( '/logout', methods=['POST'] )
@jwt_required()
def logout():
    try:
        response = jsonify ( { 'logout': True } )
        unset_jwt_cookies ( response )
        return response, 201
    except:
        response = jsonify ( { 'logout': False } )
        return response, 401

@app.route ( '/reg', methods=['POST'] )
def create_user():
    if registration() is not False:
        response = make_response ( jsonify ( {"registration": 'success'} ), 201 )
        return response 
    else:
        response = make_response ( jsonify ( {"registration": 'error'} ), 402 )
        return response 

@app.route ( '/conflist', methods=['GET'] )
@jwt_required()
def print_user_conferences():
    current_user = get_jwt_identity()
    if current_user is None:
        return make_response ( jsonify ( { "conflist": "Authorisation Error!"} ), 401 )
    else:
        ConfList = get_list_conferences ( current_user )
        if ConfList is None:
            return make_response ( jsonify ( { "" } ), 200 )
        else:
            return make_response ( jsonify ( { "list": ConfList } ), 200 )

@app.route ( '/addconf', methods=['POST'] )
@jwt_required()
def add_conf():
    print ( "pizda" )
    current_user = get_jwt_identity()
    print ( "pizda" )
    if current_user is None:
        print ( "smert" )
        return make_response ( jsonify ( { "msg:": "Error" } ), 401 )
    else:
        if add_new_conf( current_user ) is None:
            print ( "pizda" )
            return make_response ( jsonify ( { "msg": "Error" } ), 400 ) 
        else:
            print ( "huita" )
            return make_response ( jsonify ( { "msg": "Successful!" } ), 200 )

@app.route ( '/joinconf/<int:id_conference>', methods=['POST'] )
@jwt_required()
def registration_to_conf( id_conference ):
    current_user = get_jwt_identity()
    print ( current_user )
    if current_user is None:
        print ( "NU RADI PRILICHIYA EBANY AUTH" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        if reg_to_conf( current_user, id_conference ) is None:
            print ( "EBAT' TI USER" )
            return make_response ( jsonify ( { "Registration": "Error" } ), 400 )
        else:
            print ( "EBANINA HELP" )
            return make_response ( jsonify ( { "Registration": "Success"} ), 200 )

@app.route ( '/participant', methods=['GET'] )
@jwt_required()
def get_participant( ):
    current_user = get_jwt_identity()
    id_conference = request.args.get ( 'id_conference' )
    print ( id_conference )
    print ( "current user:\t", current_user )
    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        participant = get_atri_participant ( current_user, id_conference )
        if participant is None:
            print ( "Participant fault" )
            return make_response ( jsonify ( { "Get info": "Error" } ), 402 )
        else:
            print ( "Participant success" )
            return make_response ( jsonify ( { "info": participant } ), 200 )

#Рецензент
@app.route ( '/reviewer', methods=['GET'] )
@jwt_required()
def get_reviewer():
    current_user = get_jwt_identity()
    id_conference = request.args.get ( 'id_conference' )

    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        reviewer = get_atri_reviewer( current_user, id_conference )
        if reviewer is None:
            print ( "Reviewer fault" )
            return make_response ( jsonify ( { "Get info": "Error" } ), 402 )
        else:
            print ( "Reviewer success" )
            return make_response ( jsonify ( { "Reviewer": reviewer } ), 200 )

#Добавление комментария
@app.route ( '/confirmcomment', methods=['POST'] )
@jwt_required()
def confirm_comment():
    current_user = get_jwt_identity()

    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        sucs = new_comment()
        if sucs is None:
            print ( "sucs fault" )
            return make_response ( jsonify ( { "Comment": "Error" } ), 402 )
        else:
            print ( "success" )
            return make_response ( jsonify ( { "Comment": "Success" } ), 200 )

#Admin
@app.route ( '/admin', methods=['GET'] )
@jwt_required()
def get_admin():
    current_user = get_jwt_identity()
    id_conference = request.args.get ( 'id_conference' )
    print ( id_conference )
    print ( current_user )

    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        UserList = get_list_admin( id_conference, current_user )
        
        if UserList is None:
            print ( "User List clear" )
            return make_response ( jsonify ( { "User List": "Error" } ), 402 )
        else:
            print ( "User List ne clear" )
            return make_response ( jsonify ( { "Participants": UserList } ), 200 )

#Запрос на изменение роли 
@app.route ( '/confirmrole', methods=['POST'] )
@jwt_required()
def confirm_role():
    current_user = get_jwt_identity()

    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        sucs = admin_confirm_role()
        if sucs is None:
            print ( "sucs fault" )
            return make_response ( jsonify ( { "Comment": "Error" } ), 402 )
        else:
            print ( "success" )
            return make_response ( jsonify ( { "Comment": "Success" } ), 200 )

#отправка файла
@app.route ( '/confirmFile/<int:id_conference>', methods=['POST'])
@jwt_required()
def confirm_file( id_conference ):
    current_user = get_jwt_identity()
    print ( "id_conference: ", id_conference )
    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        if upload_file( current_user, id_conference, ALLOWED_EXTENSIONS ) is None:
            print ( "Download FILE FAULT" )
            return make_response ( jsonify ( { "Download": "error" } ), 402 )
        else:
            print ( "Download FILE SUCCESS" )
            return make_response ( jsonify ( { "Download": "success" } ), 200 )

@app.route ( '/downloadfile/<int:id_conference>', methods=['GET'] )
@jwt_required()
def get_file( id_conference ):
    current_user = get_jwt_identity()

    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        info = get_file_db ( current_user, id_conference )
        if info is None:
            print ( "UPLOAD FILE FAULT" )
            return make_response ( jsonify ( { "Upload": "error" } ), 402 )
        else:
            print ( "UPLOAD FILE SUCCESS" )
            return send_from_directory ( info['downdir'], info['filename'] )

@app.route ( '/articleRewiever', methods=['GET'] )
@jwt_required()
def get_file_rewiever( ):
    current_user = get_jwt_identity()

    id_conference = request.args.get('conf')
    id_participant = request.args.get('part')

    if current_user is None:
        print ( "Current user fault" )
        return make_response ( jsonify ( { "Auth": "Error" } ), 401 )
    else:
        info = get_file_rewiever_db ( id_conference, id_participant )
        if info is None:
            print ( "UPLOAD FILE FAULT" )
            return make_response ( jsonify ( { "Upload": "error" } ), 402 )
        else:
            print ( "UPLOAD FILE SUCCESS" )
            return send_from_directory ( info['downdir'], info['filename'] )


@jwt.unauthorized_loader
def unauthorized_callback(callback):
    # No auth header
    return redirect('/', 302)

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    # Invalid Fresh/Non-Fresh Access token in auth header
    resp = make_response(redirect('/'))
    unset_jwt_cookies(resp)
    return resp, 302

@jwt.expired_token_loader
def expired_token_callback(callback):
    # Expired auth header
    resp = make_response(redirect(app.config['BASE_URL'] + '/token/refresh'))
    unset_access_cookies(resp)
    return resp, 302

@app.route('/token/refresh', methods=['GET'])
def refresh():
    # Refreshing expired Access token
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=str(user_id))
    resp = make_response(redirect('/', 302))
    set_access_cookies(resp, access_token)
    return resp

if __name__ == '__main__':
    app.run ( debug=True )
