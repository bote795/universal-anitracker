[![CircleCI](https://circleci.com/gh/bote795/universal-anitracker.svg?style=svg&circle-token=53b7c4d6ecedf470eb066ff63e4ece929a8d343c)](https://circleci.com/gh/bote795/universal-anitracker)
# universal-anitracker
## About
module to allow to update a users library for the following services, aimes to be universal, so that you just pass what service and all the payloads will be the same and return types:
* anilist
* kitsu
# Getting started 
## Install
`yarn install`

## Setup
add a `.env` file with the following:
```
cypress_CLIENT_ID=dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd
cypress_CLIENT_SECRET=54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151
cypress_EMAIL=
cypress_PASSWORD=
cypress_TOKEN=5e753f83bc727b6074476083e02984b336ea2a082dce09b5f9d3b58951df66ab
cypress_ANILIST_TOKEN=
```
### [Kitsu](https://kitsu.io)
 The following are needed for the kitsu package:   
Following two, are provided by the [kitsu api](https://kitsu.docs.apiary.io/#reference/authentication), since they don't have a way to generate new clients
1.  ```cypress_CLIENT_ID```  
2. ```cypress_CLIENT_SECRET```

The next two are the user creds to login:   
1. ``` cypress_EMAIL ```  
2. ``` cypress_PASSWORD ```  
*** a user can be created at [kitsu](https://kitsu.io)

### [Anilist](https://anilist.co/)
create a user in [Anilist](https://anilist.co/)   
Generate a token by using the 'anilist' client, getToken function  
`cypress_ANILIST_TOKEN=
`
## Tests
`npm run test`   
Tests don't actually mock the api call's
To make sure that the API hasn't changed


TODO:
* notify.moe
* MAL

Put an issue to request for a new provider
