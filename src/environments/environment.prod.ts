export const environment = {
  production: true,
  subredditLimit:25,
  clientId:"IbfzyNrDp0uyog",
  authorizationType:"authorization_code",
  refreshType:"refresh_token",
  tokenEndpoint:"https://www.reddit.com/api/v1/access_token",
  redirectUrl: "http://localhost:4200/authenticate", //replace
  scope:"account edit flair history identity mysubreddits read report save submit subscribe vote wikiread"
};
