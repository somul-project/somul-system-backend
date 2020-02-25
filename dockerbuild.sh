#!/bin/bash

echo "[somul/server] Docker tag (ex 1.0.0): "
  read tag
  docker build -t somul/server:${tag} .
  docker push somul/server:${tag}

