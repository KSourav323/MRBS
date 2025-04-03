-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2025 at 05:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mrbs`
--

-- --------------------------------------------------------

--
-- Table structure for table `mrbs_area`
--

CREATE TABLE `mrbs_area` (
  `id` int(11) NOT NULL,
  `area_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_admin_email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approval_enabled` tinyint(4) DEFAULT 0,
  `is_public` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrbs_area`
--

INSERT INTO `mrbs_area` (`id`, `area_name`, `area_admin_email`, `approval_enabled`, `is_public`) VALUES
(1, 'Main', 'souravcndtl@gmail.com', 1, 1),
(2, 'CSED', 'souravkaip@gmail.com', 1, 0),
(3, 'elhc', 'souravcndtl@gmail.com', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `mrbs_entry`
--

CREATE TABLE `mrbs_entry` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL DEFAULT '00:00:00',
  `end_time` time NOT NULL DEFAULT '00:00:00',
  `room_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `create_by` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `subject` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_approved` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrbs_entry`
--

INSERT INTO `mrbs_entry` (`id`, `date`, `start_time`, `end_time`, `room_id`, `area_id`, `timestamp`, `create_by`, `subject`, `description`, `is_approved`) VALUES
(1, '2025-03-31', '18:04:00', '19:04:00', 1, 1, '2025-03-29 09:57:57', 'souravcndtl@gmail.com', 'meeting', 'small meeting', -1),
(20, '2025-03-31', '08:30:00', '09:30:00', 3, 1, '2025-03-30 20:21:30', 'souravcndtl@gmail.com', 'ss', 'wfe', -1),
(24, '2025-03-31', '10:00:00', '14:00:00', 2, 2, '2025-03-30 20:47:10', 'souravcndtl@gmail.com', 'ewdf', 'egwef', 1),
(25, '2025-03-31', '09:00:00', '10:00:00', 4, 2, '2025-03-30 20:49:35', 'souravkaip@gmail.com', 'dfdfv', 'sfbdf', 1),
(26, '2025-03-31', '13:00:00', '14:00:00', 5, 3, '2025-03-31 07:59:21', 'souravcndtl@gmail.com', 'fa', 'sd', 1),
(27, '2025-03-31', '18:30:00', '19:30:00', 5, 3, '2025-03-31 08:00:28', 'souravcndtl@gmail.com', 'dsf', 'wrg', 1),
(29, '2025-03-31', '17:00:00', '19:30:00', 1, 1, '2025-03-31 13:23:06', 'souravcndtl@gmail.com', 'Meeting', 'trail', 1),
(32, '2025-03-31', '08:30:00', '12:30:00', 3, 1, '2025-04-03 15:13:33', 'souravcndtl@gmail.com', 'test', 'this is a test', -1),
(33, '2025-03-31', '12:30:00', '16:00:00', 1, 1, '2025-03-31 18:23:37', 'souravcndtl@gmail.com', 'testing', 'this is also a test', 1),
(34, '2025-04-03', '09:00:00', '13:00:00', 1, 1, '2025-04-03 08:33:21', 'souravcndtl@gmail.com', 'sdgesdw', 'sdgsf', 1),
(35, '2025-04-03', '09:00:00', '10:00:00', 3, 1, '2025-04-03 15:13:34', 'souravcndtl@gmail.com', 'sa', 'ef', -1),
(36, '2025-04-03', '12:30:00', '13:30:00', 3, 1, '2025-04-03 15:13:35', 'souravcndtl@gmail.com', 'as', 'saddf', -1),
(37, '2025-04-03', '08:30:00', '09:30:00', 3, 1, '2025-04-03 15:27:43', 'souravcndtl@gmail.com', 'dsf', 'sdf', 1),
(38, '2025-04-03', '11:00:00', '12:00:00', 3, 1, '2025-04-03 15:28:15', 'souravcndtl@gmail.com', 'sasdf', 'dsf', 1),
(39, '2025-04-03', '14:00:00', '15:00:00', 3, 1, '2025-04-03 15:32:44', 'souravcndtl@gmail.com', 'dsf', 'adsafd', 1);

-- --------------------------------------------------------

--
-- Table structure for table `mrbs_room`
--

CREATE TABLE `mrbs_room` (
  `id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL DEFAULT 0,
  `room_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` int(11) NOT NULL DEFAULT 0,
  `room_admin_email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrbs_room`
--

INSERT INTO `mrbs_room` (`id`, `area_id`, `room_name`, `description`, `capacity`, `room_admin_email`) VALUES
(1, 1, 'Aryabhatta', 'large hall', 200, 'souravcndtl@gmail.com'),
(2, 2, 'Discussion hall', 'meeting room', 10, 'souravkaip@gmail.com'),
(3, 1, 'Bhaskara', 'another hall', 200, 'souravcndtl@gmail.com'),
(4, 2, 'seminar hall', 'ac', 50, 'souravcndtl@gmail.com'),
(5, 3, '401', 'examhall', 100, 'souravcndtl@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `mrbs_users`
--

CREATE TABLE `mrbs_users` (
  `id` int(11) NOT NULL,
  `level` smallint(6) NOT NULL DEFAULT 0,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrbs_users`
--

INSERT INTO `mrbs_users` (`id`, `level`, `name`, `email`, `timestamp`) VALUES
(1, 2, 'Sourav', 'souravcndtl@gmail.com', '2025-03-29 09:30:39'),
(2, 1, 'Naveen', 'souravkaip@gmail.com', '2025-03-29 09:31:22'),
(9, 1, 'testname', 'testemail@gmail.com', '2025-04-03 08:32:46'),
(10, 1, 'test2name', 'test2email@gmail.com', '2025-04-03 08:32:46'),
(11, 1, 'dzvgsdf', 'sdfs@gmail.com', '2025-04-03 08:32:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mrbs_area`
--
ALTER TABLE `mrbs_area`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_area_name` (`area_name`);

--
-- Indexes for table `mrbs_entry`
--
ALTER TABLE `mrbs_entry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idxStartTime` (`start_time`),
  ADD KEY `idxEndTime` (`end_time`),
  ADD KEY `idxRoomStartEnd` (`room_id`,`start_time`,`end_time`);

--
-- Indexes for table `mrbs_room`
--
ALTER TABLE `mrbs_room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_room_name` (`area_id`,`room_name`);

--
-- Indexes for table `mrbs_users`
--
ALTER TABLE `mrbs_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mrbs_area`
--
ALTER TABLE `mrbs_area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mrbs_entry`
--
ALTER TABLE `mrbs_entry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `mrbs_room`
--
ALTER TABLE `mrbs_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mrbs_users`
--
ALTER TABLE `mrbs_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mrbs_entry`
--
ALTER TABLE `mrbs_entry`
  ADD CONSTRAINT `mrbs_entry_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `mrbs_room` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `mrbs_room`
--
ALTER TABLE `mrbs_room`
  ADD CONSTRAINT `mrbs_room_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `mrbs_area` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
