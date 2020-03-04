---
title: Get Token Developer Guide
description: Capabilities, OAuth Security, API Endpoints, Example Code
---

Common Service Get Token is an application and API for generating new WebADE service clients with access to certain common services. The goal of this application is to streamline and facilitate the onboarding process for developers to gain access to common services.

## Keycloak

Keycloak is an open source Identity and Access Management solution aimed at modern applications and services.
We usually use Keycloak to secure our Common Services.
Your application is registered as a keycloak 'Client' that can request identity information or an access token from the Keycloak server so that it can securely invoke Common Services that are secured by Keycloak.

We have documented how keycloak is used to authorize users, Common Services and showcase applications.
To read more about our Keycloak Setup visit the [GETOK Wiki](https://github.com/bcgov/nr-get-token/wiki/Keycloak-Setup)

Using GETOK simplifies the process of managing Keycloak clients, roles and crdentials.

## WebADE

GETOK can also be used to get setup with WebADE Services published on [https://apistore.nrs.gov.bc.ca/store/](https://apistore.nrs.gov.bc.ca/store/). More information on WebADE can be found [here](http://www.webade.org).

Get Token directly communicates with the WebADE API via a RESTFul interface in order to update application configurations.
GETOK has a service client GETOK_SERVICE which is granted the WEBADE-REST "profileRole" of APPLICATION_ADMINISTRATOR.
A description of the API can be found in [NRM API Store](https://apistore.nrs.gov.bc.ca/store/apis/info?name=WebADE-api&provider=admin&version=v1)

> The first deployment of this webade-cfg information had to be done manually using the process we are replacing. See [Bitbucket GETOK Repo](https://apps.nrs.gov.bc.ca/int/stash/projects/GETOK/repos/getok-webade-cfg/browse) for the package that was used for the first deployment. Subsequent deployment to modify this can be done through the WEBADE-REST-API endpoints.

### OAuth2 Scope

The WebADE-API is secured using OAuth2 security. Anonymous access to the WebADE-API is not permitted. Users of WebADE-API must have one of more of the appropriate OAuth2 scopes in order to access the API.

Before developing applications which leverage the WebADE-API, ensure that you have a valid WebADE service client which is authorized to use WebADE-API first. You will also need the appropriate scopes granted to your service client before you will be able to proceed with the WebADE-API endpoint. Please ensure that you are familiar with OAuth2 authentication flow before proceeding with accessing the API.

The OAuth2 scopes available for WebADE-API are:

* WEBADE-REST

### API Endpoints

Details for Version 1 of the WebADE-API can be found in the [NRM API Store](https://apistore.nrs.gov.bc.ca/store/apis/info?name=webade-api&provider=admin&version=v1#tab2) under the API Console tab. Below are some of the commonly used endpoints:

* `/*` - Get top-level resources
* `/applicationConfigurations` - Get and manage WebADE application configurations
