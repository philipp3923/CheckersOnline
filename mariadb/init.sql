CREATE TABLE accounts(
    account_id int NOT NULL AUTO_INCREMENT,
    user_id varchar(255),
    email varchar(255),
    username varchar(255),
    password varchar(255),
    last_login datetime NOT NULL,
    account_creation datetime NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    PRIMARY KEY (account_id)
);

CREATE TABLE tokens(
    token_id int NOT NULL AUTO_INCREMENT,
    content varchar(1024) NOT NULL,
    token_creation datetime NOT NULL,
    account_id int NOT NULL,
    PRIMARY KEY (token_id),
    CONSTRAINT fk_account Foreign Key (account_id)
    REFERENCES accounts(account_id)
);