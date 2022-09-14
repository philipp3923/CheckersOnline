CREATE TABLE accounts(
    account_id int NOT NULL AUTO_INCREMENT,
    public_id varchar(255),
    email varchar(255),
    password varchar(255),
    last_login datetime,
    account_creation datetime,
    email_verified BOOLEAN DEFAULT false,
    PRIMARY KEY (account_id)
);

CREATE TABLE tokens(
    token_id int NOT NULL AUTO_INCREMENT,
    content varchar(255),
    token_creation datetime,
    account_id int NOT NULL,
    PRIMARY KEY (token_id),
    CONSTRAINT fk_account foreign key(account_id) references accounts.account_id
);