export default function tokenToUser(token: Tokens.JSON): User{
    return {
        email: token.email,
        username: token.username
    }
}