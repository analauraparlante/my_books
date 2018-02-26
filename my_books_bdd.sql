DROP DATABASE IF EXISTS MY_BOOKS;
CREATE DATABASE IF NOT EXISTS MY_BOOKS;
USE MY_BOOKS;

CREATE TABLE IF NOT EXISTS `libros` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `comentario` varchar(100) NOT NULL,
  `creado` datetime NOT NULL,
  `ultimoUpdate` datetime DEFAULT NULL,
  `uniqueid` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueid` (`uniqueid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

    