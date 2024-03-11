from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from ..models import User, Project
import json
from flask import request


class FollowedRepositories(Resource):


    def get(self):
        req_data = json.loads(request.headers.get('Authorization'))
        print(request.headers)
        current_user = req_data.get('login')
        github_access_token = req_data.get('token')
        print(current_user)
        print(github_access_token)
        _user = User.objects(username=current_user, github_access_token=github_access_token).first()
        if not _user:
            return "Unauthorized Access", 403

        project_list = Project.objects(project_name__in=_user.followed_projects)

        return_list = []
        for project in project_list:
            if project["last_updated_time"]:
                updated = project["last_updated_time"].strftime("%m/%d/%Y")
            else:
                updated = "Never"

            return_list.append(
                {
                    "language": project["language"],
                    "description": project["description"],
                    "timesForked": project["fork_number"],
                    "repo": project["project_name"],
                    "updated": updated,
                }
            )
        return return_list

    def delete(self):
        req_data = request.get_json()
        repo = req_data.get("repo")
        auth_data = json.loads(request.headers.get('Authorization'))
        current_user = auth_data.get('login')
        github_access_token = auth_data.get('token')
        _user = User.objects(username=current_user, github_access_token=github_access_token).first()
        if not _user:
            return "Unauthorized Access", 403
        _user.update(pull__followed_projects=repo)
        _user.save()
        return True
