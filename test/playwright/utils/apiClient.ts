import { APIRequestContext } from '@playwright/test';

export class APIClient {
  private context: APIRequestContext;

  constructor(context: APIRequestContext) {
    this.context = context;
  }

  async getAccessToken() {
    const response = await this.context.post(`${process.env.URL}/v1/token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        client_id: process.env.CLIENT_ID ?? '',
        client_secret: process.env.CLIENT_SECRET ?? '',
        grant_type: 'password',
        username: process.env.USERNAME ?? '',
        password: process.env.PASSWORD ?? '',
      },
    });

    if (response.ok()) {
      const responseBody = await response.json();
      return responseBody.access_token;
    } else {
      const errorBody = await response.text();
      console.error(`Failed to fetch access token: ${response.status()} ${response.statusText()} - ${errorBody}`);
      throw new Error('Access token request failed. Please check the request details and response above.');
    }
  }

  async getAccountDetails(token: string) {
    const response = await this.context.get(`${process.env.URL}/v1/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-App-Version': '1.0.0',
      },
    });

    if (!response.ok()) {
      const errorBody = await response.text();
      console.error(`Failed to fetch account details: ${response.status()} ${response.statusText()} - ${errorBody}`);
      throw new Error('Account details request failed. Please check the response above.');
    }

    return await response.json();
  }
}
