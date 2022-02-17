#!/bin/bash

## TODO: allow to override environment variables based on command paramters when executing

RG_NAME=wedding-rg
RG_LOCATION=westus2
ARM_TEMPLATE_FILE=azuredeploy.json
ARM_PARAMETERS_FILE=azuredeploy.parameters.json

## TODO: verify azure-cli is installed
## TODO: verify a valid azure account is connected and logged in

# create resource group to contain all the resources
az group create --name $RG_NAME --location $RG_LOCATION

# create the resoruces using ARM template
az deployment group create --resource-group  $RG_NAME --template-file $ARM_TEMPLATE_FILE --parameters $ARM_PARAMETERS_FILE