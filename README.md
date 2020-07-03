# SAM Stack Demo API

:see_no_evil: **This is an AWS SAM fork of the popular [Serverless Notes API](http://serverless-stack.com)**

:hear_no_evil: **The original Serverless Framework version is available [here](https://github.com/AnomalyInnovations/serverless-stack-demo-api)**

:speak_no_evil: **The SAM-based backend may be better placed as an extra credit chapter, so there is currently no branching in place to support multiple chapters/steps. All of the latest AWS SAM specific resources are on the master.**

[Serverless Stack](http://serverless-stack.com) is a free comprehensive guide to creating full-stack serverless applications. We create a [note taking app](http://demo2.serverless-stack.com) from scratch.

This repo is for the serverless backend API that we build over the course of the tutorial. You can find the repo for the frontend React app [here](https://github.com/AnomalyInnovations/serverless-stack-demo-client). And the repo for the tutorial [here](https://github.com/craigbarrau/serverless-stack-com).

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
