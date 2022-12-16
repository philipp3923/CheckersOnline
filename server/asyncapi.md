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

*Parameters:* ```{ key: string }```
*Response:* ```{ success: true }```  
*Error:* ```{ success: false, error: string }```  
Using a joinGame event a player is able to join a game by providing a valid game key.

### createFriendGame

*Parameters:* ```{ timeType: TimeType, invitation: string }```  
*Response:* ```{ success: true, key: string }```  
*Error:* ```{ success: false, error: string}```

### createCasualGame

*Parameters*: ```{ timeType: TimeType }```  
*Response*: ```{ success: true, key: string }```  
*Error*: ```{ success: false, error: string}```

## Receiving Events

## Datatypes

### Enum TimeType
