-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2024 at 09:07 AM
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
(1, 'Building Maintenance Office (BMO)'),
(2, 'Computer Maintenance Office (CMO)'),
(3, 'College of Computer Studies (CCS)');

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
  `item_name` varchar(255) NOT NULL,
  `item_desc` mediumtext NOT NULL,
  `item_buy_date` varchar(255) NOT NULL,
  `item_buy_cost` int(12) NOT NULL,
  `item_total` int(12) NOT NULL,
  `item_remarks` varchar(255) NOT NULL,
  `item_status` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbitems`
--

INSERT INTO `tbitems` (`item_id`, `item_category`, `item_control`, `item_quantity`, `item_measure`, `item_name`, `item_desc`, `item_buy_date`, `item_buy_cost`, `item_total`, `item_remarks`, `item_status`, `dept_id`) VALUES
(1, 'Laboratory Equipments', NULL, 6, 'Units', 'Attachment Unit Intercourse - AUI Transceivers', 'with SN:\r\n-AAA-02614\r\n-AAA-02615\r\n-AAA-02616\r\n-AAA-02617\r\n2 units w/o S.N.', '2001-06-19', 3500, 21000, 'Complete', 'Available', 1),
(2, 'Laboratory Equipments', '', 3, 'Units', 'Cable Tester', 'w/ S.N.\r\n-620679\r\n-653785\r\n-509825803 (replaced)', '2001-06-19', 7000, 21000, 'Complete', 'Available', 2),
(3, 'Appliances/Electrical/Safety', '', 2, 'Units', 'Flashlights', 'Standard', '2005-06-19', 150, 300, 'Damaged', 'Available', 1),
(9, 'Computer System and Peripherals', '', 2, 'Units', 'LED Projector', 'w/ power cable and hdmi cable for each unit', '2024-11-04', 10000, 20000, 'OK', 'Available', 2);

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
  `rq_service_type` varchar(255) DEFAULT NULL,
  `rq_prio_level` varchar(255) NOT NULL,
  `rq_notes` varchar(255) NOT NULL,
  `rq_create_date` varchar(255) NOT NULL,
  `rq_complete_date` varchar(255) DEFAULT NULL,
  `rq_create_user_id` int(12) NOT NULL,
  `rq_accept_user_id` int(11) DEFAULT NULL,
  `rq_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbrequests`
--

INSERT INTO `tbrequests` (`rq_id`, `rq_type`, `dept_id`, `item_id`, `room_id`, `rq_service_type`, `rq_prio_level`, `rq_notes`, `rq_create_date`, `rq_complete_date`, `rq_create_user_id`, `rq_accept_user_id`, `rq_status`) VALUES
(1, 'Reserve Item', 2, 1, NULL, NULL, 'Moderate', 'test complete', '2024-09-30', '2024-10-6', 1, 2, 'Completed'),
(2, 'Reserve Facility', 2, NULL, 1, NULL, 'Moderate', 'checking', '2024-10-01', '', 1, 2, 'Accepted'),
(3, 'Service for Item', 2, 1, NULL, 'Maintenance', 'Moderate', 'test', '2024-10-01', NULL, 1, 3, 'Accepted'),
(10, 'Reserve Item', 2, 2, NULL, NULL, 'Moderate', 'test', '2024-10-1', NULL, 1, NULL, 'Request Submitted'),
(13, 'Reserve Item', 1, 3, NULL, NULL, 'Moderate', 'test', '2024-10-4', NULL, 1, NULL, 'Request Submitted'),
(17, 'Reserve Item', 1, 1, NULL, NULL, 'Urgent', 'test session', '2024-10-5', NULL, 1, 3, 'Accepted'),
(18, 'Service for Facility', 1, NULL, 1, 'Maintenance', 'Urgent', 'test approve maint', '2024-10-5', '', 1, 2, 'Service Aprroved'),
(19, 'Service for Facility', 1, NULL, 1, 'Other', 'Urgent', 'test prio', '2024-10-5', NULL, 1, NULL, 'Request Submitted'),
(20, 'Service for Item', 2, 3, NULL, 'Repair', 'Moderate', 'test submit', '2024-10-6', NULL, 2, 3, 'Accepted'),
(21, 'Service for Facility', 1, NULL, 1, 'Installation', 'Moderate', 'AC', '2024-10-6', NULL, 3, NULL, 'Request Submitted'),
(22, 'Reserve Facility', 2, NULL, 1, NULL, 'Urgent', 'test cmo queue', '2024-10-6', NULL, 2, 3, 'Accepted'),
(23, 'Reserve Item', 2, 2, NULL, NULL, 'Moderate', 'test', '2024-10-8', NULL, 2, NULL, 'Request Submitted');

-- --------------------------------------------------------

--
-- Table structure for table `tbrooms`
--

CREATE TABLE `tbrooms` (
  `room_id` int(12) NOT NULL,
  `room_bldg` varchar(255) NOT NULL,
  `room_floor` varchar(255) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `room_desc` varchar(255) NOT NULL,
  `room_status` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbrooms`
--

INSERT INTO `tbrooms` (`room_id`, `room_bldg`, `room_floor`, `room_name`, `room_desc`, `room_status`, `dept_id`) VALUES
(1, 'Old Building', '2nd Floor', 'Cisco Laboratory', 'Laboratory for networking and other computer-related activities', 'Service Approved: Maintenance', 2),
(2, 'Old Building', '2nd Floor', 'Computer Maintenance Office', 'Main office of CMO department', 'Available', 2),
(3, 'CBE Building', '4th Floor', 'CBE AVR', 'Audio Visual Room', 'Available', 1),
(4, 'Maritime Building', '6th Floor', 'Maritime AVR', 'Audio Visual Room', 'Available', 1),
(5, 'BE Building', '8th Floor', 'BE Auditorium', 'Auditorium', 'Available', 1),
(6, 'Annex B', '1st Floor', 'Function Hall', 'Ground', 'Available', 1);

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
(1, 10000000, 'admin', 'Joe', 'Admin', 'admin@mail.com', '12345678', 'Administrator', 2),
(2, 10000001, 'tech1', 'Joe', 'BMO', 'tech@mail.com', '12345678', 'Technical Staff', 1),
(3, 10000002, 'tech2', 'Joe', 'CMO', 'tech@mail.com', '12345678', 'Technical Staff', 2),
(4, 19140284, 'yumol', 'Ruthello John', 'Yumol', 'yumol.ruthellojohn157@gmail.com', '12345678', 'Administrator', 3),
(5, 20200754, 'josepulmones', 'Jose Ma.', 'Pulmones Jr.', '21jmpulmones@gmail.com', '09150411484', 'Technical Staff', 3),
(6, 19099456, 'glenn', 'Glenn', 'Toñacao', 'glenntoniacao@gmail.com', '0905268395', 'Technical Staff', 3),
(7, 19084821, 'hannah', 'Hannah Jane', 'Ferrer', 'hannahjaneferrer2@gmail.com', '0923445642', 'Technical Staff', 3),
(8, 20181622, 'jijil31', 'Angel Dianne', 'Ocier', 'angeldianneocier31@gmail.com', '09319100322', 'Technical Staff', 3);

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
  ADD KEY `dept_id for request` (`dept_id`),
  ADD KEY `create_user_id for request` (`rq_create_user_id`),
  ADD KEY `accept_user_id for request` (`rq_accept_user_id`);

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
  MODIFY `dept_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbitems`
--
ALTER TABLE `tbitems`
  MODIFY `item_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbnotifs`
--
ALTER TABLE `tbnotifs`
  MODIFY `notif_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbrequests`
--
ALTER TABLE `tbrequests`
  MODIFY `rq_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tbrooms`
--
ALTER TABLE `tbrooms`
  MODIFY `room_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbschedules`
--
ALTER TABLE `tbschedules`
  MODIFY `sched_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbuseraccounts`
--
ALTER TABLE `tbuseraccounts`
  MODIFY `user_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  ADD CONSTRAINT `create_user_id for request` FOREIGN KEY (`rq_create_user_id`) REFERENCES `tbuseraccounts` (`user_id`) ON UPDATE CASCADE,
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
