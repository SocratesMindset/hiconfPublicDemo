#!/usr/bin/env python3

from flask import Flask, jsonify
from flask import make_response, abort
from flask import request
import psycopg2

def get_list_conferences( user_id ):
    
    del_symb = "(,')"
    rc = None
    conferences = []
    member = {}
    
    print ( user_id )

    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()
        cur.execute ( "SELECT * FROM _users.members WHERE id_user = %s;", ( user_id, ) )
        queue = cur.fetchall()
        
        for row in queue:
            cur.execute ( "select id, title from _users.conferences where id = %s;", ( row[2], ) ) 
            title = cur.fetchone()
            id_conf = title[0]
            title = title[1]

            cur.execute ( "select title from _users.sections where id = %s;", ( row[3], ) )
            section = cur.fetchone()
            cur.execute ( "select id, role from _users.roles where id = %s;", ( row[4], ) )
            role = cur.fetchone()
            id_role = role[0]
            role = role[1]
 
            print ( title, section, role )
            for symb in del_symb:
                title = str(title).replace ( symb, "" ) 
                section = str(section).replace ( symb, "" )
                role = str(role).replace ( symb, "" )
            
            print ( title, section, role )
            print ("before mem: ", member )
            member = {
                    "id_conference": id_conf,
                    "id_role": id_role,
                    "title": title,
                    "section": section,
                    "role": role
            }
            print ("after mem: ", member )

            print ("before conf: ", conferences )
            conferences.append ( member )
            print ( "after conf: ", conferences )

        conn.close()
        print ( "conferences:\t", conferences )
        return conferences
        
    except Exception as e:
        print ( e )
        return None

def add_new_conf( user_id ):
    print ( user_id )
    title = request.json['title']
    sections = request.json['section']
    date = request.json['date']
    id_role = 1
    
    del_symb = "(,')[]"
    
    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()
        cur.execute ( "select MAX(id) from _users.conferences;" )
        id_conf = cur.fetchone()
        
        id_conf = id_conf[0]

        if id_conf is None:
            id_conf = 0
        
        
        print ( id_conf )
        id_conf = int(id_conf) + 1
        print ( id_conf )
        
        cur.execute ( "select MAX(id) from _users.sections;" )
        id_sec = cur.fetchone()
        id_sec = id_sec[0]

        if id_sec is None:
            id_sec = 0

        id_sec = int(id_sec) + 1
        
        cur.execute ( "select MAX(id) from _users.members;" )
        id_mem = cur.fetchone()
        id_mem = id_mem[0]

        if id_mem is None:
            id_mem = 0
        
        print ( "id_mem ", id_mem )
        
        id_mem = int(id_mem) + 1
 
        print ("sections: ", sections )
    
        cur.execute ( "INSERT INTO _users.sections ( id, title ) VALUES ( %s, %s );", ( id_sec, sections ) )
        conn.commit()
        
        cur.execute ( "INSERT INTO _users.conferences ( id, title, date, section ) VALUES ( %s, %s, %s, %s );", ( id_conf, title, date, id_sec ) )
        print ( "cur.execute" )
        conn.commit()
        print ( "conn commit" )
        
        

        cur.execute ( "INSERT INTO _users.members ( id, id_user, id_conf, id_sec, id_role ) values ( %s, %s, %s, %s, %s );", ( id_sec, user_id, id_conf, id_sec, id_role ) )
        conn.commit()

        conn.close()
        return 1

    except Exception as e:
        print ( "/addconf\t", e )
        return None

def reg_to_conf( id_user, id_conf ):
    print ( request.json )
    name = request.json['name']
    email = request.json['email']
    #id_conf = request.json['id_conference']
    id_role = 3 # 1 - admin 2 - reviewer 3 - participant 
    


    try:
        conn = psycopg2.connect ( database="hiconf", user="postgres", password="postgres", host="localhost", port=5432 )
        cur = conn.cursor()
    
        cur.execute ( "INSERT INTO _users.registration ( id_user, id_conf, name, email ) VALUES ( %s, %s, %s, %s );", ( id_user, id_conf, name, email) )
        conn.commit()

        cur.execute ( "select section from _users.conferences where id=%s;", ( id_conf, ) )
        id_sec = cur.fetchone()
        id_sec = id_sec[0]
        print ( id_sec )
        if id_sec is None:
            id_sec = 0

        cur.execute ( "INSERT INTO _users.members ( id_user, id_conf, id_sec, id_role ) VALUES ( %s, %s, %s, %s );", ( id_user, id_conf, id_sec, id_role) )
        conn.commit()

        conn.close()
        
        return 1

    except Exception as e:
        print ( "REG TO CONF\t", e )
        return None


#if __name__ == "__main__":
#    get_list_conferences ( 10 )
