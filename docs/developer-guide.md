---
title: Get Token Developer Guide
description: Capabilities, OAuth Security, API Endpoints, Example Code
---

Common Service Get Token is an application and API for generating new Keycloak clients with access to certain common services. The goal of this application is to streamline and facilitate the onboarding process for developers to gain access to common services.

## Keycloak

Keycloak is an open source Identity and Access Management solution aimed at modern applications and services.
We usually use Keycloak to secure our Common Services.
Your application is registered as a keycloak 'Client' that can request identity information or an access token from the Keycloak server so that it can securely invoke Common Services that are secured by Keycloak.

We have documented how keycloak is used to authorize users, Common Services and showcase applications.
To read more about our Keycloak Setup visit the [GETOK Wiki](https://github.com/bcgov/nr-get-token/wiki/Keycloak-Setup)

Using GETOK simplifies the process of managing Keycloak clients, roles and crdentials.
