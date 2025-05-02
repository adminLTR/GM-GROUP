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
-- Table structure for table `poliza_detalle`
--

DROP TABLE IF EXISTS `poliza_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poliza_detalle` (
  `id_poliza_detalle` int NOT NULL AUTO_INCREMENT,
  `id_poliza` int NOT NULL,
  `id_campo` int NOT NULL,
  `valor_campo` text,
  PRIMARY KEY (`id_poliza_detalle`),
  KEY `id_poliza` (`id_poliza`),
  KEY `id_campo` (`id_campo`),
  CONSTRAINT `poliza_detalle_ibfk_1` FOREIGN KEY (`id_poliza`) REFERENCES `polizas` (`id_poliza`),
  CONSTRAINT `poliza_detalle_ibfk_2` FOREIGN KEY (`id_campo`) REFERENCES `campos_ramos` (`id_campo`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poliza_detalle`
--

LOCK TABLES `poliza_detalle` WRITE;
/*!40000 ALTER TABLE `poliza_detalle` DISABLE KEYS */;
INSERT INTO `poliza_detalle` VALUES (1,1,18,'Maldonado'),(2,2,18,'MALDONADO'),(3,3,18,'Salto'),(4,4,18,'SALTO'),(5,6,18,'SALTO'),(6,8,18,'PAYSANDU'),(7,9,18,'MALDONADO'),(8,10,18,'SALTO'),(9,12,18,'SALTO'),(10,13,18,'Maldonado'),(11,14,18,'salto'),(12,15,18,'salto'),(13,16,18,'salto'),(14,17,18,'salto'),(15,18,18,'SALTO'),(16,19,18,'SALTO'),(17,20,18,'SALTO'),(18,21,18,'SALTO'),(19,22,18,''),(20,23,18,'Maldonado'),(21,24,18,'SALTO'),(22,25,18,'SALTO'),(23,26,18,'SALTO'),(24,28,18,''),(25,29,18,'SALTO'),(26,30,18,'SALTO'),(27,31,18,''),(28,32,18,'Maldonado'),(29,33,18,''),(30,34,18,''),(31,35,18,'Salto'),(32,36,18,'Salto'),(33,37,18,'salto'),(34,38,18,'SALTO'),(35,39,18,'Salto'),(36,40,18,'salto'),(37,41,18,'Salto'),(38,42,18,'Salto'),(39,43,1,'Gorlero -Edificio Barlovento 630 Piso 1 Depto/Of 107,'),(40,43,2,'Entrenador Club Jornalero'),(41,44,18,'salto'),(42,45,18,'Salto'),(43,46,18,'Maldonado'),(44,47,18,'Salto'),(45,48,18,'Salto'),(46,49,19,'Salto'),(47,50,18,'Salto'),(48,51,18,'SALTO'),(49,53,18,'Salto'),(50,54,18,'Salto'),(51,55,18,''),(52,56,18,'Salto'),(53,57,18,'Salto'),(54,58,18,'Salto'),(55,59,18,'Salto'),(56,60,18,'Salto'),(57,61,18,'MALDONADO'),(58,62,18,'SALTO'),(59,63,18,'SALTO'),(60,64,18,''),(61,65,21,'Salto'),(62,66,18,'Salto'),(63,67,18,'SALTO'),(64,68,20,'Salto'),(65,69,19,'Salto'),(66,70,18,'SALTO'),(67,71,18,'SALTO'),(68,72,18,'SALTO'),(69,73,18,'Salto'),(70,74,18,'FLORIDA'),(71,75,18,''),(72,76,18,'SALTO'),(73,78,18,'SALTO'),(74,79,18,'SALTO'),(75,80,18,'SALTO'),(76,81,18,'Salto'),(77,83,18,'Salto'),(78,84,18,'salto'),(79,85,19,'Salto'),(80,86,18,'Salto'),(81,88,18,'Salto'),(82,89,18,'Salto'),(83,90,18,'SALTO'),(84,91,18,'SALTO'),(85,92,18,'SALTO'),(86,93,18,'Salto'),(87,94,18,'salto'),(88,96,18,'SALTO'),(89,97,18,'SALTO');
/*!40000 ALTER TABLE `poliza_detalle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:26:48
