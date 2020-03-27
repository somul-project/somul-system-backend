#!/bin/bash

docker build -t somul/backend:$TAG .
docker push somul/backend:$TAG