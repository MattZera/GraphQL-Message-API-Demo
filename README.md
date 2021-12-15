# GraphQL Message API Demo

## Description

A GraphQL message api written with the 
[Nest](https://github.com/nestjs/nest) framework.

I chose to use the nest framework because for these reasons.
  * I am highly familiar with it due to usage in personal projects
  * Nest provides significant boiler plate code with a starting point for tests and services
  * I wanted to demonstrate my ability to work with GraphQL and NestJS provides an efficient way 
    to declare resolvers with TypeScript annotations

## Running the app localy
Note: To install the app and its dependencies you must have the latest NodeJS

In the project directory, install the project dependencies using NPM

```bash
$ npm install
```

Please run the app by running the following command

```bash
$ npm run start
```

## Running the app via Docker
I have created a Docker file for this project. It can be built and run with the following command.

```bash
$ docker build -t local . && docker run -p 3000:3000 -it local
```

## Test
Unit tests can be run with the commands below

```bash
# unit tests
$ npm run test

# run tests with coverage reports
$ npm run test:cov
```

## GraphQL

The API is a GraphQL api and so sending requests is a bit different but should still be straight forward. 
Special libraries exist to facilitate in using a GraphQL API, but they are not required.

Requests can be made from the browser with fetch

```javascript
fetch('https://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
        query testQuery($user: String!) {
          user1: user(name: $user){
            name
            messages {
              sender
              recipient
              message
            }
          }
        }
      `,
    variables: {
      user: "matt",
    },
  }),
})
```

### Testing the API

The easiest way to test the API is by using the GraphiQL Playground which is enabled in the project

Start the project and navigate to http://localhost:3000/graphql in your web browser to open the playground.

In the left panel you can easily draft a query or mutation and send it using the play button.

#### Sending a Message

Messages are sent using the sendMessage mutation. 

Sender, recipient, and message are required fields. The return value is the message object that was created
which has been appended with the date the message was sent
```graphql
mutation {
  sendMessage(message: {
    sender: "matt"
    recipient: "michael"
    message: "Hello world!"
  }){
    date
    sender
    message
    recipient
  }
}
```

#### Retrieving Messages

There are multiple ways that messages can be retrieved using this api

Messages for a specific user can be retrieved by sending a query to the `messages` root Query and
providing a recipient in the `where` input variable

```graphql
query getMessagesForJoe {
  messages(where: {
    recipient: "joe"
  }){
    sender
    message
    date
    recipient
  }
}
```

Messages for a specific user can also be retrieved through the `user` root Query by requesting the messages field.
All messages for that user will be retrieved. This may be useful if the API is to be included in a federated graph.
By using the name property as a foreign key, the messages property may be appended to the user object.

```graphql
query getMessagesForJoeV2 {
  user(name: "joe"){
    name
    messages {
      sender
      message
      date
      recipient
    }
  }
}

```

Messages from a specific user can be retrieved by adding a `sender` property to the `where` variable in either case

```graphql
query getMessagesForJoeFromEric {
  messages(where: {
    sender: "eric"
    recipient: "joe"
  }){
    sender
    message
    date
    recipient
  }
}

```

```graphql
query getMessagesForJoeFromEricV2 {
  user(name: "joe"){
    name
    messages(where: {
      sender: "eric"
    }) {
      sender
      message
      date
      recipient
    }
  }
}

```

Messages retrieval can be further controlled using the `limit` and `afterDate` properties on the `where` input object.
By default, `limit` is set to 100 and `afterDate` is set to 30 days ago. If they are not provided, the api will return the latest 100 messages sent in the last 30 days

```graphql
query getLastMessageToJoeFromEric {
  messages(where: {
    sender: "eric"
    recipient: "joe"
    limit: 1
  }){
    sender
    message
    date
    recipient
  }
}
```

```graphql
query getLastMessageToJoeFromEricV2 {
  user(name: "joe"){
    name
    messages(where: {
      sender: "eric"
      limit: 1
    }) {
      sender
      message
      date
      recipient
    }
  }
}
```

```graphql
# Get yesterday's date in JS
#
# var yesterday = new Date();
# yesterday.setDate(yesterday.getDate() - 1);
#
query getMessagesForJoeFromYesterday($yesterday: DateTime!) {
  messages(where: {
    sender: "eric"
    recipient: "joe"
    afterDate: $yesterday
  }){
    sender
    message
    date
    recipient
  }
}
```

```graphql
# Get yesterday's date in JS
#
# var yesterday = new Date();
# yesterday.setDate(yesterday.getDate() - 1);
#
query getMessagesForJoeFromYesterdayV2($yesterday: DateTime!) {
  user(name: "joe"){
    name
    messages(where: {
      afterDate: $yesterday
    }) {
      sender
      message
      date
      recipient
    }
  }
}
```