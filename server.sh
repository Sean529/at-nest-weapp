#!/bin/bash

# 启动 mongodb 服务
mongod --dbpath /usr/local/mongodb/data/db

# 启动 redis 服务
redis-server