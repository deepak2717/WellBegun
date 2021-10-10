#!/usr/bin/python
import os
import json
"""
Contributor : Deepak Kumar
Reviewer

Reads input request and creates the fragments tp generate the code for API development

"""

# Read the the input file Parse the json and crate the respective fragment structure


list_input_request = os.listdir('input')

for input_file in list_input_request:
    with open(f'input/{input_file}', "r") as input_handle:
        input_data = json.load(input_handle)
        #Create configuration and fragments directory and files
        dir_list = ['code_fragments', 'conf' ]
        for dir_name in dir_list:
            print(dir_name)
            if not os.path.isdir(f'./{dir_name}/{input_data["REPO"]}'):
                os.mkdir(f'./{dir_name}/{input_data["REPO"]}')
            if dir_name == "code_fragments":
                print("Code Frags")
                with open(f'./{dir_name}/{input_data["REPO"]}/readme.frag', "w+") as read_frag:
                    print("Write file")
                    read_frag.write("abc")

            #with open()

        print(input_data)

