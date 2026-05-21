-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2025 a las 22:44:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dental_admin`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patientId` int(11) NOT NULL COMMENT 'ID del usuario paciente',
  `dentistId` int(11) NOT NULL COMMENT 'ID del usuario dentista',
  `date` datetime NOT NULL COMMENT 'Fecha y hora programada de la cita',
  `status` enum('scheduled','completed','cancelled','rescheduled') NOT NULL DEFAULT 'scheduled' COMMENT 'Estado actual de la cita',
  `reason` text DEFAULT NULL COMMENT 'Motivo de la consulta médica',
  `notes` text DEFAULT NULL COMMENT 'Notas adicionales sobre la cita',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `appointments`
--

INSERT INTO `appointments` (`id`, `patientId`, `dentistId`, `date`, `status`, `reason`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, '2025-12-25 04:00:00', 'scheduled', 'Consulta dental', 'Nueva cita', '2025-10-30 10:45:50', '2025-10-30 10:49:41'),
(2, 1, 2, '2025-12-29 10:00:00', 'scheduled', 'Consulta dental', 'Cita para probar reagendo', '2025-10-30 10:51:38', '2025-10-30 10:55:21'),
(3, 9, 2, '2025-11-01 09:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-02 09:00:00', '2025-10-02 09:00:00'),
(4, 10, 5, '2025-11-01 10:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-02 10:00:00', '2025-10-02 10:00:00'),
(5, 11, 6, '2025-11-01 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-02 11:00:00', '2025-10-02 11:00:00'),
(6, 12, 7, '2025-11-01 12:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-02 12:00:00', '2025-10-02 12:00:00'),
(7, 13, 8, '2025-11-01 13:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-02 13:00:00', '2025-10-02 13:00:00'),
(8, 14, 2, '2025-11-01 14:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-02 14:00:00', '2025-10-02 14:00:00'),
(9, 15, 5, '2025-11-01 15:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-02 15:00:00', '2025-10-02 15:00:00'),
(10, 16, 6, '2025-11-01 16:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-02 16:00:00', '2025-10-02 16:00:00'),
(11, 17, 7, '2025-11-01 17:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-02 17:00:00', '2025-10-02 17:00:00'),
(12, 18, 8, '2025-11-02 09:00:00', 'completed', 'Consulta dental', 'Generada por seed', '2025-10-03 09:00:00', '2025-10-03 09:00:00'),
(13, 19, 2, '2025-11-02 10:00:00', 'completed', 'Consulta dental', 'Generada por seed', '2025-10-03 10:00:00', '2025-10-03 10:00:00'),
(14, 20, 5, '2025-11-02 11:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-03 11:00:00', '2025-10-03 11:00:00'),
(15, 21, 6, '2025-11-02 12:00:00', 'completed', 'Consulta dental', 'Generada por seed', '2025-10-03 12:00:00', '2025-10-03 12:00:00'),
(16, 22, 7, '2025-11-02 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-03 13:00:00', '2025-10-03 13:00:00'),
(17, 23, 8, '2025-11-02 14:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-03 14:00:00', '2025-10-03 14:00:00'),
(18, 24, 2, '2025-11-02 15:00:00', 'completed', 'Consulta dental', 'Generada por seed', '2025-10-03 15:00:00', '2025-10-03 15:00:00'),
(19, 25, 5, '2025-11-02 16:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-03 16:00:00', '2025-10-03 16:00:00'),
(20, 26, 6, '2025-11-02 17:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-03 17:00:00', '2025-10-03 17:00:00'),
(21, 27, 7, '2025-11-03 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-04 09:00:00', '2025-10-04 09:00:00'),
(22, 28, 8, '2025-11-03 10:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-04 10:00:00', '2025-10-04 10:00:00'),
(23, 29, 2, '2025-11-03 11:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-04 11:00:00', '2025-10-04 11:00:00'),
(24, 30, 5, '2025-11-03 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-04 12:00:00', '2025-10-04 12:00:00'),
(25, 31, 6, '2025-11-03 13:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-04 13:00:00', '2025-10-04 13:00:00'),
(26, 32, 7, '2025-11-03 14:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-04 14:00:00', '2025-10-04 14:00:00'),
(27, 33, 8, '2025-11-03 15:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-04 15:00:00', '2025-10-04 15:00:00'),
(28, 34, 2, '2025-11-03 16:00:00', 'completed', 'Consulta dental', 'Generada por seed', '2025-10-04 16:00:00', '2025-10-04 16:00:00'),
(29, 35, 5, '2025-11-03 17:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-04 17:00:00', '2025-10-04 17:00:00'),
(30, 36, 6, '2025-11-04 09:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
(31, 37, 7, '2025-11-04 10:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-05 10:00:00', '2025-10-05 10:00:00'),
(32, 38, 8, '2025-11-04 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-05 11:00:00', '2025-10-05 11:00:00'),
(33, 39, 2, '2025-11-04 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-05 12:00:00', '2025-10-05 12:00:00'),
(34, 40, 5, '2025-11-04 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-05 13:00:00', '2025-10-05 13:00:00'),
(35, 41, 6, '2025-11-04 14:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-05 14:00:00', '2025-10-05 14:00:00'),
(36, 42, 7, '2025-11-04 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-05 15:00:00', '2025-10-05 15:00:00'),
(37, 43, 8, '2025-11-04 16:00:00', 'rescheduled', 'Consulta dental', 'Generada por seed', '2025-10-05 16:00:00', '2025-10-05 16:00:00'),
(38, 44, 2, '2025-11-04 17:00:00', 'cancelled', 'Consulta dental', 'Generada por seed', '2025-10-05 17:00:00', '2025-10-05 17:00:00'),
(39, 45, 5, '2025-11-05 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 09:00:00', '2025-10-06 09:00:00'),
(40, 46, 6, '2025-11-05 10:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 10:00:00', '2025-10-06 10:00:00'),
(41, 47, 7, '2025-11-05 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 11:00:00', '2025-10-06 11:00:00'),
(42, 48, 8, '2025-11-05 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 12:00:00', '2025-10-06 12:00:00'),
(43, 49, 2, '2025-11-05 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 13:00:00', '2025-10-06 13:00:00'),
(44, 50, 5, '2025-11-05 14:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 14:00:00', '2025-10-06 14:00:00'),
(45, 9, 6, '2025-11-05 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 15:00:00', '2025-10-06 15:00:00'),
(46, 10, 7, '2025-11-05 16:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 16:00:00', '2025-10-06 16:00:00'),
(47, 11, 8, '2025-11-05 17:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-06 17:00:00', '2025-10-06 17:00:00'),
(48, 12, 2, '2025-11-06 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 09:00:00', '2025-10-07 09:00:00'),
(49, 13, 5, '2025-11-06 10:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 10:00:00', '2025-10-07 10:00:00'),
(50, 14, 6, '2025-11-06 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 11:00:00', '2025-10-07 11:00:00'),
(51, 15, 7, '2025-11-06 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 12:00:00', '2025-10-07 12:00:00'),
(52, 16, 8, '2025-11-06 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 13:00:00', '2025-10-07 13:00:00'),
(53, 17, 2, '2025-11-06 14:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 14:00:00', '2025-10-07 14:00:00'),
(54, 18, 5, '2025-11-06 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 15:00:00', '2025-10-07 15:00:00'),
(55, 19, 6, '2025-11-06 16:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 16:00:00', '2025-10-07 16:00:00'),
(56, 20, 7, '2025-11-06 17:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-07 17:00:00', '2025-10-07 17:00:00'),
(57, 21, 8, '2025-11-07 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 09:00:00', '2025-10-08 09:00:00'),
(58, 22, 2, '2025-11-07 10:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 10:00:00', '2025-10-08 10:00:00'),
(59, 23, 5, '2025-11-07 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 11:00:00', '2025-10-08 11:00:00'),
(60, 24, 6, '2025-11-07 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 12:00:00', '2025-10-08 12:00:00'),
(61, 25, 7, '2025-11-07 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 13:00:00', '2025-10-08 13:00:00'),
(62, 26, 8, '2025-11-07 14:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 14:00:00', '2025-10-08 14:00:00'),
(63, 27, 2, '2025-11-07 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 15:00:00', '2025-10-08 15:00:00'),
(64, 28, 5, '2025-11-07 16:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 16:00:00', '2025-10-08 16:00:00'),
(65, 29, 6, '2025-11-07 17:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-08 17:00:00', '2025-10-08 17:00:00'),
(66, 30, 7, '2025-11-08 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 09:00:00', '2025-10-09 09:00:00'),
(67, 31, 8, '2025-11-08 10:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 10:00:00', '2025-10-09 10:00:00'),
(68, 32, 2, '2025-11-08 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 11:00:00', '2025-10-09 11:00:00'),
(69, 33, 5, '2025-11-08 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 12:00:00', '2025-10-09 12:00:00'),
(70, 34, 6, '2025-11-08 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 13:00:00', '2025-10-09 13:00:00'),
(71, 35, 7, '2025-11-08 14:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 14:00:00', '2025-10-09 14:00:00'),
(72, 36, 8, '2025-11-08 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 15:00:00', '2025-10-09 15:00:00'),
(73, 37, 2, '2025-11-08 16:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 16:00:00', '2025-10-09 16:00:00'),
(74, 38, 5, '2025-11-08 17:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-09 17:00:00', '2025-10-09 17:00:00'),
(75, 39, 6, '2025-11-09 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 09:00:00', '2025-10-10 09:00:00'),
(76, 40, 7, '2025-11-09 10:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 10:00:00', '2025-10-10 10:00:00'),
(77, 41, 8, '2025-11-09 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 11:00:00', '2025-10-10 11:00:00'),
(78, 42, 2, '2025-11-09 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 12:00:00', '2025-10-10 12:00:00'),
(79, 43, 5, '2025-11-09 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 13:00:00', '2025-10-10 13:00:00'),
(80, 44, 6, '2025-11-09 14:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 14:00:00', '2025-10-10 14:00:00'),
(81, 45, 7, '2025-11-09 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 15:00:00', '2025-10-10 15:00:00'),
(82, 46, 8, '2025-11-09 16:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 16:00:00', '2025-10-10 16:00:00'),
(83, 47, 2, '2025-11-09 17:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-10 17:00:00', '2025-10-10 17:00:00'),
(84, 48, 5, '2025-11-10 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 09:00:00', '2025-10-11 09:00:00'),
(85, 49, 6, '2025-11-10 10:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 10:00:00', '2025-10-11 10:00:00'),
(86, 50, 7, '2025-11-10 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 11:00:00', '2025-10-11 11:00:00'),
(87, 9, 8, '2025-11-10 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 12:00:00', '2025-10-11 12:00:00'),
(88, 10, 2, '2025-11-10 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 13:00:00', '2025-10-11 13:00:00'),
(89, 11, 5, '2025-11-10 14:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 14:00:00', '2025-10-11 14:00:00'),
(90, 12, 6, '2025-11-10 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 15:00:00', '2025-10-11 15:00:00'),
(91, 13, 7, '2025-11-10 16:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 16:00:00', '2025-10-11 16:00:00'),
(92, 14, 8, '2025-11-10 17:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-11 17:00:00', '2025-10-11 17:00:00'),
(93, 15, 2, '2025-11-11 09:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 09:00:00', '2025-10-12 09:00:00'),
(94, 16, 5, '2025-11-11 10:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 10:00:00', '2025-10-12 10:00:00'),
(95, 17, 6, '2025-11-11 11:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 11:00:00', '2025-10-12 11:00:00'),
(96, 18, 7, '2025-11-11 12:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 12:00:00', '2025-10-12 12:00:00'),
(97, 19, 8, '2025-11-11 13:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 13:00:00', '2025-10-12 13:00:00'),
(98, 20, 2, '2025-11-11 14:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 14:00:00', '2025-10-12 14:00:00'),
(99, 21, 5, '2025-11-11 15:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 15:00:00', '2025-10-12 15:00:00'),
(100, 22, 6, '2025-11-11 16:00:00', 'scheduled', 'Consulta dental', 'Generada por seed', '2025-10-12 16:00:00', '2025-10-12 16:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL COMMENT 'Identificador único del expediente médico',
  `patientId` int(11) NOT NULL COMMENT 'ID del paciente dueño del expediente',
  `diagnosis` text NOT NULL COMMENT 'Diagnóstico médico del paciente',
  `treatment` text DEFAULT NULL COMMENT 'Tratamiento prescrito al paciente',
  `prescriptions` text DEFAULT NULL COMMENT 'Medicamentos recetados al paciente',
  `notes` text DEFAULT NULL COMMENT 'Notas médicas adicionales',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla de expedientes médicos de los pacientes';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `penalties`
--

CREATE TABLE `penalties` (
  `id` int(11) NOT NULL COMMENT 'Identificador único de la penalización',
  `userId` int(11) NOT NULL COMMENT 'ID del usuario penalizado',
  `reason` enum('late_cancellation','no_show','other') NOT NULL DEFAULT 'other' COMMENT 'Motivo de la penalización',
  `amount` decimal(10,2) DEFAULT 0.00 COMMENT 'Monto de la multa aplicada',
  `status` enum('active','inactive','paid') NOT NULL DEFAULT 'active' COMMENT 'Estado actual de la penalización',
  `expiresAt` datetime DEFAULT NULL COMMENT 'Fecha de expiración de la penalización',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla de penalizaciones por cancelaciones tardías o no-show';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('patient','dentist','admin') NOT NULL DEFAULT 'patient',
  `phone` varchar(20) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Indica si la cuenta está activa',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `specialty` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `isActive`, `createdAt`, `updatedAt`, `specialty`) VALUES
(1, 'Juan Pérez', 'paciente@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553334444', 1, '2025-10-30 10:19:52', '2025-10-30 10:19:52', NULL),
(2, 'Dr. Carlos Rodriguez', 'dentista@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'dentist', '5551112222', 1, '2025-10-30 10:20:01', '2025-10-30 10:20:01', 'Odontología General'),
(3, 'Administrador Sistema', 'admin@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'admin', '5550001111', 1, '2025-10-30 11:37:06', '2025-10-30 11:37:06', NULL),
(4, 'Administrador Extra', 'admin4@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'admin', '5551000004', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(5, 'Dr. Dentista1', 'dentista5@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'dentist', '5552000005', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', 'Odontología General'),
(6, 'Dr. Dentista2', 'dentista6@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'dentist', '5552000006', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', 'Ortodoncia'),
(7, 'Dr. Dentista3', 'dentista7@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'dentist', '5552000007', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', 'Odontología General'),
(8, 'Dr. Dentista4', 'dentista8@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'dentist', '5552000008', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', 'Ortodoncia'),
(9, 'Paciente 1', 'paciente9@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000009', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(10, 'Paciente 2', 'paciente10@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000010', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(11, 'Paciente 3', 'paciente11@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000011', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(12, 'Paciente 4', 'paciente12@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000012', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(13, 'Paciente 5', 'paciente13@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000013', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(14, 'Paciente 6', 'paciente14@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000014', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(15, 'Paciente 7', 'paciente15@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000015', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(16, 'Paciente 8', 'paciente16@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000016', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(17, 'Paciente 9', 'paciente17@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000017', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(18, 'Paciente 10', 'paciente18@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000018', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(19, 'Paciente 11', 'paciente19@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000019', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(20, 'Paciente 12', 'paciente20@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000020', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(21, 'Paciente 13', 'paciente21@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000021', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(22, 'Paciente 14', 'paciente22@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000022', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(23, 'Paciente 15', 'paciente23@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000023', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(24, 'Paciente 16', 'paciente24@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000024', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(25, 'Paciente 17', 'paciente25@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000025', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(26, 'Paciente 18', 'paciente26@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000026', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(27, 'Paciente 19', 'paciente27@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000027', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(28, 'Paciente 20', 'paciente28@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000028', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(29, 'Paciente 21', 'paciente29@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000029', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(30, 'Paciente 22', 'paciente30@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000030', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(31, 'Paciente 23', 'paciente31@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000031', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(32, 'Paciente 24', 'paciente32@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000032', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(33, 'Paciente 25', 'paciente33@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000033', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(34, 'Paciente 26', 'paciente34@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000034', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(35, 'Paciente 27', 'paciente35@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000035', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(36, 'Paciente 28', 'paciente36@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000036', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(37, 'Paciente 29', 'paciente37@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000037', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(38, 'Paciente 30', 'paciente38@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000038', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(39, 'Paciente 31', 'paciente39@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000039', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(40, 'Paciente 32', 'paciente40@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000040', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(41, 'Paciente 33', 'paciente41@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000041', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(42, 'Paciente 34', 'paciente42@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000042', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(43, 'Paciente 35', 'paciente43@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000043', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(44, 'Paciente 36', 'paciente44@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000044', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(45, 'Paciente 37', 'paciente45@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000045', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(46, 'Paciente 38', 'paciente46@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000046', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(47, 'Paciente 39', 'paciente47@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000047', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(48, 'Paciente 40', 'paciente48@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000048', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(49, 'Paciente 41', 'paciente49@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000049', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL),
(50, 'Paciente 42', 'paciente50@test.com', '$2b$10$JZJLARUDZeBoAw7h3l46wu52Az2dzn3A4zysm0mL2gibJre9Dk2pe', 'patient', '5553000050', 1, '2025-10-30 12:00:00', '2025-10-30 12:00:00', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patientId` (`patientId`),
  ADD KEY `dentistId` (`dentistId`);

--
-- Indices de la tabla `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medical_records_patient_id` (`patientId`);

--
-- Indices de la tabla `penalties`
--
ALTER TABLE `penalties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `penalties_user_id` (`userId`),
  ADD KEY `penalties_status` (`status`),
  ADD KEY `penalties_expires_at` (`expiresAt`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de la tabla `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del expediente médico';

--
-- AUTO_INCREMENT de la tabla `penalties`
--
ALTER TABLE `penalties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la penalización';

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`dentistId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `penalties`
--
ALTER TABLE `penalties`
  ADD CONSTRAINT `penalties_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
