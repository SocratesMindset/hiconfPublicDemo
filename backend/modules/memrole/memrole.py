#!/usr/bin/env python3

from flask import Flask, jsonify
from flask import make_response, abort
from flask import request
import psycopg2

def get_atri_reviewer( user_id, id_conf ):

    participant = []

    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()
        cur.execute ( "select id_user, name, email from _users.registration where id_conf=%s;", ( id_conf, ) )
        queue = cur.fetchall()

        if queue is None:
            return None

        for prt in queue:
            id_part = prt[0]
            cur.execute ( "select name from _users.articles where id_conf=%s AND id_user=%s;", ( id_conf, id_part ) )
            article = cur.fetchone()
            if article is None:
                article = "Didn't submit an article"
            else:
                article = article[0]

            member = {
                "id_participant": id_part,
                "name": prt[1],
                "email": prt[2],
                "article": article
            }
            
            participant.append ( member )

        conn.close()

        return participant

    except Exception as e:
        print ( "get_arti_reviewer\t", e )
        return None

def new_comment():
    id_user = request.json["id_participant"]
    id_conf = request.json["id_conference"]
    msg = request.json["comment"]

    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()

        cur.execute ( "insert into _users.comment ( id_user, id_conf, comment ) values ( %s, %s, %s );", ( id_user, id_conf, msg ) )
        conn.commit()
        
        print ( "commit" )
        
        conn.close()
        return 1
    
    except Exception as e:

        print ( "new_comment\t", e )
        return None

def get_list_admin( id_conf, user_id ):
    
    participants = []

    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()
        cur.execute ( "select id_user, name, email from  _users.registration where id_conf=%s;", ( id_conf, ) )
        members = cur.fetchall()
        print ( "members:\t", members )


        if len(members) == 0:
            return members
        
        for mem in members:
            print ( "members:\t", members )
            cur.execute ( "select name from _users.articles where id_conf=%s AND id_user=%s;", ( id_conf, mem[0] ) )
            article = cur.fetchone()
            if article is None:
                article = "You didn't submit an article"
            else:
                article = article[0]
            print ( article )
            

            cur.execute ( "select id_role from _users.members where id_user=%s AND id_conf=%s;", ( mem[0], id_conf ) )
            id_role = cur.fetchone()
            id_role = id_role[0]

            print ( id_role )

            cur.execute ( "select role from _users.roles where id=%s;", ( id_role, ) )
            role = cur.fetchone()
            role = role[0]
            
            print ( role )

            part = {
                "id_user": mem[0],
                "id_role": id_role,
                "name": mem[1],
                "role": role,
                "email": mem[2],
                "atricle": article
            }
    
            print ( part )

            participants.append ( part )


        conn.close
        return participants

    except Exception as e:
        print ( "get_admin_list\t", e )
        return None
        
def get_atri_participant( user_id, id_conf ):
    print ( "HELLO WORLD" )
 #   id_conf = request.json["id_conference"]
    this_conf = []
    name_conf = {}

    print ( "HELLO WORLD" )
    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()
        cur.execute ( "select name, email, id_user from _users.registration where id_conf=%s AND id_user=%s;", ( id_conf, user_id ) )
        nm = cur.fetchone()
    
        name = nm[0]
        email = nm[1]
        ui = nm[2]
        print ( name, email, ui )
        
        cur.execute ( "select name from _users.articles where id_conf=%s AND id_user=%s;", ( id_conf, user_id ) )
        article = cur.fetchone()
        if article is None:
            article = "You didn't submit an article"
        else:
            article = article [ 0 ]


        print ( article )

        cur.execute ( "select comment from _users.comment where id_user=%s AND id_conf=%s;", ( user_id, id_conf ) )
        comm = cur.fetchone()
        if comm is None:
            comm = "You don't have a review"
        else:
            comm = comm[0]


        print ( comm )
        name_conf = {
            "id_user": ui,
            "name": name,
            "email": email,
            "article": article,
            "comment": comm
        }

        conn.close()
        this_conf.append(name_conf)
        print ( name_conf )
        print ( this_conf )

        return this_conf
    except Exception as e:
        print ( "get_atri_participant\t", e )
        return None

def admin_confirm_role():
    id_user = request.json["id_user"]
    new_role = request.json["select"]
    if new_role == "reviewer":
        new_role = 2
    else:
        new_role = 3
    id_conf = request.json["id_conference"]

    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()
        cur.execute ( "update _users.members set id_role=%s where id_user=%s and id_conf=%s;", ( new_role, id_user, id_conf ) )
        conn.commit()
        conn.close()

        return 1
    
    except Exception as e:
        print ( "admin_confirm_role", e )
        return None



