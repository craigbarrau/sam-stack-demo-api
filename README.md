# SAM Stack Demo API

:see_no_evil: **This is an AWS SAM fork of the popular Serverless Notes API**

:hear_no_evil: **If you are looking for the original Serverless Framework version, [click here](https://github.com/AnomalyInnovations/serverless-stack-demo-api)**

[Serverless Stack](http://serverless-stack.com) is a free comprehensive guide to creating full-stack serverless applications. We create a [note taking app](http://demo2.serverless-stack.com) from scratch.

This repo is for the serverless backend API that we build over the course of the tutorial. You can find the repo for the frontend React app [here](https://github.com/AnomalyInnovations/serverless-stack-demo-client). And the repo for the tutorial [here](https://github.com/craigbarrau/serverless-stack-com).

#### Steps

:speak_no_evil: As AWS SAM is targeted as an extra credit chapter, there is currently no need for branching to support multiple chapters/steps.

#### Usage

To use this repo locally you need to have the [AWS SAM](https://aws.amazon.com/serverless/sam/) installed.

The AWS SAM installation steps are available [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Clone this repo, install the NPM packages and build the source using webpack

``` bash
$ git clone https://github.com/craigbarrau/sam-stack-demo-api
$ npm install
$ npm run-script build
```

We can run a single API request on local as follows:

``` bash
$ sam local invoke List -e mocks/list-event.json
```

Where, `mocks/list-event.json` contains the request event info and looks something like this.

``` json
{
  "requestContext": {
    "authorizer": {
      "claims": {
        "sub": "USER-SUB-1234"
      }
    }
  }
}
```

Alternatively, we can start our API locally with the following

``` bash
$ sam local start-api 
$ open http://localhost:3000/notes
```

Finally, run this to deploy to your AWS account.

``` bash
$ sam deploy --guided
```

---

This repo is maintained by [Craig Barr](http://github.com/craigbarrau).

The original repo is maintained by [Anomaly Innovations](https://anoma.ly); makers of [Seed](https://seed.run) and [Serverless Stack](https://serverless-stack.com).

[Email]: mailto:contact@anoma.ly
