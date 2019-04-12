# Lab9 Documentation

## Login System

Our Angular controller contains a field "activeUser" that contains the ID of the logged in user. When this value is null, nobody is logged in, so the website displays login boxes. When the value is not null, the website displays the cash register. 

When someone logs in, the client makes a get request (boo) to the /login/:username/:password (somehow worse) endpoint on our server. This endpoint sends a SQL response back to the client (it keeps getting worse) containing the matching userIDs, usernames, and passwords (plain text, of course). If the response is empty, the login failed, otherwise, it sets activeUser to the userId of the first one (there should only ever be one, but of course we haven't guarenteed this by making usernames unique). This causes the page to display the cash register and stores the userId for later SQL queries. 

Basically, we Created a Basic Login System.

Logging out is done by setting the activeUser to null.

## Getting Items

GET /items

Gets all of the items and button information from the endpoint localhost:1337/items, which is a json array returned from our items table.

```javascript
[
  {
    "itemName": "hotdogs",
    "amount": 0,
    "price": 2.5,
    "itemID": 1,
    "buttonLeft": 20,
    "buttonTop": 100,
    "buttonWidth": 100
  },
  {
    "itemName": "hamburgers",
    "amount": 1,
    "price": 3.5,
    "itemID": 2,
    "buttonLeft": 200,
    "buttonTop": 100,
    "buttonWidth": 100
  }
]
```

## Delete

GET /delete

Requires id in body

Removes 1 from amount of items in the cart for the item with provided ID.

Returns a json object (that you don't need to do anything with really)

```javascript
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  protocol41: true,
  changedRows: 1 
}
```

## Click

GET /click

Requires id in body

Add 1 to amount of items in the cart for the item with provided ID.

Returns a json object (that you don't need to do anything with really)

```javascript
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  protocol41: true,
  changedRows: 1 
}
```

## Void

GET /void

Sets amount of all items to 0.

Returns a json object (that you don't need to do anything with really)

```javascript
{
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  protocol41: true,
  changedRows: 1 
}
```

## Sale

GET /sale/:start/:end/:id

start: start datetime

end: end datetime

id: user id

Adds a transaction of all items with non-zero amounts to transaction and archive tables. Sets amount of all items to 0 after.

```javascript
{
  "fieldCount": 0,
  "affectedRows": 5,
  "insertId": 0,
  "serverStatus": 34,
  "warningCount": 0,
  "message": "(Rows matched: 5  Changed: 1  Warnings: 0",
  "protocol41": true,
  "changedRows": 1
}
```



