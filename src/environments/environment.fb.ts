export const environment = {
  production: true,
  subredditLimit: 25,
  clientId: "J7qaQ26QYFcKEg",
  authorizationType: "authorization_code",
  refreshType: "refresh_token",
  tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
  redirectUrl: "https://redditsharp-b7de3.firebaseapp.com/authenticate", //replace
  scope:
    "account edit flair history identity mysubreddits read report save submit subscribe vote wikiread"
};
