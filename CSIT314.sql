CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `test`;

CREATE TABLE IF NOT EXISTS `user` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` longtext DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- Dumping data for table test.user: ~2 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`userid`, `username`, `password`) VALUES
	(6, 'Bagus', '$2b$10$aYmCP3mcwekEJZXlhfA79uOv19Sx8dj3eL8ceTjU0vodYIgLut0QS'),
	(11, 'Dishon', '$2b$10$vhFb24gMkUs97m8/gTtIy.6C9oRW8v9JQaro4nZjpmj8DiLQ37GLq'),
	(12, 'staff', '$2b$10$P8.4D5B1t12BKOHP0cDlduboKsTLSnfRF13mV6qb/2FdWtFL55Z6u');

CREATE TABLE IF NOT EXISTS `order` (
  `orderid` int(11) NOT NULL AUTO_INCREMENT,
  `tablenum` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`orderid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

INSERT INTO `order` (`orderid`, `tablenum`, `price`) VALUES
	(4, 3, 20);

-- Dumping structure for table test.item
CREATE TABLE IF NOT EXISTS `item` (
  `itemid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `photo` longtext DEFAULT NULL,
  PRIMARY KEY (`itemid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

INSERT INTO `item` (`itemid`, `name`, `price`, `description`, `category`, `photo`) VALUES
	(1, 'Strawberry Milkshake', 2.5, 'Made from local strawberry', 'drink', 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/strawberry-milkshake-4.jpg'),
	(2, 'Fried Chicken', 5, 'Delicious Fried chicken', 'food', 'https://d1e3z2jco40k3v.cloudfront.net/-/media/mccormicksea/recipes/desktop/ayamgoreng_desktop.jpg?rev=380d41fb0f314cb297247af342c829c5&vd=20210824T011336Z&hash=E683D51C5A46FC6445F28776A217A171');

CREATE TABLE IF NOT EXISTS `cart` (
  `tablenum` int(11) NOT NULL,
  `itemid` int(11) NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tablenum`,`itemid`) USING BTREE,
  KEY `FK__item` (`itemid`),
  CONSTRAINT `FK__item` FOREIGN KEY (`itemid`) REFERENCES `item` (`itemid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `cart` (`tablenum`, `itemid`, `quantity`) VALUES
	(3, 1, 2),
	(3, 2, 3);

CREATE TABLE IF NOT EXISTS `order_complete` (
  `orderid` int(11) NOT NULL,
  `tablenum` int(11) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `visit` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orderid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Dumping structure for table test.profile
CREATE TABLE IF NOT EXISTS `profile` (
  `userid` int(11) NOT NULL DEFAULT 0,
  `role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table test.profile: ~1 rows (approximately)
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` (`userid`, `role`) VALUES
	(6, 'admin'),
	(11, 'manager'),
	(12, 'staff');

CREATE TABLE IF NOT EXISTS `cart_complete` (
  `orderid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  KEY `FK__order_complete` (`orderid`),
  KEY `FK_cart_complete_item` (`itemid`),
  CONSTRAINT `FK__order_complete` FOREIGN KEY (`orderid`) REFERENCES `order_complete` (`orderid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_cart_complete_item` FOREIGN KEY (`itemid`) REFERENCES `item` (`itemid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

