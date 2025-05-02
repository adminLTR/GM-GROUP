CREATE DATABASE  IF NOT EXISTS `sistema_seguros` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_seguros`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_seguros
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas` (
  `id_tarea` int NOT NULL AUTO_INCREMENT,
  `id_persona` int DEFAULT NULL,
  `id_empresa` int DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `id_creador` int NOT NULL,
  `id_asignado` int DEFAULT NULL,
  `prioridad` enum('Baja','Media','Alta') NOT NULL DEFAULT 'Media',
  `estado` enum('Pendiente','En Proceso','Completada','Rechazada') NOT NULL DEFAULT 'Pendiente',
  `motivo_rechazo` text,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `fecha_finalizacion` datetime DEFAULT NULL,
  `creado_por` varchar(50) NOT NULL DEFAULT 'CHAT',
  PRIMARY KEY (`id_tarea`),
  KEY `id_persona` (`id_persona`),
  KEY `id_creador` (`id_creador`),
  KEY `id_asignado` (`id_asignado`),
  KEY `id_empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareas`
--

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
INSERT INTO `tareas` VALUES (2,NULL,NULL,'Sueldo Mailet','Sueldo mes febrero',17,17,'Alta','En Proceso',NULL,'2025-03-10 14:25:40',NULL,'2025-03-10',NULL,'Usuario ID:17'),(5,NULL,NULL,'Ingreso deudas colegio nuevo','Ingresar deudas urgente',17,18,'Alta','En Proceso',NULL,'2025-03-10 14:46:12',NULL,'2025-03-10',NULL,'Usuario ID:17');
/*!40000 ALTER TABLE `tareas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:24:04
