#!/usr/bin/env python3

from flask import Flask, jsonify
from flask import make_response, abort, request
from flask_jwt_extended import ( 
        create_access_token,get_jwt,get_jwt_identity, 
        unset_jwt_cookies, jwt_required, JWTManager, 
        set_access_cookies, set_refresh_cookies, create_refresh_token 
)
import psycopg2

class User:
    
    database="hiconf"
    user="postgres"
    password="postgres"
    host="localhost"
    port=5432

    def __init__ ( self ):
        try:
            email = request.json['email']
            password = request.json['password']
            conn = psycopg2.connect ( database=self.database, user=self.user, password=self.password, host=self.host, port=self.port )
            cur = conn.cursor()
            cur.execute ( "select * from _users.users;" )
            queue = cur.fetchall()

            for row in queue:
                if row[1] == str(email):
                    print ( "EMAIL:", row[1], email )
                    if row[2] == str(password):
                        print ( "PASS: ", row[2], password )
                        self.__ui = row[0]
                        r = row[0]
                    else:
                        self.__ui = None
                        r = None
                    break

            conn.close()
        except:
            self.__ui = None
    
    def get_user_id( self ):
        return self.__ui

    def set_token_user( self ):
        response = jsonify ( { 'login': True }, 201 )
        access_token = create_access_token ( identity=self.__ui)
        refresh_token = create_refresh_token ( identity=self.__ui )
        set_access_cookies ( response, access_token )

        return response
    
    def uset_jwt():
        try:
            response = jsonify ( { 'logout': True } )
            unset_jwt_cookies ( response )
            return response
        except:
            return None

    def print_ui ( self ):
        print ( self.__ui )

def registration():
    email = request.json['email']
    password = request.json['password']
    r = True

    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor ()
        cur.execute ( "select * from _users.users;" )
        queue = cur.fetchall()
        
        for row in queue:
            if row[1] == email: 
                r = False
                break;
        print ( "A nihuya: ", r )
        if r is True:   
            cur.execute("INSERT INTO _users.users ( mail, password ) VALUES ( %s, %s );", ( email, password ) ) 
            conn.commit()
        else:
            r = False

    except Exception as e:
        print ( "Ebat': ", e )
        return False
    
    finally:
        conn.close()
        return r

def get_enter_user():
    email = request.json['email']
    password = request.json['password']
    r = None

    try:
        print ( "Conn" )
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor ()
        print ( "Curs" )
        cur.execute ( "select * from _users.users;" )
        print ( "execute" )
        queue = cur.fetchall()
        print ( "fetchall" )
    
        print ( str(email) )
        for row in queue:
            print ( row[1] )
            if row[1] == str(email):
                print ( "EMAIL:", row[1], email )
                print ( "PASS: ", row[2], password )
                if row[2] == str(password):
                    print ( "PASS: ", row[2], password )
                    r = row[0]

        print ( r )
        conn.close()
        return r
    except:
        return r
    


#if __name__ == "__main__":
#    user = User()
