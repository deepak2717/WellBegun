[![flare repo score](https://flare.corp.creditkarma.com/badge/deveff_well-begun)](https://flare.corp.creditkarma.com/repos/deveff_well-begun/innersource?utm_source=badge)

Well begun is half done - Mary Poppins

Well begun is a code generator wizard for improving developer efficiency. It literally writes most of the code so that the developer can focus on the business logic.

To use it the repo needs to be prepped by adding specific keywords in various files. Also, the repo structure needs to be stored in a file.

1. con_idl editor [Required]
   a. data structures
   b. service signature (RequestType - ServiceName - ResponseType)
   c. required vs optional indicator

2. mysql editor [Optional]
   a. Create a new table
   b. add a new field

3. Configure Service
   a. Service type?
      i. Insert record?
         - Map request to  mysql table + fields to response
     ii. Read record?
         - Map request to  mysql table + fields to response
    iii. Complex Service?
         - List sequence of services/filters
         - Auto generate adapters 
     iv. Internal Client/Service
      v. External Client/Service
         - JSON
         - XML
         - Config loading / hvault
   [b. log prefix
   c. stat prefix
   d. Unit tests
   e. Integration tests]

4. SUBMIT
   a. will create a con_idl PR
   b. will create a DBA PR
   c. will create a service PR
===========================
SETUP A REPO/PROJECT

1. File locations for model and service in con_idl
2. Folder location for SQL
3. Also, need a SQL parser for tables/fields
4. File locations for conf, main, unit test, integration test, service and clients

Within each project, there could be multiple subprojects .. . so we need (1-4) for each subproject.
