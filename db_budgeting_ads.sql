-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 07, 2026 at 09:16 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_budgeting_ads`
--

-- --------------------------------------------------------

--
-- Table structure for table `campaign`
--

CREATE TABLE `campaign` (
  `id_campaign` int NOT NULL,
  `id_user` int DEFAULT NULL,
  `nama_campaign` varchar(255) NOT NULL,
  `platform` varchar(100) DEFAULT NULL,
  `total_budget` int DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `status` enum('Active','Paused','Completed') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `campaign`
--

INSERT INTO `campaign` (`id_campaign`, `id_user`, `nama_campaign`, `platform`, `total_budget`, `tanggal_mulai`, `tanggal_selesai`, `status`) VALUES
(1, 1, 'Promo Ramadhan', 'Instagram', 5000000, '2026-03-01', '2026-04-01', 'Active'),
(2, 1, 'Flash Sale 4.4', 'TikTok', 10000000, '2026-04-01', '2026-04-05', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `laporan`
--

CREATE TABLE `laporan` (
  `id_laporan` int NOT NULL,
  `id_campaign` int DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  `periode_awal` date DEFAULT NULL,
  `periode_akhir` date DEFAULT NULL,
  `tanggal_dibuat` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `performa_campaign`
--

CREATE TABLE `performa_campaign` (
  `id_performa` int NOT NULL,
  `id_campaign` int DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `impression` int DEFAULT '0',
  `click` int DEFAULT '0',
  `conversion` int DEFAULT '0',
  `revenue` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `performa_campaign`
--

INSERT INTO `performa_campaign` (`id_performa`, `id_campaign`, `id_user`, `tanggal`, `impression`, `click`, `conversion`, `revenue`) VALUES
(1, 1, 2, '2026-03-10', 10000, 500, 50, 2000000),
(2, 1, 2, '2026-03-11', 12000, 600, 60, 2500000),
(3, 2, 2, '2026-04-02', 50000, 2500, 200, 15000000),
(4, 2, 2, '2026-04-03', 45000, 2100, 180, 12000000),
(5, 2, 2, '2026-04-04', 60000, 3000, 300, 20000000);

-- --------------------------------------------------------

--
-- Table structure for table `realisasi`
--

CREATE TABLE `realisasi` (
  `id_realisasi` int NOT NULL,
  `id_campaign` int DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  `tanggal` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `biaya` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `realisasi`
--

INSERT INTO `realisasi` (`id_realisasi`, `id_campaign`, `id_user`, `tanggal`, `biaya`) VALUES
(1, 1, 2, '2026-04-07 09:11:39', 500000),
(2, 1, 2, '2026-04-07 09:11:39', 750000),
(3, 1, 2, '2026-04-07 09:11:39', 1000000),
(4, 2, 2, '2026-04-07 09:11:39', 2000000),
(5, 2, 2, '2026-04-07 09:11:39', 3000000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Staff') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama`, `email`, `password`, `role`) VALUES
(1, 'Budi Admin', 'admin@mail.com', 'hashed_pass', 'Admin'),
(2, 'Siti Staff', 'staff@mail.com', 'hashed_pass', 'Staff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `campaign`
--
ALTER TABLE `campaign`
  ADD PRIMARY KEY (`id_campaign`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `laporan`
--
ALTER TABLE `laporan`
  ADD PRIMARY KEY (`id_laporan`),
  ADD KEY `id_campaign` (`id_campaign`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `performa_campaign`
--
ALTER TABLE `performa_campaign`
  ADD PRIMARY KEY (`id_performa`),
  ADD KEY `id_campaign` (`id_campaign`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `realisasi`
--
ALTER TABLE `realisasi`
  ADD PRIMARY KEY (`id_realisasi`),
  ADD KEY `id_campaign` (`id_campaign`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `campaign`
--
ALTER TABLE `campaign`
  MODIFY `id_campaign` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `laporan`
--
ALTER TABLE `laporan`
  MODIFY `id_laporan` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `performa_campaign`
--
ALTER TABLE `performa_campaign`
  MODIFY `id_performa` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `realisasi`
--
ALTER TABLE `realisasi`
  MODIFY `id_realisasi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `campaign`
--
ALTER TABLE `campaign`
  ADD CONSTRAINT `campaign_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `laporan`
--
ALTER TABLE `laporan`
  ADD CONSTRAINT `laporan_ibfk_1` FOREIGN KEY (`id_campaign`) REFERENCES `campaign` (`id_campaign`) ON DELETE CASCADE,
  ADD CONSTRAINT `laporan_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL;

--
-- Constraints for table `performa_campaign`
--
ALTER TABLE `performa_campaign`
  ADD CONSTRAINT `performa_campaign_ibfk_1` FOREIGN KEY (`id_campaign`) REFERENCES `campaign` (`id_campaign`) ON DELETE CASCADE,
  ADD CONSTRAINT `performa_campaign_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL;

--
-- Constraints for table `realisasi`
--
ALTER TABLE `realisasi`
  ADD CONSTRAINT `realisasi_ibfk_1` FOREIGN KEY (`id_campaign`) REFERENCES `campaign` (`id_campaign`) ON DELETE CASCADE,
  ADD CONSTRAINT `realisasi_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
