#!/bin/bash

cp sonar-project.master sonar-project.properties
vi sonar-project.properties +":%s/PROJECT_VERSION/`date +%Y.%m.%d.%H.%M`/" +wq;
vi sonar-project.properties +":%s/PROJECT_DATE/`date +%Y-%m-%d`/" +wq;