
import requests
from datetime import datetime
from flask import request, current_app
from flask_restful import Resource
from urllib.parse import urlparse
import json
# from ..models import User, Project, Permission, login_manager
from ..models import *
from ..analyse import project_updater 
from ..analyse.analyser import check_waiting_list, get_active_forks


def db_delete_project(project_name):
    Project.objects(project_name=project_name).delete()
    ProjectFork.objects(project_name=project_name).delete()
    ChangedFile.objects(project_name=project_name).delete()


def db_find_project(project_name):
    return Project.objects(project_name=project_name).first()


def db_followed_project(user, project_name):
    if project_name not in user.followed_projects:
        User.objects(username=user.username).update_one(
            push__followed_projects=project_name
        )
    # Update project followed time
    tmp_dict = user.followed_projects_time
    tmp_dict[project_name] = datetime.utcnow()
    User.objects(username=user.username).update_one(
        set__followed_projects_time=tmp_dict
    )


def add_repo(username, repo, repo_info, access_token):
    User.objects(username=username).update_one(push_all__repo_waiting_list=[repo])

    # First updata for quick view.
    project_updater.project_init(repo, repo_info)
    forks_info = get_active_forks(repo,access_token)
    project_updater.start_update(repo, repo_info, forks_info)
    app = current_app._get_current_object()

    with app.app_context():
        check_waiting_list.delay(username)


class FollowRepository(Resource):
    def __init__(self):
        pass

    def post(self):
        print(request.data)
        req_data = json.loads(request.data)
        repo = urlparse(req_data.get("git_url")).path

        current_user = req_data['user_info']['login']
        _user = User.objects(username=current_user).first()
        request_url = "https://api.github.com/repos%s" % repo
        res = requests.get(
            url=request_url,
            headers={
                "Accept": "application/json",
                "Authorization": "Bearer {}".format(_user.github_access_token),
            },
        )

        if res.status_code != 200:
            raise AssertionError

        res = res.json()


        # If the repo exists then we delete the repo in the database
        # Otherwise, if repo doesn't exist or even after we delete, we hav r
        if db_find_project(repo) is not None:
            db_delete_project(repo)
        add_repo(_user.username, repo, res, _user.github_access_token)
        # add_repo(_user.username, repo, res, _user.github_access_token)
        db_followed_project(_user, repo)
        msg = "The repo (%s) starts loading into INFOX. We will send you an email when it is finished. Please wait." % repo

        project_list = Project.objects(
            project_name__nin=_user.followed_projects,
            activate_fork_number__ne=-1,
            analyser_progress="100%",
        )

        return {
            "msg": msg,
            "repo": {
                "language": res["language"],
                "description": res["description"],
                "timesForked": res["forks_count"],
                "repo": res["full_name"],
            },
        }
