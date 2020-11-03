const webade = 'webade';
const kc = 'keycloak';

export const CommonServiceTypes = Object.freeze({
  WEBADE: webade,
  KEYCLOAK: kc
});

export const CommonServiceList = Object.freeze([{
  abbreviation: 'cmsg',
  type: webade,
  shortName: 'cmsg-messaging-api',
  name: 'Common Messaging Service',
  apiDocLink: 'https://i1apistore.nrs.gov.bc.ca/store/apis/info?name=cmsg-messaging-api&version=v1&provider=admin'
},
{
  abbreviation: 'dms',
  type: webade,
  shortName: 'dms-api',
  name: 'Document Management Service',
  apiDocLink: 'https://i1apistore.nrs.gov.bc.ca/store/apis/info?name=dms-api&version=v1&provider=admin',
  disabled: true
},
{
  abbreviation: 'nros-dms',
  type: webade,
  shortName: 'nros-dms',
  name: 'NROS Folder Read-all Access in DMS',
  apiDocLink: 'https://i1apistore.nrs.gov.bc.ca/store/apis/info?name=dms-api&version=v1&provider=admin',
  disabled: false
},
{
  abbreviation: 'dgen',
  type: webade,
  shortName: 'dgen-api',
  name: 'Document Generation Service',
  apiDocLink: 'https://i1apistore.nrs.gov.bc.ca/store/apis/info?name=dgen-api&version=v1&provider=admin',
  disabled: true
},
{
  abbreviation: 'CHES',
  type: kc,
  shortName: 'common-hosted-email',
  name: 'Common Hosted Email Service',
  apiDocLink: 'https://ches.pathfinder.gov.bc.ca/api/v1/docs',
  postmanCollection: 'ches.postman_collection.json'
},
{
  abbreviation: 'CDOGS',
  type: kc,
  shortName: 'common-document-generation',
  name: 'Common Document Generation Service',
  apiDocLink: 'https://cdogs.pathfinder.gov.bc.ca/api/v2/docs',
  postmanCollection: 'cdogs.postman_collection.json'
}]
);
