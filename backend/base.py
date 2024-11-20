#!/usr/bin/python3

from flask import Flask

api = Flask(__name__)

@api.route('/Registration')
def my_profile():
    response_body = {
        "name": "Nova",
        "about": "Hello"
    }
    return response_body
