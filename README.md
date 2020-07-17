## Prerendering on AWS Lambda

#### Instructions to run locally via get request
Add to the serverless.yml in function params
````
events:
  - http:
    path: /
    method: get
````     
then run     
```
$ npm install 
$ sls offline 
```
after that you can call the function locally via get request
```
curl -X GET \
  'http://localhost:3000/dev?url=YOUR_URL' \
```
___________

#### To Deploy on AWS 

Add your profile in `serverless.yml` and run

```
$ sls deploy
```