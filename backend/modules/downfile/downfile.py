#!/usr/bin/env python3

import os
import psycopg2
from flask import Flask, flash, request, redirect, url_for,  send_from_directory , url_for
from werkzeug.utils import secure_filename

def allowed_file ( filename, aex ):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in aex

def mkdir ( path ):
    os.system ( "mkdir -p " + path )

def upload_file( user_id, id_conference, aex ):
    pth = './modules/downfile/source'
    path = pth + '/' + str(user_id)

    print ( path )

    if 'file' not in request.files:
        print ( "file not in request.file" )
        return None
    else:
        file = request.files['file']

    if file.filename == '':
        print ( "filename is empty" )
        return None
    else:
        filename = file.filename
        print ( filename )
        
    try:
        if file and allowed_file(file.filename, aex):
            filename = secure_filename ( filename )
            mkdir ( path )
            file.save( os.path.join(path, filename ))
            
        conn = psycopg2.connect(database="hiconf", user="postgres",password="postgres",host="localhost",port=5432)
        cur=conn.cursor()
        cur.execute("INSERT into _users.articles ( id_conf, id_user, name, path ) VALUES (%s, %s, %s, %s);", ( id_conference, user_id, filename, path) )
        conn.commit()
        conn.close()
    
        return True
    
    except Exception as e:
        print ( "UPLOAD file\t", e )
        return None
        


def get_file_db( user_id, id_conference ):
    
    info = {}

    try:
        conn = psycopg2.connect(database="hiconf", user="postgres",password="postgres",host="localhost",port=5432)
        cur=conn.cursor()
        cur.execute("SELECT name, path FROM _users.articles WHERE id_conf=%s AND id_user=%s", ( id_conference, user_id ) )
        db = cur.fetchone()
        print ( db )
        downdir = db[1]
        filename = db[0]
     
        info = {
            "downdir": downdir,
            "filename": filename
        }
        print ( info )
        #return send_from_directory(downdir, filename)
        return info

    except Exception as e:
        print ( "Download file\t", e )
        return None

def get_file_rewiever_db( conf, part ):
    
    info = {}

    try:
        conn = psycopg2.connect(database="hiconf", user="postgres",password="postgres",host="localhost",port=5432)
        cur=conn.cursor()
        cur.execute("SELECT name, path FROM _users.articles WHERE id_conf=%s AND id_user=%s", ( conf, part ) )
        db = cur.fetchone()
        print ( db )
        downdir = db[1]
        filename = db[0]
     
        info = {
            "downdir": downdir,
            "filename": filename
        }
        print ( info )
        #return send_from_directory(downdir, filename)
        return info

    except Exception as e:
        print ( "Download file\t", e )
        return None




