-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema library_pi
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema library_pi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `library_pi` DEFAULT CHARACTER SET utf8 ;
USE `library_pi` ;

-- -----------------------------------------------------
-- Table `library_pi`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_pi`.`Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_pi`.`BookType`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_pi`.`BookType` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_pi`.`Books`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_pi`.`Books` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `isbn` VARCHAR(45) NOT NULL,
  `serie` VARCHAR(255) NULL,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `publicationDate` DATE NULL,
  `editor` VARCHAR(255) NULL,
  `langage` VARCHAR(2) NULL,
  `tome` DECIMAL(1) NOT NULL,
  `BookType_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `isbn_UNIQUE` (`isbn` ASC) VISIBLE,
  UNIQUE INDEX `title_UNIQUE` (`title` ASC) VISIBLE,
  INDEX `fk_Books_BookType_idx` (`BookType_id` ASC) VISIBLE,
  CONSTRAINT `fk_Books_BookType`
    FOREIGN KEY (`BookType_id`)
    REFERENCES `library_pi`.`BookType` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_pi`.`Users_has_Books`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_pi`.`Users_has_Books` (
  `Users_id` INT NOT NULL,
  `Books_id` INT UNSIGNED NOT NULL,
  `timestamp` DATE NOT NULL,
  `read` TINYINT NOT NULL,
  `rate` INT NULL,
  `comment` LONGTEXT NULL,
  PRIMARY KEY (`Users_id`, `Books_id`),
  INDEX `fk_Users_has_Books_Books1_idx` (`Books_id` ASC) VISIBLE,
  INDEX `fk_Users_has_Books_Users1_idx` (`Users_id` ASC) VISIBLE,
  CONSTRAINT `fk_Users_has_Books_Users1`
    FOREIGN KEY (`Users_id`)
    REFERENCES `library_pi`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_has_Books_Books1`
    FOREIGN KEY (`Books_id`)
    REFERENCES `library_pi`.`Books` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


INSERT INTO `library_pi`.`BookType` (`type`) VALUES ('livre');
INSERT INTO `library_pi`.`BookType` (`type`) VALUES ('manga');
INSERT INTO `library_pi`.`BookType` (`type`) VALUES ('BD');
INSERT INTO `library_pi`.`BookType` (`type`) VALUES ('comics');

