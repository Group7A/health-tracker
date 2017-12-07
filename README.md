## Health Tracker
A web application to help improve healthy dietary behaviors.

## Website Link: https://myhealthify.herokuapp.com/

## Credits
- MEAN.JS: http://meanjs.org/
- BootStrap: https://getbootstrap.com/
- Bing Web Search API v7: https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#query-parameters
- USDA National Nutrient Database: https://ndb.nal.usda.gov/ndb/search/list

## Project Features
![home-page](https://i.imgur.com/CjWjJxV.png)

Users can:
- Sign up for an account
- Personalize profile with specifications such as allergies and religious restrictions
- Search individual ingredients for healthier alternatives
- Add recipe to user profile
- See suggested alternatives based on recipe ingredients
- Customize recipe with alternatives

## How to run locally:
- Clone the repository:
```bash
git clone https://github.com/Group7A/health-tracker.git
```
- Run bower install and npm install:
```bash
bower install && npm install
```
- Start the app:
```bash
npm start
```

## How to update database and server connections:
The database is located at https://mlab.com/databases/health_tracker. To change to another database, update the mongo uri in config/env/development.js. 
