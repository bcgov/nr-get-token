---
title: Get Token Developer Guide
description: Capabilities, OAuth Security, API Endpoints, Example Code
---

Natural Resources Get Token is an application and API for generating new WebADE service clients with access to certain common services. The goal of this application is to streamline and facilitate the onboarding process for developers to gain access to common services.

WebADE may be accessed programatically via the WebADE-API. Get Token directly communicates with the WebADE API via a RESTFul interface in order to update application configurations. A description of the API can be found in [NRM API Store](https://apistore.nrs.gov.bc.ca/store/apis/info?name=WebADE-api&provider=admin&version=v1)

The WebADE-API is secured using OAuth2 security. Anonymous access to the WebADE-API is not permitted. Users of WebADE-API must have one of more of the appropriate OAuth2 scopes in order to access the API. More information on WebADE can be found [here](http://www.webade.org).

## Security

Before developing applications which leverage the WebADE-API, ensure that you have a valid WebADE service client which is authorized to use WebADE-API first. You will also need the appropriate scopes granted to your service client before you will be able to proceed with the WebADE-API endpoint. Please ensure that you are familiar with OAuth2 authentication flow before proceeding with accessing the API.

The OAuth2 scopes available for WebADE-API are:

* WEBADE-REST

## API Endpoints

Details for Version 1 of the WebADE-API can be found in the [NRM API Store](https://apistore.nrs.gov.bc.ca/store/apis/info?name=webade-api&provider=admin&version=v1#tab2) under the API Console tab. Below are some of the commonly used endpoints:

* `/*` - Get top-level resources
* `/applicationConfigurations` - Get and manage WebADE application configurations
