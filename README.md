# AWS Lambda Prerender

### Description

AWS Lambda function for generating HTML for client-side rendered content.

### WordPress

Initially this function was created to be used with WordPress via plugin [AWS Lambda Prerender](https://github.com/innocode-digital/wp-prerender-aws-lambda),
so you just need to install plugin.

### Basic usage (non WordPress)

Event JSON:

| **Name** | **Type** | **Description**                              |
|----------|----------|----------------------------------------------|
| type | `string` | Type of content, e.g. `post` or `frontpage`  |
| id | `string`  | Identifier, e.g. ID of Post from database.   |
| url | `string` | URL for grabbing HTML.                       |
| selector | `string` | Selector of root element to grab.            |
| return_url | `string` | Endpoint where result should be returned.    |
| secret | `string` | Secret to be added to POST callback request. |
| version | `string` | Version of HTML.                             |

#### Notes

- Secret is for authorization. In WordPress plugin this secret has 20 minutes live time
  ([15 minutes](https://aws.amazon.com/ru/about-aws/whats-new/2018/10/aws-lambda-supports-functions-that-can-run-up-to-15-minutes/#:~:text=You%20can%20now%20configure%20your,Lambda%20function%20was%205%20minutes.)
  is a maximum execution time of AWS Lambda function and 5 minutes of reserve).

Example:

````
{
  "type": "post",
  "id": 345,
  "url": "https://www.site.com/blog/hello-world/",
  "selector": "#app",
  "return_url": "https://site.com/api/v1/prerender",
  "secret": "aQ3qnPPnDwhaB7pzI3Y0jQx*",
  "version": "381d3e8bfd139596baf7959fb85b084e"
}
````

### Installation

- **Use this template** from Github.
- [Create AWS Access Keys](https://www.serverless.com/framework/docs/providers/aws/guide/credentials#creating-aws-access-keys).
  You can follow [this gist](https://gist.github.com/ServerlessBot/7618156b8671840a539f405dea2704c8) to create policy.
- Add **API Key** & **Secret** with **Region** to Github **Repository secrets** into `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY` and `AWS_REGION` variables.
- Deploy function with Github Actions. `dev` branch will be deployed on push into **prerender-dev-render** function,
  production should be deployed manually through `workflow_dispatch` into **prerender-production-render**.
