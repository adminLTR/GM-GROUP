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
-- Table structure for table `bank`
--

DROP TABLE IF EXISTS `bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank` (
  `id_bank` int NOT NULL AUTO_INCREMENT,
  `nombre_bank` varchar(100) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bank`),
  UNIQUE KEY `nombre` (`nombre_bank`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `nombre_bank` (`nombre_bank`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank`
--

LOCK TABLES `bank` WRITE;
/*!40000 ALTER TABLE `bank` DISABLE KEYS */;
INSERT INTO `bank` VALUES (1,'Banco de la República Oriental del Uruguay (BROU)','001','activo','2025-03-16 03:31:01'),(2,'Banco Bandes Uruguay','110','activo','2025-03-16 03:31:01'),(3,'Banco Itaú Uruguay S.A.','113','activo','2025-03-16 03:31:01'),(4,'Scotiabank Uruguay S.A.','128','activo','2025-03-16 03:31:01'),(5,'Banco Santander S.A.','137','activo','2025-03-16 03:31:01'),(6,'Banco Bilbao Vizcaya Argentaria Uruguay S.A.','153','activo','2025-03-16 03:31:01'),(7,'HSBC Bank (Uruguay) S.A.','157','activo','2025-03-16 03:31:01'),(8,'Banque Heritage (Uruguay) S.A.','162','activo','2025-03-16 03:31:01'),(9,'Citibank N.A. Sucursal Uruguay','205','activo','2025-03-16 03:31:01'),(10,'Banco de la Nación Argentina (Uruguay)','246','activo','2025-03-16 03:31:01');
/*!40000 ALTER TABLE `bank` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:24:10
