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
-- Table structure for table `renovacion`
--

DROP TABLE IF EXISTS `renovacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `renovacion` (
  `id_renovacion` int NOT NULL AUTO_INCREMENT,
  `poliza_vieja_id` int NOT NULL,
  `codigo_poliza_vieja` varchar(50) NOT NULL,
  `id_compania_vieja` int NOT NULL,
  `id_cobertura_vieja` int DEFAULT NULL,
  `precio_viejo` decimal(10,2) NOT NULL,
  `poliza_nueva_id` int DEFAULT NULL,
  `codigo_poliza_nueva` varchar(50) DEFAULT NULL,
  `id_compania_nueva` int DEFAULT NULL,
  `id_cobertura_nueva` int DEFAULT NULL,
  `precio_nuevo` decimal(10,2) NOT NULL,
  `fecha_renovacion` date NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_actual` varchar(100) NOT NULL,
  PRIMARY KEY (`id_renovacion`),
  KEY `fk_poliza_vieja` (`poliza_vieja_id`),
  KEY `fk_poliza_nueva` (`poliza_nueva_id`),
  CONSTRAINT `fk_poliza_nueva` FOREIGN KEY (`poliza_nueva_id`) REFERENCES `polizas` (`id_poliza`),
  CONSTRAINT `fk_poliza_vieja` FOREIGN KEY (`poliza_vieja_id`) REFERENCES `polizas` (`id_poliza`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `renovacion`
--

LOCK TABLES `renovacion` WRITE;
/*!40000 ALTER TABLE `renovacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `renovacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:30:45
