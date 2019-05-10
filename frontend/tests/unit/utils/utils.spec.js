import { isValidJson } from '@/utils/utils.js';

describe('utils.js', () => {
  const validJson = `{
    "@type": "http://webade.gov.bc.ca/applicationConfiguration",
    "applicationAcronym": "MSSC",
    "custodianNumber": 0,
    "applicationName": "NR Common Messaging Showcase",
    "applicationDescription": "A simple email sending demo.",
    "applicationObjectPrefix": null,
    "enabledInd": true,
    "distributeTypeCd": null,
    "managementEnabledInd": false,
    "applicationVersion": null,
    "reportedWebadeVersion": null,
    "actions": [
      {
        "name": "MSSC_ACTION",
        "description": "MSSC action",
        "privilegedInd": false
      }
    ],
    "roles": [
      {
        "name": "MSSC_ROLE",
        "description": "MSSC Role",
        "actionNames": [
          "MSSC_ACTION"
        ]
      }
    ],
    "wdePreferences": [],
    "applicationPreferences": [],
    "globalPreferences": [],
    "defaultUserPreferences": [],
    "profiles": [
      {
        "name": "MSSC_PROFILE",
        "description": "Can send an email with the MSSC app",
        "secureByOrganization": false,
        "availibleTo": [
          "SCL"
        ],
        "effectiveDate": 1506582000000,
        "expiryDate": 253402243200000,
        "profileRoles": [
          {
            "applicationCode": "MSSC",
            "name": "MSSC_ROLE"
          },
          {
            "applicationCode": "CMSG",
            "name": "SENDER"
          }
        ]
      }
    ],
    "serviceClients": [
      {
        "accountName": "MSSC_SERVICE_CLIENT",
        "secret": "$\{MSSC_SERVICE_CLIENT.password}",
        "oauthScopes": [],
        "oauthGrantTypes": [],
        "oauthRedirectUrls": [],
        "oauthAccessTokenValidity": null,
        "oauthRefreshTokenValidity": null,
        "oauthAdditionalInformation": "{\\"autoapprove\\":\\"true\\"}",
        "authorizations": [
          {
            "profileName": "MSSC_PROFILE",
            "profileDescription": "Test profile description",
            "effectiveDate": 1506629523000,
            "expiryDate": 253402243200000,
            "enabled": true
          }
        ]
      }
    ],
    "groupAuthorizations": []
  }`;

  const badJsonMissingQuote = `{
    "@type": "http://webade.gov.bc.ca/applicationConfiguration",
    "applicationAcronym": "MSSC",
    "custodianNumber": 0,
    "applicationName": "NR Common Messaging Showcase",
    "applicationDescription": "A simple email sending demo.,
    "applicationObjectPrefix": null,
    "enabledInd": true,
    "distributeTypeCd": null,
    "managementEnabledInd": false,
    "applicationVersion": null,
    "reportedWebadeVersion": null,
  }`;

  const badJsonMissingBracket = `{
    "@type": "http://webade.gov.bc.ca/applicationConfiguration",
    "applicationAcronym": "MSSC",
    "custodianNumber": 0,
    "applicationName": "NR Common Messaging Showcase",
    "applicationDescription": "A simple email sending demo.,
    "applicationObjectPrefix": null,
    "enabledInd": true,
    "distributeTypeCd": null,
    "managementEnabledInd": false,
    "applicationVersion": null,
    "reportedWebadeVersion": null,
  }`;

  it('validates correct json', () => {
    expect(isValidJson('{}')).toBeTruthy(),
    expect(isValidJson(validJson)).toBeTruthy();
  });

  it('fails bad json', () => {
    expect(isValidJson('abc')).toBeFalsy(),
    expect(isValidJson(badJsonMissingQuote)).toBeFalsy(),
    expect(isValidJson(badJsonMissingBracket)).toBeFalsy();
  });
});
