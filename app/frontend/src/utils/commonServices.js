const kc = 'keycloak';

export const CommonServiceTypes = Object.freeze({
  KEYCLOAK: kc
});

export const CommonServiceList = Object.freeze([{
  abbreviation: 'CHES',
  type: kc,
  shortName: 'common-hosted-email',
  name: 'Common Hosted Email Service',
  apiDocLink: 'https://ches.nrs.gov.bc.ca/api/v1/docs',
  postmanCollection: 'ches.postman_collection.json'
},
{
  abbreviation: 'CDOGS',
  type: kc,
  shortName: 'common-document-generation',
  name: 'Common Document Generation Service',
  apiDocLink: 'https://cdogs.nrs.gov.bc.ca/api/v2/docs',
  postmanCollection: 'cdogs.postman_collection.json'
}]
);
