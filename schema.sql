-- F1™ Poolers - Database Schema & Seed Data
-- Designed for MySQL on Ubuntu Server

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for `system_settings`
-- --------------------------------------------------------
CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `theme` varchar(20) DEFAULT 'original',
  `terms_content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `system_settings` (`theme`, `terms_content`) VALUES
('original', 'F1™ POOLERS - TERMS AND CONDITIONS\n\n1. ACCEPTANCE OF TERMS\nBy accessing or using F1™ Poolers, you agree to be bound by these Terms and Conditions.\n\n2. TRADEMARKS AND COPYRIGHTS\nF1, FORMULA 1, F1 logo, and related marks are trademarks of Formula One Licensing BV, a Formula 1 company. All rights reserved. F1™ Poolers is a fan-made platform for entertainment purposes and is NOT an official game or product of Formula 1 or any of its subsidiaries. All car liveries, driver photos, and team logos used in this application are for illustrative purposes to enhance the user experience and remain the property of their respective copyright holders.\n\n3. NO REAL WORLD PRIZES\nF1™ Poolers is strictly a \"fun-coins\" based platform. \"Fun-Coins\" are virtual tokens with no real-world monetary value. They cannot be withdrawn, exchanged for cash, or used to purchase physical goods. F1™ Poolers does not pay out any kind of physical or monetary prizes for any results within the application.\n\n4. SOCIAL LEAGUES AND THIRD-PARTY PRIZES\nUsers have the ability to create and manage private \"Leagues\". Any prizes, rewards, or stakes offered, promised, or distributed by league creators/admins are the sole responsibility of said individuals. F1™ Poolers is not a party to these arrangements and shall not be held liable for any disputes, non-delivery, or issues arising from league-specific prizes.\n\n5. ELIGIBILITY\nYou must be at least 18 years of age to use this platform.\n\n6. CONDUCT\nUsers must maintain sporting conduct in league chats. We reserve the right to suspend accounts for abusive behavior.');

-- --------------------------------------------------------
-- Table structure for `teams`
-- --------------------------------------------------------
CREATE TABLE `teams` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `teams` (`id`, `name`, `nationality`, `logo_url`) VALUES
('audi', 'Audi F1 Team', 'German', 'https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber-logo.png.transform/2col/image.png'),
('alpine', 'BWT Alpine F1 Team', 'French', 'https://media.formula1.com/content/dam/fom-website/teams/2024/alpine-logo.png.transform/2col/image.png'),
('astonmartin', 'Aston Martin Aramco F1 Team', 'British', 'https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin-logo.png.transform/2col/image.png'),
('ferrari', 'Scuderia Ferrari HP', 'Italian', 'https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari-logo.png.transform/2col/image.png'),
('haas', 'MoneyGram Haas F1 Team', 'American', 'https://media.formula1.com/content/dam/fom-website/teams/2024/haas-f1-team-logo.png.transform/2col/image.png'),
('mclaren', 'McLaren Formula 1 Team', 'British', 'https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren-logo.png.transform/2col/image.png'),
('mercedes', 'Mercedes-AMG PETRONAS F1 Team', 'German', 'https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes-logo.png.transform/2col/image.png'),
('redbull', 'Oracle Red Bull Racing', 'Austrian', 'https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing-logo.png.transform/2col/image.png'),
('vcarb', 'Visa Cash App RB F1 Team', 'Italian', 'https://media.formula1.com/content/dam/fom-website/teams/2024/rb-logo.png.transform/2col/image.png'),
('williams', 'Williams Racing', 'British', 'https://media.formula1.com/content/dam/fom-website/teams/2024/williams-logo.png.transform/2col/image.png');

-- --------------------------------------------------------
-- Table structure for `drivers`
-- --------------------------------------------------------
CREATE TABLE `drivers` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `team_id` varchar(50) NOT NULL,
  `number` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `drivers` (`id`, `name`, `nationality`, `team_id`, `number`, `image_url`) VALUES
('verstappen', 'Max Verstappen', 'Dutch', 'redbull', 1, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/verstappen.jpg.img.1024.medium.jpg'),
('lawson', 'Liam Lawson', 'New Zealander', 'redbull', 30, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/lawson.jpg.img.1024.medium.jpg'),
('leclerc', 'Charles Leclerc', 'Monegasque', 'ferrari', 16, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/leclerc.jpg.img.1024.medium.jpg'),
('hamilton', 'Lewis Hamilton', 'British', 'ferrari', 44, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/hamilton.jpg.img.1024.medium.jpg'),
('norris', 'Lando Norris', 'British', 'mclaren', 4, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/norris.jpg.img.1024.medium.jpg'),
('piastri', 'Oscar Piastri', 'Australian', 'mclaren', 81, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/piastri.jpg.img.1024.medium.jpg'),
('russell', 'George Russell', 'British', 'mercedes', 63, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/russell.jpg.img.1024.medium.jpg'),
('antonelli', 'Kimi Antonelli', 'Italian', 'mercedes', 12, 'https://picsum.photos/seed/antonelli/200/200'),
('alonso', 'Fernando Alonso', 'Spanish', 'astonmartin', 14, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/alonso.jpg.img.1024.medium.jpg'),
('stroll', 'Lance Stroll', 'Canadian', 'astonmartin', 18, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/stroll.jpg.img.1024.medium.jpg'),
('gasly', 'Pierre Gasly', 'French', 'alpine', 10, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/gasly.jpg.img.1024.medium.jpg'),
('doohan', 'Jack Doohan', 'Australian', 'alpine', 7, 'https://picsum.photos/seed/doohan/200/200'),
('albon', 'Alexander Albon', 'Thai', 'williams', 23, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/albon.jpg.img.1024.medium.jpg'),
('sainz', 'Carlos Sainz', 'Spanish', 'williams', 55, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/sainz.jpg.img.1024.medium.jpg'),
('ocon', 'Esteban Ocon', 'French', 'haas', 31, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/ocon.jpg.img.1024.medium.jpg'),
('bearman', 'Oliver Bearman', 'British', 'haas', 87, 'https://picsum.photos/seed/bearman/200/200'),
('tsunoda', 'Yuki Tsunoda', 'Japanese', 'vcarb', 22, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/tsunoda.jpg.img.1024.medium.jpg'),
('hadjar', 'Isack Hadjar', 'French', 'vcarb', 6, 'https://picsum.photos/seed/hadjar/200/200'),
('hulkenberg', 'Nico Hulkenberg', 'German', 'audi', 27, 'https://media.formula1.com/content/dam/fom-website/drivers/2024Drivers/hulkenberg.jpg.img.1024.medium.jpg'),
('bortoleto', 'Gabriel Bortoleto', 'Brazilian', 'audi', 5, 'https://picsum.photos/seed/bortoleto/200/200');

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `balance` int(11) DEFAULT 100,
  `points` int(11) DEFAULT 0,
  `is_admin` boolean DEFAULT false,
  `age` int(11) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `terms_accepted` boolean DEFAULT true,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `password`, `avatar_url`, `balance`, `points`, `is_admin`, `age`, `country`) VALUES
('admin', 'admin', 'admin', 'https://picsum.photos/seed/adminuser/100/100', 999999, 0, true, 99, 'FIA');

COMMIT;
