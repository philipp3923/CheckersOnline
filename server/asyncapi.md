# Checkers Online AsyncAPI

## Connection

Socket connection are handled using [Socket.io](https://socket.io/). A client can be connected using
the [Client API](https://socket.io/docs/v4/client-api/).
Every new Connection is required to authenticate itself using a valid AccessToken. How to provide a Token is specified
in the [documentation](https://socket.io/docs/v4/middlewares/).

## Sending Events

Sending Events can be emitted by using the emit function of the [Client API](https://socket.io/docs/v4/client-api/). For
every event all valid parameter types as well as all response types are specified.

### joinGame

_Parameters:_ `{ key: string }`
_Response:_ `{ success: true }`  
_Error:_ `{ success: false, error: string }`  
Using a joinGame event a player is able to join a game by providing a valid game key.

### createFriendGame

_Parameters:_ `{ timeType: TimeType, invitation: string }`  
_Response:_ `{ success: true, key: string }`  
_Error:_ `{ success: false, error: string}`

### createCasualGame

_Parameters_: `{ timeType: TimeType }`  
_Response_: `{ success: true, key: string }`  
_Error_: `{ success: false, error: string}`

## Receiving Events

## Datatypes

### Enum TimeType
