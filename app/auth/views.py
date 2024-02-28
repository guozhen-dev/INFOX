# -*- coding: utf-8 -*-
from datetime import datetime
from flask import g, render_template, redirect, request, url_for, flash, current_app
from flask_login import login_user, logout_user, login_required, current_user
import datetime

import requests
import base64
import json
from . import auth
from .. import github, db 
from ..models import User, Permission
from ..analyse.util import localfile_tool
from dotenv import load_dotenv
import os

@auth.route("/login", methods=["GET", "POST"])
def login():
    # Client login with a token
    code = request.args.get("code")
    if code:
        # we got a code let's exchange it for an access token
        load_dotenv()
        data = {
            "client_id": "8a79ee6701d1e06c6c58",
            "client_secret": os.getenv('GH_SECRET'),
            "code": code,
        }
        # exchange the 'code' for an access token
        res = requests.post(
            url="https://github.com/login/oauth/access_token",
            data=data,
            headers={"Accept": "application/json"},
        )
        res_json = res.json()
        access_token = res_json["access_token"]

        # get the user details using the access token
        res = requests.get(
            url="https://api.github.com/user",
            headers={
                "Accept": "application/json",
                "Authorization": "token {}".format(access_token),
            },
        )
        if res.status_code != 200:
            raise AssertionError
        res_json = res.json()
        print(res_json)
    extension_id = "bhnejeodnednfpfclmdkcgcokcahejjb"
    return_body = {
        "username": res_json['name'],
        "login": res_json['login'],
        "token": access_token
    }
    # now we encode the return body to send it back to the client
    return_data = base64.b64encode(json.dumps(return_body).encode('ascii')).decode('ascii')

    # Now we check if the user exists
    user = User.objects(username=res_json['login']).first()
    if user:
        user.github_access_token = access_token
        user.last_seen = datetime.datetime.now()
        user.save()
    # Otherwise, we create a new user.
    else:
        new_user = User()
        new_user.username = res_json['login']
        new_user.github_access_token = access_token
        new_user.last_seen = datetime.datetime.now()
        new_user.save()

    return redirect(f"https://{extension_id}.chromiumapp.org/{return_data}", code=302)




@auth.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("main.start"))


@github.access_token_getter
def token_getter():
    if current_user.is_authenticated:
        # print("user token %s: %s" % (current_user.username, current_user.github_access_token))
        return current_user.github_access_token
    else:
        # print("token get from g! %s" % g.github_access_token)
        return g.get("github_access_token", None)


def get_user_repo_list(username):
    try:
        raw_data = github.request("GET", "users" + "/" + username + "/" + "repos", True)
        return [x["full_name"] for x in raw_data]
    except:
        pass
    return None


def get_upperstream_repo(repo):
    try:
        raw_data = github.request("GET", "repos" + "/" + repo)
        if raw_data["fork"] == True:
            # print("R=",raw_data["source"]["full_name"])
            return raw_data["source"]["full_name"]
    except:
        pass
    return None


@auth.route("/callback", methods=["GET", "POST"])
@github.authorized_handler
def github_login(access_token):
    g.github_access_token = access_token
    _github_user_info = github.get("user")
    _github_username = _github_user_info["login"]
    _github_user_email_list = github.get("user/emails")
    _github_user_email = None
    for email in _github_user_email_list:
        if email["primary"]:
            _github_user_email = email["email"]
    if _github_user_email is None:
        for email in _github_user_email_list:
            if "noreply" not in email["email"]:
                _github_user_email = email["email"]

    _user = User.objects(username=_github_username).first()
    if _user is None:
        User(
            username=_github_username,
            email=_github_user_email,
            permission=Permission.GITHUB_USER,
        ).save()
    User.objects(username=_github_username).update(github_access_token=access_token)
    User.objects(username=_github_username).update(last_seen=datetime.utcnow())
    _user = User.objects(username=_github_username).first()
    login_user(_user, True)

    # print("login acc=%s" % g.github_access_token)
    next_url = request.args.get("next") or url_for("main.index")
    return redirect(next_url)
