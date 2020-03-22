#!/bin/bash

echo "[somul/server] Docker tag (ex 1.0.0): "
  read tag
  docker build -t somul/backend:${tag} .
  docker push somul/backend:${tag}

