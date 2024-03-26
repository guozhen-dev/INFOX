from flask_restful import Resource
from flask import current_app
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from ..models import User, ProjectFork
from ..analyse.openai_api import request_external_llm, request_external_llm_fork
import json
from flask import request


class Chat(Resource):
    def post(self):
        auth_data = json.loads(request.headers.get('Authorization'))
        current_user = auth_data.get('login')
        github_access_token = auth_data.get('token')
        request_data = json.loads(request.data)
        _user = User.objects(username=current_user, github_access_token=github_access_token).first()
        if not _user:
            return "Unauthorized Access", 403
        if 'fork' not in request_data:
            pf = ProjectFork.objects(project_name="/"+request_data['repo'])
            result = request_external_llm(request_data['repo'], pf.to_json(), request_data['message'])
            return {"message": result}
        else:
            fork_diff_path = current_app.config["LOCAL_DATA_PATH"] + "/" + request_data['repo'] + "/" + request_data['fork'].split("/")[0] +"/diff_result.json"
            fork_diff = ''
            with open(fork_diff_path, 'r') as fd:
                fork_diff=fd.read()
            result = request_external_llm_fork(request_data['repo'], request_data['fork'], fork_diff, request_data['message'])
            return {"message": result}
