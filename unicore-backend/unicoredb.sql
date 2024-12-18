-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2024 at 06:37 AM
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
(3, 'College of Computer Studies (CCS)'),
(4, 'College of Engineering (CE)'),
(5, 'College of Business Education (CBE)'),
(6, 'College of Customs Administration (CCA)'),
(7, 'College of Criminology (CC)'),
(8, 'Library'),
(9, 'Guidance Services'),
(10, 'Registrar'),
(11, 'Administrative Affairs');

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
  `dept_id` int(12) NOT NULL,
  `item_reserved` int(12) NOT NULL,
  `item_serviced` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbitems`
--

INSERT INTO `tbitems` (`item_id`, `item_category`, `item_control`, `item_quantity`, `item_measure`, `item_name`, `item_desc`, `item_buy_date`, `item_buy_cost`, `item_total`, `item_remarks`, `item_status`, `dept_id`, `item_reserved`, `item_serviced`) VALUES
(1, 'Laboratory Equipments', 'CISCO-023', 6, 'Units', 'Attachment Unit Intercourse - AUI Transceivers', 'with SN:\r\n-AAA-02614\r\n-AAA-02615\r\n-AAA-02616\r\n-AAA-02617\r\n2 units w/o S.N.', '2001-06-19', 3500, 21000, 'Complete', 'Available', 2, 0, 0),
(2, 'Laboratory Equipments', 'CISCO-025', 3, 'Units', 'Cable Tester', 'w/ S.N.\r\n-620679\r\n-653785\r\n-509825803 (replaced)', '2001-06-19', 7000, 21000, 'Complete', 'Available', 2, 0, 0),
(3, 'Appliances, Electrical, Safety', '', 2, 'Units', 'Flashlights', 'Standard', '2005-06-19', 150, 300, 'Damaged', 'Available', 2, 0, 0),
(9, 'Computer System and Peripherals', '', 3, 'Units', 'LED Projector', 'w/ power cable and hdmi cable for each unit', '2024-11-04', 10000, 20000, 'OK', 'Available', 2, 0, 0),
(10, 'Appliances, Electrical, Safety', '', 1, 'pc', 'NSS 3-Socket Extension Outlet', 'NS-8164 10A 250V', '2024-08-01', 200, 200, 'Ok', 'Available', 2, 0, 0),
(11, 'Furnitures and Fixtures', '', 30, 'Pcs', 'Tables', 'Multi-Purpose', '2005-06-25', 1200, 36000, 'Ok', 'Available', 1, 0, 0),
(12, 'Furnitures and Fixtures', '', 30, 'Pcs', 'Ergonomic Chairs', 'Clerical chair w/o arm, w/ gas lift', '2005-07-25', 1000, 30000, 'Damaged: 1', 'Available', 1, 0, 0),
(13, 'Appliances/Electrical/Safety', '', 10, 'Pcs', 'Extension Cables', '4 Outlets', '2007-09-13', 300, 3000, 'Ok', 'Available', 1, 0, 0),
(14, 'Laboratory Equipments', '', 1, 'Pc', 'Digital Multimeter', 'working', '2020-11-18', 300, 300, 'ok', 'Available', 2, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbjobrequests`
--

CREATE TABLE `tbjobrequests` (
  `job_id` int(12) NOT NULL,
  `job_rq_id` int(12) NOT NULL,
  `job_dept_id` int(12) NOT NULL,
  `job_create_date` varchar(255) NOT NULL,
  `job_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`job_items`)),
  `job_purpose` varchar(255) NOT NULL,
  `job_create_user_id` int(12) NOT NULL,
  `job_letter` mediumtext DEFAULT NULL,
  `job_bmo_approval` varchar(255) NOT NULL,
  `job_bmo_user_id` int(11) DEFAULT NULL,
  `job_bmo_notes` varchar(255) DEFAULT NULL,
  `job_custodian_approval` varchar(255) NOT NULL,
  `job_custodian_user_id` int(12) DEFAULT NULL,
  `job_custodian_notes` varchar(255) DEFAULT NULL,
  `job_cads_approval` varchar(255) NOT NULL,
  `job_cads_user_id` int(12) DEFAULT NULL,
  `job_cads_notes` varchar(255) DEFAULT NULL,
  `job_recommendation` mediumtext DEFAULT NULL,
  `job_estimated_cost` int(12) DEFAULT NULL,
  `job_recommend_user_id` int(12) DEFAULT NULL,
  `job_status` varchar(255) DEFAULT NULL,
  `job_remarks` varchar(255) DEFAULT NULL,
  `job_complete_date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbjobrequests`
--

INSERT INTO `tbjobrequests` (`job_id`, `job_rq_id`, `job_dept_id`, `job_create_date`, `job_items`, `job_purpose`, `job_create_user_id`, `job_letter`, `job_bmo_approval`, `job_bmo_user_id`, `job_bmo_notes`, `job_custodian_approval`, `job_custodian_user_id`, `job_custodian_notes`, `job_cads_approval`, `job_cads_user_id`, `job_cads_notes`, `job_recommendation`, `job_estimated_cost`, `job_recommend_user_id`, `job_status`, `job_remarks`, `job_complete_date`) VALUES
(1, 1, 2, '2024-11-25', '[{\"quantity\":1,\"name_desc\":\"item1\"},{\"quantity\":2,\"name_desc\":\"item2\"},{\"quantity\":3,\"name_desc\":\"item3\"}]', 'testing', 6, 'Dear 123\n\nI am writing to formally request the following job items for our department:\n\n123\n\nThe purpose of this request is 123\n\nThank you for considering this request. I look forward to your prompt response.\n\nSincerely,\n[Your Name]\n[Your Position]\n[Your Department]\n[Date]', 'Approved', 2, 'Forwarding', 'Approved', 9, 'ok', 'Approved', 10, 'ok', 'test', 10, 2, 'Completed', 'ok', '2024-11-28'),
(2, 2, 2, '2024-11-25', '[{\"quantity\":7,\"name_desc\":\"item7\"},{\"quantity\":8,\"name_desc\":\"item8\"}]', 'test', 6, 'Dear 78\nI am writing to formally request the following job items for our department:\n\n1. [Item Description 1] - Quantity: [Quantity 1]\n2. [Item Description 2] - Quantity: [Quantity 2]\n3. [Item Description 3] - Quantity: [Quantity 3]\n\nThe purpose of this request is [briefly explain the purpose of the request]. \n\nThank you for considering this request. I look forward to your prompt response.\n\nSincerely,\n[Your Name]\n[Your Position]\n[Your Department]\n[Date]', 'Approved', 2, 'testing', 'Pending', 9, 'no', 'Pending', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL),
(3, 3, 3, '2024-11-26', '[{\"quantity\":1,\"name_desc\":\"qwe\"},{\"quantity\":2,\"name_desc\":\"asd\"},{\"quantity\":2,\"name_desc\":\"zxc\"}]', 'asd', 5, 'Dear asd\n\nI am writing to formally request the following job items for our department:\n\n1. [Item Description 1] - Quantity: [Quantity 1]\n2. [Item Description 2] - Quantity: [Quantity 2]\n3. [Item Description 3] - Quantity: [Quantity 3]\n\nThe purpose of this request is [briefly explain the purpose of the request]. \n\nThank you for considering this request. I look forward to your prompt response.\n\nSincerely,\n[Your Name]\n[Your Position]\n[Your Department]\n[Date]', 'Approved', 2, 'aprv', 'Pending', NULL, NULL, 'Pending', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL),
(4, 4, 3, '2024-11-27', '[{\"quantity\":1,\"name_desc\":\"item1\"},{\"quantity\":2,\"name_desc\":\"item2\"},{\"quantity\":3,\"name_desc\":\"item3\"}]', 'test', 5, 'Dear [Recipient\'s Name],\n\nI am writing to formally request the following job items for our department:\n\n1. [Item Description 1] - Quantity: [Quantity 1]\n2. [Item Description 2] - Quantity: [Quantity 2]\n3. [Item Description 3] - Quantity: [Quantity 3]\n\nThe purpose of this request is [briefly explain the purpose of the request]. \n\nThank you for considering this request. I look forward to your prompt response.\n\nSincerely,\n[Your Name]\n[Your Position]\n[Your Department]\n[Date]', 'Approved', 2, 'test aprob', 'Approved', 9, 'ok', 'Approved', 10, 'approve', 'test', 10000, 2, 'Completed', 'ok', '2024-12-9'),
(5, 5, 2, '2024-12-09', '[{\"quantity\":1,\"name_desc\":\"item 1\"},{\"quantity\":2,\"name_desc\":\"item 2\"},{\"quantity\":3,\"name_desc\":\"item 3\"}]', 'testing', 6, 'Dear [Recipient\'s Name],\n\nI am writing to formally request the following job items for our department:\n\n1. [Item Description 1] - Quantity: [Quantity 1]\n2. [Item Description 2] - Quantity: [Quantity 2]\n3. [Item Description 3] - Quantity: [Quantity 3]\n\nThe purpose of this request is [briefly explain the purpose of the request]. \n\nThank you for considering this request. I look forward to your prompt response.\n\nSincerely,\n[Your Name]\n[Your Position]\n[Your Department]\n[Date]', 'Pending', NULL, NULL, 'Pending', NULL, NULL, 'Pending', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL),
(6, 6, 2, '2024-12-09', '[{\"quantity\":1,\"name_desc\":\"test\"},{\"quantity\":2,\"name_desc\":\"test 2\"}]', 'submit', 6, 'Dear [Recipient\'s Name],\n\nI am writing to formally request the following job items for our department:\n\n1. [Item Description 1] - Quantity: [Quantity 1]\n2. [Item Description 2] - Quantity: [Quantity 2]\n3. [Item Description 3] - Quantity: [Quantity 3]\n\nThe purpose of this request is [briefly explain the purpose of the request]. \n\nThank you for considering this request. I look forward to your prompt response.\n\nSincerely,\n[Your Name]\n[Your Position]\n[Your Department]\n[Date]', 'Pending', NULL, NULL, 'Pending', NULL, NULL, 'Pending', NULL, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL);

--
-- Triggers `tbjobrequests`
--
DELIMITER $$
CREATE TRIGGER `before_insert_tbjobrequests` BEFORE INSERT ON `tbjobrequests` FOR EACH ROW BEGIN
    -- Directly assign the next job_rq_id value to NEW.job_rq_id
    SET NEW.job_rq_id = (SELECT IFNULL(MAX(job_rq_id), 0) + 1 FROM tbjobrequests);
END
$$
DELIMITER ;

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
  `notif_read` tinyint(1) NOT NULL,
  `notif_related_id` int(12) DEFAULT NULL
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
  `rq_quantity` int(12) DEFAULT NULL,
  `rq_service_type` varchar(255) DEFAULT NULL,
  `rq_prio_level` varchar(255) NOT NULL,
  `rq_start_date` varchar(255) NOT NULL,
  `rq_end_date` varchar(255) NOT NULL,
  `rq_start_time` varchar(255) NOT NULL,
  `rq_end_time` varchar(255) NOT NULL,
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

INSERT INTO `tbrequests` (`rq_id`, `rq_type`, `dept_id`, `item_id`, `room_id`, `rq_quantity`, `rq_service_type`, `rq_prio_level`, `rq_start_date`, `rq_end_date`, `rq_start_time`, `rq_end_time`, `rq_notes`, `rq_create_date`, `rq_complete_date`, `rq_create_user_id`, `rq_accept_user_id`, `rq_status`) VALUES
(1, 'Reserve Item', 2, 2, NULL, 2, NULL, 'Urgent', '2024-11-25', '2024-11-25', '12:00', '15:00', 'test\npickup\nin use', '2024-11-25', '2024-12-9', 6, 3, 'Completed'),
(2, 'Reserve Facility', 2, NULL, 1, NULL, NULL, 'Moderate', '2024-11-29', '2024-11-29', '13:00', '16:00', 'test', '2024-11-26', NULL, 6, NULL, 'Request Submitted'),
(3, 'Reserve Item', 2, 9, NULL, 1, NULL, 'Moderate', '2024-12-03', '2024-12-03', '10:00', '11:00', 'reporting (pnd)', '2024-12-1', '', 7, 3, 'Pending'),
(4, 'Service for Item', 2, 3, NULL, 1, 'Repair', 'Moderate', '2024-12-05', '2024-12-06', '09:00', '11:00', 'repair pls', '2024-12-1', '2024-12-9', 7, 3, 'Completed'),
(5, 'Service for Facility', 1, NULL, 1, NULL, 'Maintenance', 'Moderate', '2024-12-09', '2024-12-09', '13:00', '16:00', 'check pc units', '2024-12-1', '2024-12-9', 8, 2, 'Completed'),
(6, 'Reserve Facility', 2, NULL, 1, NULL, NULL, 'Moderate', '2024-12-11', '2024-12-11', '08:00', '11:00', 'ok', '2024-12-1', '2024-12-9', 8, 3, 'Completed'),
(7, 'Reserve Item', 2, 9, NULL, 2, NULL, 'Moderate', '2024-12-10', '2024-12-10', '13:00', '14:00', 'slideshow\napproved', '2024-12-9', '2024-12-9', 6, 3, 'Completed'),
(8, 'Reserve Facility', 2, NULL, 1, NULL, NULL, 'Moderate', '2024-12-10', '2024-12-10', '13:00', '16:00', 'seminar', '2024-12-9', NULL, 6, NULL, 'Request Submitted'),
(9, 'Reserve Item', 2, 10, NULL, 1, NULL, 'Moderate', '2024-12-20', '2024-12-20', '13:00', '15:00', 'test', '2024-12-17', NULL, 6, NULL, 'Request Submitted');

-- --------------------------------------------------------

--
-- Table structure for table `tbrooms`
--

CREATE TABLE `tbrooms` (
  `room_id` int(12) NOT NULL,
  `room_bldg` varchar(255) NOT NULL,
  `room_floor` varchar(255) NOT NULL,
  `room_type` varchar(255) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `room_desc` varchar(255) NOT NULL,
  `room_status` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbrooms`
--

INSERT INTO `tbrooms` (`room_id`, `room_bldg`, `room_floor`, `room_type`, `room_name`, `room_desc`, `room_status`, `dept_id`) VALUES
(1, 'Old Building', '2nd Floor', 'Laboratory', 'Cisco Laboratory', 'Laboratory for networking and other computer-related activities', 'Available', 2),
(2, 'Old Building', '2nd Floor', 'Office', 'Computer Maintenance Office', 'Main office of CMO department', 'Available', 2),
(3, 'CBE Building', '4th Floor', 'Multi-Purpose', 'CBE AVR', 'Audio Visual Room', 'Available', 1),
(4, 'Maritime Building', '6th Floor', 'Multi-Purpose', 'Maritime AVR', 'Audio Visual Room', 'Available', 1),
(5, 'BE Building', '8th Floor', 'Multi-Purpose', 'BE Auditorium', 'Auditorium', 'Available', 1),
(6, 'Annex B', '1st Floor', 'Multi-Purpose', 'Function Hall', 'Ground', 'Available', 1),
(7, 'Old Building', '3rd Floor', 'Laboratory', 'C4 Laboratory', 'Computer Laboratory #4', 'Available', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tbschedules`
--

CREATE TABLE `tbschedules` (
  `sched_id` int(12) NOT NULL,
  `sched_user_id` int(12) NOT NULL,
  `sched_dept_id` int(12) NOT NULL,
  `sched_days_of_week` varchar(255) NOT NULL,
  `sched_time_in` varchar(255) NOT NULL,
  `sched_time_out` varchar(255) NOT NULL,
  `sched_start_date` varchar(255) NOT NULL,
  `sched_end_date` varchar(255) NOT NULL,
  `sched_notes` varchar(255) DEFAULT NULL,
  `sched_create_dept_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbschedules`
--

INSERT INTO `tbschedules` (`sched_id`, `sched_user_id`, `sched_dept_id`, `sched_days_of_week`, `sched_time_in`, `sched_time_out`, `sched_start_date`, `sched_end_date`, `sched_notes`, `sched_create_dept_id`) VALUES
(1, 8, 1, 'Tuesday, Thursday', '08:00', '12:00', '2024-11-20', '2024-12-20', '08:00AM - 12:00PM TTh', 1),
(2, 6, 2, 'Monday, Wednesday, Friday', '08:00', '12:00', '2025-01-06', '2025-02-28', 'sample', 2),
(4, 7, 3, 'Monday, Tuesday, Wednesday, Thursday, Friday', '09:00', '12:00', '2024-11-25', '2024-12-27', 'testing', 3),
(8, 6, 2, 'Wednesday, Friday', '08:00', '12:00', '2024-12-16', '2024-12-20', 'test notif 3', 2),
(9, 6, 2, 'Monday, Tuesday, Thursday', '13:00', '16:00', '2024-12-16', '2024-12-20', 'test notif 4', 2),
(10, 8, 1, 'Monday, Wednesday, Friday', '13:00', '16:00', '2024-12-10', '2024-12-14', 'bmo mfw', 2);

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
  `user_position` varchar(255) NOT NULL,
  `dept_id` int(12) NOT NULL,
  `user_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbuseraccounts`
--

INSERT INTO `tbuseraccounts` (`user_id`, `user_idnum`, `user_password`, `user_fname`, `user_lname`, `user_email`, `user_contact`, `user_type`, `user_position`, `dept_id`, `user_status`) VALUES
(1, 10000000, 'admin', 'Joe', 'Admin', 'admin@mail.com', '12345678', 'Administrator', 'Administrator', 2, 'Activated'),
(2, 10000001, 'tech1', 'Joe', 'BMO', 'tech@mail.com', '12345678', 'Technical Staff', 'Supervisor', 1, 'Activated'),
(3, 10000002, 'tech2', 'Joe', 'CMO', 'tech@mail.com', '12345678', 'Technical Staff', 'Supervisor', 2, 'Activated'),
(4, 19140284, 'yumol', 'Ruthello John', 'Yumol', 'yumol.ruthellojohn157@gmail.com', '12345678', 'Administrator', 'Administrator', 3, 'Activated'),
(5, 20200754, 'josepulmones', 'Jose Ma.', 'Pulmones Jr.', '21jmpulmones@gmail.com', '09150411484', 'Technical Staff', 'Supervisor', 3, 'Activated'),
(6, 19099456, 'glenn', 'Glenn', 'Toñacao', 'glenntoniacao@gmail.com', '0905268395', 'Technical Staff', 'Working Student', 2, 'Activated'),
(7, 19084821, 'hannah', 'Hannah Jane', 'Ferrer', 'hannahjaneferrer2@gmail.com', '0923445642', 'Technical Staff', 'Working Student', 3, 'Activated'),
(8, 20181622, 'jijil31', 'Angel Dianne', 'Ocier', 'angeldianneocier31@gmail.com', '09319100322', 'Technical Staff', 'Working Student', 3, 'Activated'),
(9, 10000003, 'cust1', 'Joe', 'Custodian', 'test@email.com', '12324567', 'Technical Staff', 'Property Custodian', 11, 'Activated'),
(10, 10000004, 'cads1', 'Joe', 'CADS', 'test@email.com', '12324567', 'Technical Staff', 'CADS Director', 11, 'Activated'),
(11, 21212121, '1234', 'Twenty', 'One', '21@mail.com', '2121', 'Technical Staff', 'Working Student', 3, 'Activated'),
(12, 10000005, 'nontech', 'Joe', 'Student', 'test@email.com', '12324567', 'Non-technical Staff', 'Student', 3, 'Activated');

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
-- Indexes for table `tbjobrequests`
--
ALTER TABLE `tbjobrequests`
  ADD PRIMARY KEY (`job_id`),
  ADD UNIQUE KEY `job_id` (`job_id`),
  ADD UNIQUE KEY `job_id_2` (`job_id`);

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
  MODIFY `dept_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbitems`
--
ALTER TABLE `tbitems`
  MODIFY `item_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tbjobrequests`
--
ALTER TABLE `tbjobrequests`
  MODIFY `job_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbnotifs`
--
ALTER TABLE `tbnotifs`
  MODIFY `notif_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbrequests`
--
ALTER TABLE `tbrequests`
  MODIFY `rq_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbrooms`
--
ALTER TABLE `tbrooms`
  MODIFY `room_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbschedules`
--
ALTER TABLE `tbschedules`
  MODIFY `sched_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbuseraccounts`
--
ALTER TABLE `tbuseraccounts`
  MODIFY `user_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
