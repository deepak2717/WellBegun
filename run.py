#!/usr/bin/python3
import os
import json
from csv import reader
from jinja2 import Template
from github import Github
import os
# import git
from pprint import pprint

"""
Contributor : Deepak Kumar
Reviewer

Reads input request and creates the fragments to generate the code for API development

"""
# Read the the input file Parse the json and create the respective fragment structure
print("I am in script")
with open(f'../input/output.json', "r") as input_handle:
    input_data = json.load(input_handle)

# Get the Repo to be updated

token = os.getenv('GITHUB_TOKEN', 'xxxxxxxxx')
git_token = Github(token)
repo = git_token.get_repo(f'dsingh-devops/{input_data["REPO"]}')
  

#Prepare file to be updated in the Repo

def push(path, message, content, branch, update=False):
    author = "Srikant Bangalore"
    source = repo.get_branch("main")
    try: 
        branch_name = repo.get_branch(branch=input_data['BRANCH'])
        valid_branch = branch_name.name
    except:
        valid_branch = "Not present"

    if valid_branch == "Not present":
        repo.create_git_ref(ref=f"refs/heads/{input_data['BRANCH']}", sha=source.commit.sha)  # Create new branch from master
    if update:  # If file already exists, update it
        contents = repo.get_contents(path, ref=branch)  # Retrieve old file to get its SHA and path
        repo.update_file(contents.path, message, content, contents.sha, branch=branch)  # Add, commit and push branch
    else:  # If file doesn't exist, create it
        repo.create_file(path, message, content, branch=branch)  # Add, commit and push branch

with open(f'../conf/{input_data["REPO"]}/{input_data["ACTION"]}.csv', "r") as csv_file:
    csv_reader = reader(csv_file)
    for row in csv_reader:
      file = row[0]
      if row[1] != "":
        with open(row[2], "r") as fragfile:
          lines = fragfile.readlines()
          for line in lines:
              j2_template = Template(line)
              my_data = j2_template.render(input_data)
              file_from_master = repo.get_contents(row[0], ref="main")
              data = file_from_master.decoded_content.decode("utf-8")
              data_list = data.split("\n")
              index_readmetoken = data_list.index(row[1])
              data_list.insert(index_readmetoken, my_data)
              data = "\n".join(data_list)
              push(file, "README created", data, input_data["BRANCH"], update=True)
              print("Pushed to branch :", file)
                          
      else:
        with open(row[2], "r", encoding='utf-8' ) as fragfile:
          data_list_template = []
          lines = fragfile.readlines()
          for line in lines:
              j2_template = Template(line)
              line_data = j2_template.render(input_data)
              data_list_template.append(line_data)
          data = "\n".join(data_list_template)
          j2_template = Template(file)
          final_file = j2_template.render(input_data)
          try:
              contents = repo.get_contents(final_file, ref=input_data["BRANCH"])
              if contents.path == final_file:
                update=True
              else:
                update=False
          except:
              update=False
          push(final_file, "Scala file updated", data, input_data["BRANCH"], update=update)
          print("Pushed to branch :", final_file)
          



# list_input_request = os.listdir('input')
# dir_list = ['code_fragments', 'conf' ]
# frag_file_list = ["readme.frag", "table_reader.frag"]

# for input_file in list_input_request:
#     with open(f'input/{input_file}', "r") as input_handle:
#         input_data = json.load(input_handle)
#         #Create configuration and fragments directory and files
#         for dir_name in dir_list:
#             print(dir_name)
#             if not os.path.isdir(f'./{dir_name}/{input_data["REPO"]}'):
#                 os.mkdir(f'./{dir_name}/{input_data["REPO"]}')
#             if dir_name == "code_fragments":
#                 print("Code Frags")
#                 for frag_file in frag_file_list:
#                     with open(f'./{dir_name}/{input_data["REPO"]}/{frag_file}', "w+") as read_frag:
#                         if frag_file == "readme.frag":
#                             read_frag.write("{{ CURRENTDATE }}: Added findManyRecordsInDatabase for {{TABLENAME}} table")
#                         else:
#                             read_frag.write("""def fetchMany(numericId: NumericId): Future[Seq[{{TABLENAME}}_vals]] = {
#     sharding
#       .client(numericId.value)
#       .prepare(s"SELECT * FROM {{TABLENAME}} WHERE numericId = ?”)
#       .select(numericId.value)(parse)
#       .onFailure {
#         case sqlError: ServerError =>
#           logger.error(
#             s"UBI Error: {{TABLENAME}} fetchMany: Sql error. Code: ${sqlError.code}, Msg: ${sqlError.message}."
#           )
#         case error =>
#           logger.error(
#             s"UBI Error: {{TABLENAME}} fetchMany: Non-SQL error. Repository class name: ${error.getClass.getName}"
#           )te
# app = Flask(__name__)

#       }
#   }
# """)

