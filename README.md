Pongy: The Ping Pong Game Tracker
---

Pongy is an application to help track ping pong games, designed to be used with [flic buttons][flic]. It is comprised of a server connected to a client using WebSockets. Making requests to the server will result in messages being sent to the client which will then take some action.

# Getting Started

### Local Development

To run both client and server locally with one command that watches for changes and reloads:

```sh
$ yarn run start:dev
```

You can also run the client and server separately:

```sh
$ yarn start # Start the client and watch for changes
```

```sh
$ yarn run start:server # Start the server (not in dev mode)
```

# How It Works

Each side of the ping pong table is assigned a button. Pressing the button makes a request to an endpoint which then updates the application accordingly.

## Button Press Actions

The flic button is capable of recognizing three actions: click, double-click, and hold.

Button Press | Action
------------ | ------
Single click | Record a point
Double-click | Clear the last recorded point
Hold         | Start a new game

# Application

## Server

#### Proposed Tech Stack

- [koa][koa]
- [WebSockets][websockets]
- [mongoDB][mongoDB] (possibly for future enhancements or to save a history)

#### Endpoints

Method | Path | Action
------ | ---- | ------
GET | /games/new | Create new game
POST | /games/update | Update current game

#### Post Body
The POST endpoints expect a request body with the following format:
```js
{
  action: '' // {string} name of store action,
  args: [], // {array} arguments to pass to action
}
```

## Client

#### Proposed Tech Stack

- [react (create-react-app)][create-react-app]
- [mobx][mobx]
- [styled-components][sc]

#### UI Display

- Overall score
- Which side has service
- Serve count

# Other Information

## Game Rules

- Wall side (white) serves first
- Two points played per service
- Game played to 11
- If score reaches 10 - 10, match goes into deuce
- In deuce service alternates every point
- Must win by 2

## Future Features

- Support tournament play (Best of 5)


[flic]: http://www.flic.io
[koa]: http://koajs.com/
[websockets]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[mongoDB]: https://www.mongodb.com/
[create-react-app]: https://github.com/facebookincubator/create-react-app
[mobx]: https://mobx.js.org/
[sc]: https://www.styled-components.com/
