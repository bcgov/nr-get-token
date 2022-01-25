const request = require('supertest');

const helper = require('../../../common/helper');
const router = require('../../../../src/routes/v1/email');

const emailComponent = require('../../../../src/components/email');
const githubComponent = require('../../../../src/components/github');

// Simple Express Server
const basePath = '/api/v1/email';
const app = helper.expressHelper(basePath, router);

describe(`POST ${basePath}`, () => {
  const sendRequestSpy = jest.spyOn(emailComponent, 'sendRequest');
  const createIssueSpy = jest.spyOn(githubComponent, 'createRequestIssue');
  let body;

  beforeEach(() => {
    body = {
      applicationAcronym: 'TEST',
      comments: 'comment',
      from: 'email@example.com',
      idir: 'user@idir',
    };
    sendRequestSpy.mockReset();
    createIssueSpy.mockReset();
  });

  it('should yield a created response', async () => {
    sendRequestSpy.mockReturnValue('test');
    createIssueSpy.mockReturnValue(true);

    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeTruthy();
    expect(response.body).toMatch('test');
    expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendRequestSpy).toHaveBeenCalledWith(
      body.applicationAcronym,
      body.comments,
      body.from,
      body.idir
    );
    expect(createIssueSpy).toHaveBeenCalledTimes(1);
    expect(createIssueSpy).toHaveBeenCalledWith(
      body.applicationAcronym,
      body.comments,
      body.from,
      body.idir
    );
  });

  it('should yield a validation failure', async () => {
    const email = 'badEmail';
    body.from = email;
    sendRequestSpy.mockReturnValue('test');
    createIssueSpy.mockReturnValue(true);

    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(422);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toMatch('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].param).toMatch('from');
    expect(response.body.errors[0].value).toMatch(email);
    expect(sendRequestSpy).toHaveBeenCalledTimes(0);
    expect(createIssueSpy).toHaveBeenCalledTimes(0);
  });

  it('should yield a server gracefully', async () => {
    const errMsg = 'bad';
    sendRequestSpy.mockImplementation(() => {
      throw new Error(errMsg);
    });
    createIssueSpy.mockReturnValue(true);

    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeTruthy();
    expect(response.body.detail).toBe(errMsg);
    expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendRequestSpy).toHaveBeenCalledWith(
      body.applicationAcronym,
      body.comments,
      body.from,
      body.idir
    );
    expect(createIssueSpy).toHaveBeenCalledTimes(1);
    expect(createIssueSpy).toHaveBeenCalledWith(
      body.applicationAcronym,
      body.comments,
      body.from,
      body.idir
    );
  });

  it('should yield a created response even if github creation fails', async () => {
    sendRequestSpy.mockReturnValue('test');
    const errMsg = 'quiet';
    createIssueSpy.mockImplementation(() => {
      throw new Error(errMsg);
    });

    const response = await request(app).post(`${basePath}`).send(body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeTruthy();
    expect(response.body).toMatch('test');
    expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendRequestSpy).toHaveBeenCalledWith(
      body.applicationAcronym,
      body.comments,
      body.from,
      body.idir
    );
    expect(createIssueSpy).toHaveBeenCalledTimes(1);
    expect(createIssueSpy).toHaveBeenCalledWith(
      body.applicationAcronym,
      body.comments,
      body.from,
      body.idir
    );
  });
});
