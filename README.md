# Lab9 Documentation

## Login System

Our Angular controller contains a field "activeUser" that contains the ID of the logged in user. When this value is null, nobody is logged in, so the website displays login boxes. When the value is not null, the website displays the cash register. 

When someone logs in, the client makes a get request (boo) to the /login/:username/:password (somehow worse) endpoint on our server. This endpoint sends a SQL response back to the client (it keeps getting worse) containing the matching userIDs, usernames, and passwords (plain text, of course). If the response is empty, the login failed, otherwise, it sets activeUser to the userId of the first one (there should only ever be one, but of course we haven't guarenteed this by making usernames unique). This causes the page to display the cash register and stores the userId for later SQL queries. 
