# Checkers Online AsyncAPI

Documentation of the Checkers Online AsyncAPI.

## Connection

Socket connections are handled using [Socket.io](https://socket.io/). A client can be connected using
the [Client API](https://socket.io/docs/v4/client-api/).
Every new Connection is required to authenticate itself using a valid AccessToken. How to provide a Token is specified
in the [documentation](https://socket.io/docs/v4/middlewares/).

## Information
Every Sending Event notifies the client whether the action succeeded or not. To ensure that all connected clients of 
one user or guest stay in sync, for every data changing action on the server a Receiving Event is emitted by the server.
This way not only the client who performed the event receives the new data.

## Sending Events

Sending Events can be emitted by using the emit function of the [Client API](https://socket.io/docs/v4/client-api/). For
every event all valid parameter types as well as all response types are specified.

### joinGame

*Parameters:* `{key: string}`  
*Response:* `{success: true}`  
*Error:* `{success: false, error: string}`  
Using a joinGame event a player is able to join a game by providing a valid game key.

### gamePlay

*Parameters:* `{key: string, index: number}`  
*Response:* `{success: true}`  
*Error:* `{success: false, error: string}`  
Using a gamePlay event a player is able to play a move in a game by providing a valid game key as well as the index 
of the possible move. All possible moves can be found in the given GameState.

### leaveGame

*Parameters:* `{key: string}`  
*Response:* `{success: true}`  
*Error:* `{success: false, error: string}`  
Using a leaveGame event a player is able to leave a game by providing a valid game key.

### createCustomGame

*Parameters:* `{key: string, timeType: "DYNAMIC" | "STATIC", time: number, increment: number}`  
*Response:* `{success: true}`  
*Error:* `{success: false, error: string}`  
Using a createCustomGame event a player is able to create a custom game by providing the desired timeType as well as the 
index of the total time and increment. For static games time is defined from 0-5, for dynamic games time is defined 
from 0-5 and increment from 0-4.  
Static Times: 1 Minute, 5 Minutes, 10 Minutes, 30 Minutes, 1 Hour, 1 Day  
Dynamic Times: 10s, 30s, 1 Minute, 10 Minutes, 30 Minutes, 1 Hour  
Dynamic Increments: none, 10 Seconds, 30 Seconds, 1 Minute, 10 Minutes  

### requestFriend

*Parameters:* `{id: string}`  
*Response:* `{success: true}`  
*Error:* `{success: false, error: string}`  
Using a requestFriend event a player is able to request a friendship with another player by providing a valid 
user id.

### acceptFriend

*Parameters:* `{id: string}`  
*Response:* `{success: true}`  
*Error:* `{success: false, error: string}`  
Using a acceptFriend event a player is able to accept a friendship request with another player by providing a valid
user id.

### deleteFriend

*Parameters:* `{id: string}`  
*Response:* `{success: true}`  
*Error:* `{success: false, error: string}`  
Using a deleteFriend event a player is able to delete a friendship or friendship request with another player by 
providing a valid user id.

## Receiving Events

### gameState
*Data:* `GameStateModel`  
The gameState event emits a new GameStateModel to both Players whenever the state of the game changes.

### friendRequest
*Data:* `{user: string, friend: string, status: "REQUEST", online?: boolean}`  
The friendRequest event notifies the requesting user (user) as well as the requested user (friend) of a new request.

### friendDelete
*Data:* `{user: string, friend: string, status: "DELETED", online?: boolean}`  
The friendDelete event notifies both users of the deletion of the friendship.

### friendAccept
*Data:* `{user: string, friend: string, status: "ACTIVE", online?: boolean}`  
The friendAccept event notifies both users that the friendship is now active.

### online
*Data:* `id: string`  
The online event notifies the users that the friend with the specified id is now online.

### offline
*Data:* `id: string`  
The online event notifies the users that the friend with the specified id is now offline.

### welcome
*Data:* `{games: {[key: string] : GameStateModel | WaitingStateModel}, friends: FriendshipModel[]}`  
The welcome event is emitted when the user connects. It contains all current game states as well as a list of all 
friends and friend requests.

### leave
*Data:* `{key: string, id: string}`  
The leave event is emitted when a user leaves a game. All players in the game receive the key of the game as well as 
the id of the player who left.

## Models
The Models specified in this documentation can be found in `client/src/app/models`.