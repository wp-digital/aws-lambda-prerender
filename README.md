### Prerendering on AWS Lambda

### Instructions to run locally 

```
$ npm install 
$ sls offline 
```

```
curl -X GET \
  'http://localhost:3000/dev?url=YOUR_URL' \
```
___________

#### To Deploy on AWS 

- Add your profile in `serverless.yml` and run

```
$ sls deploy
```