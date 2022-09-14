CREATE TABLE accounts(
    account_id int NOT NULL AUTO_INCREMENT,
    email varchar(255),
    password varchar(255),
    last_login datetime,
    account_creation datetime NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    PRIMARY KEY (account_id)
);

CREATE TABLE tokens(
    token_id int NOT NULL AUTO_INCREMENT,
    content varchar(255) NOT NULL,
    token_creation datetime NOT NULL,
    account_id int NOT NULL,
    PRIMARY KEY (token_id),
    CONSTRAINT fk_account Foreign Key (account_id)
    REFERENCES accounts(account_id)
);