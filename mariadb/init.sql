CREATE TABLE accounts(
    account_id int NOT NULL AUTO_INCREMENT,
    account_id_ext varchar(255),
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
    CONSTRAINT fk_token_account Foreign Key (account_id)
        REFERENCES accounts(account_id)
);

CREATE TABLE games(
    game_id int NOT NULL AUTO_INCREMENT,
    game_id_ext varchar(255),
    time_limit int NOT NULL,
    start datetime NOT NULL,
    finish datetime,
    winner_number int,
    type varchar(255),
    PRIMARY KEY (game_id)
);

CREATE TABLE games_accounts(
  game_account_id int NOT NULL AUTO_INCREMENT,
  account_id int NOT NULL,
  game_id int NOT NULL,
  player_number int NOT NULL,
  PRIMARY KEY (game_account_id),
  CONSTRAINT fk_account_game Foreign Key (game_id)
      REFERENCES games(game_id),
  CONSTRAINT fk_game_account Foreign Key (account_id)
      REFERENCES accounts(account_id)
);

CREATE TABLE turns(
  turn_id int NOT NULL AUTO_INCREMENT,
  timestamp datetime NOT NULL,
  capture boolean default false,
  game_id int NOT NULL,
  player_number int NOT NULL,
  start_x int NOT NULL,
  start_y int NOT NULL,
  end_x int NOT NULL,
  end_y int NOT NULL,
  PRIMARY KEY (turn_id),
  CONSTRAINT fk_turn_game Foreign Key (game_id)
      REFERENCES games(game_id)
);