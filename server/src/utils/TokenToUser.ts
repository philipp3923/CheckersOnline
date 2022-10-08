export default function tokenToUser(token: Tokens.JSON): User{
    return {
        id: token.id,
        email: token.email,
        username: token.username,
        guest: token.guest,
    }
}