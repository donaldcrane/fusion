# fusion

[![test](https://github.com/donaldcrane/fusion/actions/workflows/.node.js.yml/badge.svg)](https://github.com/donaldcrane/fusion/actions/workflows/.node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/donaldcrane/fusion/badge.svg?branch=main)](https://coveralls.io/github/donaldcrane/fusion?branch=main)

# Documentation

A detailed documentation of the api can be found here: [API Documentation](https://documenter.getpostman.com/view/11971882/UzBqqRQV)

**Run Project Locally**

- Clone the project
- cd into the project's folder and run npm install to install dependencies
- Create a .env file and add PORT value, Database_url to it
- Run npm run dev to start the server locally

# HTTP Requests

All API requests are made by sending a secure HTTPS request using one of the following methods:

- POST Create a resource
- GET Get a resource or list of resources
- For POST, the body of your request must be a JSON payload.

# HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- 200 OK Successful request
- 400 Bad Request There was a problem with the request
- 500 Server Error Server error
