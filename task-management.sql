-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2024 at 05:42 PM
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
-- Database: `task-management`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `cat_name` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `cat_name`, `user_id`) VALUES
(1, 'course tasks', 3),
(2, 'helwan university tasks', 3),
(3, 'home tasks', 4),
(4, ' work tasks', 3),
(5, ' freelaneing tasks', 3),
(7, ' xxx tasks', 3),
(11, 'my self', 4),
(12, 'adminstrative', 4);

-- --------------------------------------------------------

--
-- Table structure for table `list-task-item`
--

CREATE TABLE `list-task-item` (
  `item_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `item_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `task_body` text NOT NULL,
  `shared_option` enum('public','private') NOT NULL,
  `type` enum('text-task','list-task') NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `task_body`, `shared_option`, `type`, `user_id`, `category_id`) VALUES
(1, ' i should do the assignment ', 'private', 'text-task', 3, 1),
(2, ' study for data structure midterm exam', 'private', 'text-task', 3, 2),
(4, 'shopping for healthy food', 'public', 'text-task', 4, 3),
(6, 'doing my hair', 'public', 'text-task', 4, 11),
(9, 'go to supermaarket', 'public', 'text-task', 4, 3),
(11, 'have a shawer', 'private', 'text-task', 4, 11),
(13, 'prepare for my event', 'private', 'text-task', 4, 12);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `Email`, `password`, `token`) VALUES
(3, 'roaa', 'roaa@gmail.com', '$2b$10$MXbS4Vld/RDMtlk8rqfzL.lS39lHWF7izEZTy.PXzf3A4Fb8mCeCe', '2f9bda521884fa2b56eda273af60e614'),
(4, 'ammar', 'ammar@gmail.com', '$2b$10$EJT/lWB9EcZYmCp0afSd4uUH/NZux8J7vo2PbTbTU0RPDPxjK9Dd.', '9e6d39249dca94a963a30a86d75d1ab6'),
(5, 'ali', 'ali@gmail.com', '$2b$10$d/kUAxzzzVfDT/zDQTQI/u442guUVu1Ym6MYoXiQHQFjN9qbgwhLO', '183373eaae80fdd2d868cb8b8042587d'),
(6, 'hesham', 'hesham@gmail.com', '$2b$10$GNpvyw3vm4FD.r1cbq7PaOw5zCfgJExaUjORxZPCRd2dFG87Mymlm', 'aab47ca2fe19ea98f4098f0d7270f83b');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_constr_id2` (`user_id`);

--
-- Indexes for table `list-task-item`
--
ALTER TABLE `list-task-item`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `task-constr-id` (`task_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_constr_id` (`user_id`),
  ADD KEY `category_constr_id` (`category_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `list-task-item`
--
ALTER TABLE `list-task-item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `user_constr_id2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `list-task-item`
--
ALTER TABLE `list-task-item`
  ADD CONSTRAINT `task-constr-id` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `category_constr_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_constr_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
