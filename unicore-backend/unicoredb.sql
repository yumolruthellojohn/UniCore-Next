-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2024 at 08:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `unicoredb`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbdepartments`
--

CREATE TABLE `tbdepartments` (
  `dept_id` int(12) NOT NULL,
  `dept_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbdepartments`
--

INSERT INTO `tbdepartments` (`dept_id`, `dept_name`) VALUES
(1, 'None'),
(2, 'College of Computer Studies (CCS)');

-- --------------------------------------------------------

--
-- Table structure for table `tbitems`
--

CREATE TABLE `tbitems` (
  `item_id` int(12) NOT NULL,
  `item_category` varchar(255) NOT NULL,
  `item_control` varchar(255) DEFAULT NULL,
  `item_quantity` int(12) NOT NULL,
  `item_measure` varchar(255) NOT NULL,
  `item_name_desc` mediumtext NOT NULL,
  `item_buy_date` varchar(255) NOT NULL,
  `item_buy_cost` int(12) NOT NULL,
  `item_total` int(12) NOT NULL,
  `item_remarks` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbitems`
--

INSERT INTO `tbitems` (`item_id`, `item_category`, `item_control`, `item_quantity`, `item_measure`, `item_name_desc`, `item_buy_date`, `item_buy_cost`, `item_total`, `item_remarks`, `dept_id`) VALUES
(1, 'Laboratory Equipments', NULL, 6, 'Units', 'Attachment Unit Intercourse - AUI Transceivers with SN:\r\n-AAA-02614\r\n-AAA-02615\r\n-AAA-02616\r\n-AAA-02617\r\n2 units w/o S.N.', '06/19/01', 3500, 21000, 'Complete', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tblogs`
--

CREATE TABLE `tblogs` (
  `log_id` int(12) NOT NULL,
  `log_type` varchar(255) NOT NULL,
  `log_date` varchar(255) NOT NULL,
  `log_user_id` int(12) DEFAULT NULL,
  `log_item_id` int(12) DEFAULT NULL,
  `log_room_id` int(12) DEFAULT NULL,
  `log_rq_id` int(12) DEFAULT NULL,
  `log_sched_id` int(12) DEFAULT NULL,
  `log_details` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbnotifs`
--

CREATE TABLE `tbnotifs` (
  `notif_id` int(12) NOT NULL,
  `notif_user_id` int(12) NOT NULL,
  `notif_type` varchar(255) NOT NULL,
  `notif_content` varchar(255) NOT NULL,
  `notif_date` varchar(255) NOT NULL,
  `notif_read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbrequests`
--

CREATE TABLE `tbrequests` (
  `rq_id` int(12) NOT NULL,
  `rq_type` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL,
  `item_id` int(12) DEFAULT NULL,
  `room_id` int(12) DEFAULT NULL,
  `rq_notes` varchar(255) NOT NULL,
  `rq_create_date` varchar(255) NOT NULL,
  `rq_complete_date` varchar(255) DEFAULT NULL,
  `rq_create_user_id` int(12) NOT NULL,
  `rq_accept_user_id` int(11) DEFAULT NULL,
  `rq_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbrooms`
--

CREATE TABLE `tbrooms` (
  `room_id` int(12) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `room_desc` varchar(255) NOT NULL,
  `room_status` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbschedules`
--

CREATE TABLE `tbschedules` (
  `sched_id` int(12) NOT NULL,
  `sched_user_id` int(12) NOT NULL,
  `sched_dept_id` int(12) NOT NULL,
  `sched_time_in` varchar(255) NOT NULL,
  `sched_time_out` varchar(255) NOT NULL,
  `sched_mon` tinyint(1) NOT NULL,
  `sched_tue` tinyint(1) NOT NULL,
  `sched_wed` tinyint(1) NOT NULL,
  `sched_thu` tinyint(1) NOT NULL,
  `sched_fri` tinyint(1) NOT NULL,
  `sched_sat` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbuseraccounts`
--

CREATE TABLE `tbuseraccounts` (
  `user_id` int(12) NOT NULL,
  `user_idnum` int(12) NOT NULL,
  `user_password` varchar(50) NOT NULL,
  `user_fname` varchar(255) NOT NULL,
  `user_lname` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_contact` varchar(255) NOT NULL,
  `user_type` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbuseraccounts`
--

INSERT INTO `tbuseraccounts` (`user_id`, `user_idnum`, `user_password`, `user_fname`, `user_lname`, `user_email`, `user_contact`, `user_type`, `dept_id`) VALUES
(1, 10000000, 'admin', 'Joe', 'Admin', 'admin@mail.com', '12345678', 'Administrator', 1),
(2, 10000001, 'technical', 'Joe', 'Tech', 'tech@mail.com', '12345678', 'Technical Staff', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbdepartments`
--
ALTER TABLE `tbdepartments`
  ADD PRIMARY KEY (`dept_id`);

--
-- Indexes for table `tbitems`
--
ALTER TABLE `tbitems`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `dept_id for item` (`dept_id`);

--
-- Indexes for table `tbnotifs`
--
ALTER TABLE `tbnotifs`
  ADD PRIMARY KEY (`notif_id`);

--
-- Indexes for table `tbrequests`
--
ALTER TABLE `tbrequests`
  ADD PRIMARY KEY (`rq_id`),
  ADD KEY `dept_id for request` (`dept_id`);

--
-- Indexes for table `tbrooms`
--
ALTER TABLE `tbrooms`
  ADD PRIMARY KEY (`room_id`),
  ADD KEY `dept_id for room` (`dept_id`);

--
-- Indexes for table `tbschedules`
--
ALTER TABLE `tbschedules`
  ADD PRIMARY KEY (`sched_id`);

--
-- Indexes for table `tbuseraccounts`
--
ALTER TABLE `tbuseraccounts`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `dept_id for user` (`dept_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbdepartments`
--
ALTER TABLE `tbdepartments`
  MODIFY `dept_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbitems`
--
ALTER TABLE `tbitems`
  MODIFY `item_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbnotifs`
--
ALTER TABLE `tbnotifs`
  MODIFY `notif_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbrequests`
--
ALTER TABLE `tbrequests`
  MODIFY `rq_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbrooms`
--
ALTER TABLE `tbrooms`
  MODIFY `room_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbschedules`
--
ALTER TABLE `tbschedules`
  MODIFY `sched_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbuseraccounts`
--
ALTER TABLE `tbuseraccounts`
  MODIFY `user_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbitems`
--
ALTER TABLE `tbitems`
  ADD CONSTRAINT `dept_id for item` FOREIGN KEY (`dept_id`) REFERENCES `tbdepartments` (`dept_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbrequests`
--
ALTER TABLE `tbrequests`
  ADD CONSTRAINT `dept_id for request` FOREIGN KEY (`dept_id`) REFERENCES `tbdepartments` (`dept_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbrooms`
--
ALTER TABLE `tbrooms`
  ADD CONSTRAINT `dept_id for room` FOREIGN KEY (`dept_id`) REFERENCES `tbdepartments` (`dept_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbuseraccounts`
--
ALTER TABLE `tbuseraccounts`
  ADD CONSTRAINT `dept_id for user` FOREIGN KEY (`dept_id`) REFERENCES `tbdepartments` (`dept_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
