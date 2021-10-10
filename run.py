#!/usr/bin/python
import os
import json
from jinja2 import Template

"""
Contributor : Deepak Kumar
Reviewer

Reads input request and creates the fragments tp generate the code for API development

"""

# Read the the input file Parse the json and crate the respective fragment structure


list_input_request = os.listdir('input')
dir_list = ['code_fragments', 'conf' ]
frag_file_list = ["readme.frag", "table_reader.frag"]

for input_file in list_input_request:
    with open(f'input/{input_file}', "r") as input_handle:
        input_data = json.load(input_handle)
        #Create configuration and fragments directory and files
        for dir_name in dir_list:
            print(dir_name)
            if not os.path.isdir(f'./{dir_name}/{input_data["REPO"]}'):
                os.mkdir(f'./{dir_name}/{input_data["REPO"]}')
            if dir_name == "code_fragments":
                print("Code Frags")
                for frag_file in frag_file_list:
                    with open(f'./{dir_name}/{input_data["REPO"]}/{frag_file}', "w+") as read_frag:
                        if frag_file == "readme.frag":
                            read_frag.write("{{ CURRENTDATE }}: Added findManyRecordsInDatabase for {{TABLENAME}} table")
                        else:
                            read_frag.write("""def fetchMany(numericId: NumericId): Future[Seq[{{TABLENAME}}_vals]] = {
    sharding
      .client(numericId.value)
      .prepare(s"SELECT * FROM {{TABLENAME}} WHERE numericId = ?”)
      .select(numericId.value)(parse)
      .onFailure {
        case sqlError: ServerError =>
          logger.error(
            s"UBI Error: {{TABLENAME}} fetchMany: Sql error. Code: ${sqlError.code}, Msg: ${sqlError.message}."
          )
        case error =>
          logger.error(
            s"UBI Error: {{TABLENAME}} fetchMany: Non-SQL error. Repository class name: ${error.getClass.getName}"
          )te
app = Flask(__name__)

      }
  }
""")

