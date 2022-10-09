-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'accounts'
-- 
-- ---

DROP TABLE IF EXISTS `accounts`;
		
CREATE TABLE `accounts` (
  `id` INTEGER NULL AUTO_INCREMENT,
  `ext_id` MEDIUMTEXT NOT NULL,
  `creation` TIMESTAMP NOT NULL,
  `last_login` TIMESTAMP NULL,
  `active` boolean NOT NULL,
  `guest` boolean NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
		
CREATE TABLE `users` (
  `id` INTEGER NULL AUTO_INCREMENT,
  `username` MEDIUMTEXT NOT NULL,
  `email` MEDIUMTEXT NOT NULL,
  `password` MEDIUMTEXT NOT NULL,
  `id_accounts` INTEGER NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'refresh_tokens'
-- 
-- ---

DROP TABLE IF EXISTS `refresh_tokens`;
		
CREATE TABLE `refresh_tokens` (
  `id` INTEGER NULL AUTO_INCREMENT,
  `content` MEDIUMTEXT NULL,
  `creation` TIMESTAMP NOT NULL,
  `id_accounts` INTEGER NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'friends'
-- 
-- ---

DROP TABLE IF EXISTS `friends`;
		
CREATE TABLE `friends` (
  `id` INTEGER NULL AUTO_INCREMENT,
  `creation` TIMESTAMP NOT NULL,
  `id_user` INTEGER NULL,
  `id_friend` INTEGER NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'games'
-- 
-- ---

DROP TABLE IF EXISTS `games`;
		
CREATE TABLE `games` (
  `id` INTEGER NULL AUTO_INCREMENT,
  `ext_id` MEDIUMTEXT NOT NULL,
  `time_limit` INTEGER NOT NULL,
  `start` TIMESTAMP NOT NULL,
  `finish` TIMESTAMP NULL,
  `winner` INTEGER NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'players'
-- 
-- ---

DROP TABLE IF EXISTS `players`;
		
CREATE TABLE `players` (
  `id` INTEGER NULL AUTO_INCREMENT,
  `id_games` INTEGER NULL,
  `id_accounts` INTEGER NULL,
  `number` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'turns'
-- 
-- ---

DROP TABLE IF EXISTS `turns`;
		
CREATE TABLE `turns` (
  `id` INTEGER NULL AUTO_INCREMENT,
  `creation` TIMESTAMP NOT NULL,
  `capture` boolean NOT NULL,
  `player` INTEGER NULL,
  `start_x` INTEGER NOT NULL,
  `start_y` INTEGER NOT NULL,
  `end_x` INTEGER NOT NULL,
  `end_y` INTEGER NOT NULL,
  `id_games` INTEGER NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `users` ADD FOREIGN KEY (id_accounts) REFERENCES `accounts` (`id`);
ALTER TABLE `refresh_tokens` ADD FOREIGN KEY (id_accounts) REFERENCES `accounts` (`id`);
ALTER TABLE `friends` ADD FOREIGN KEY (id_user) REFERENCES `users` (`id`);
ALTER TABLE `friends` ADD FOREIGN KEY (id_friend) REFERENCES `users` (`id`);
ALTER TABLE `players` ADD FOREIGN KEY (id_games) REFERENCES `games` (`id`);
ALTER TABLE `players` ADD FOREIGN KEY (id_accounts) REFERENCES `accounts` (`id`);
ALTER TABLE `turns` ADD FOREIGN KEY (id_games) REFERENCES `games` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `accounts` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `refresh_tokens` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `friends` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `games` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `players` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `turns` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `accounts` (`id`,`ext_id`,`creation`,`last_login`,`active`,`guest`) VALUES
-- ('','','','','','');
-- INSERT INTO `users` (`id`,`username`,`email`,`password`,`id_accounts`) VALUES
-- ('','','','','');
-- INSERT INTO `refresh_tokens` (`id`,`content`,`creation`,`id_accounts`) VALUES
-- ('','','','');
-- INSERT INTO `friends` (`id`,`creation`,`id_user`,`id_friend`) VALUES
-- ('','','','');
-- INSERT INTO `games` (`id`,`ext_id`,`time_limit`,`start`,`finish`,`winner`) VALUES
-- ('','','','','','');
-- INSERT INTO `players` (`id`,`id_games`,`id_accounts`,`number`) VALUES
-- ('','','','');
-- INSERT INTO `turns` (`id`,`creation`,`capture`,`player`,`start_x`,`start_y`,`end_x`,`end_y`,`id_games`) VALUES
-- ('','','','','','','','','');
