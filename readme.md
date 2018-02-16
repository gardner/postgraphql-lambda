AWS Lambda PostGraphile
=======================

# Required Software

    brew install terraform
    brew install awscli
    aws configure

# Required Variables
The following variables must be specified in the lambda:

    JWT_SECRET  # Tell postgraphql to use this secret when generating JWT (default: random string)
    PGSCHEMA    # default: public
    PGHOST      # default: postgres
    PGPORT      # default: 5432
    PGDATABASE  # default: postgres
    PGUSER      # default: postgres
    PGPASSWORD  # default: postgres

If deploying via terraform these may be specified in the file `terraform.tfvars`


## Test Event
The lambda can be tested using an authenticate mutation:

    {
      "query": "mutation { authenticate (input: { clientMutationId: \"authenticate\", email: \"test@test.test\", password: \"password\" }) { jwtToken { role } } }"
    }
