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
-- Table structure for table `coberturas`
--

DROP TABLE IF EXISTS `coberturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coberturas` (
  `id_cobertura` int NOT NULL AUTO_INCREMENT,
  `nombre_cobertura` varchar(100) NOT NULL,
  `id_compania` int NOT NULL,
  PRIMARY KEY (`id_cobertura`),
  KEY `id_compania` (`id_compania`),
  CONSTRAINT `coberturas_ibfk_1` FOREIGN KEY (`id_compania`) REFERENCES `companias_seguros` (`id_compania`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coberturas`
--

LOCK TABLES `coberturas` WRITE;
/*!40000 ALTER TABLE `coberturas` DISABLE KEYS */;
INSERT INTO `coberturas` VALUES (1,'RC BASICA',1),(2,'RC ESTANDAR',1),(3,'RC PLUS',1),(4,'ROBO E INCENDIO C1',1),(5,'ROBO E INCENDIO CPLUS',1),(6,'ROBO E INCENDIO CMEGA',1),(7,'TODO  RIESGO D1',1),(8,'TODO RIEGOS D4',1),(9,'TODO RIESGO DPLUS',1),(10,'INCENDIO',1),(11,'COBINADO HOGAR',1),(12,'COMBINADO COMERCIO',1),(13,'TOTAL PLUS',2),(14,'TOTAL C/GASTO MOVILIDAD',2),(15,'TOTAL',2),(16,'TOTAL ECONOMICA',2),(17,'COBERTURA 4 EN 1',2),(18,'HURTO E INCEDNIO',2),(19,'RESPONSABILIDAD CIVIL',2),(20,'RESPONSABILIDAD CIVIL E INCENDIO',2),(21,'SOA',2),(22,'PRIMER RIESGO',2),(23,'VALOR TOTAL',2),(24,'GARANTIA DE ALQUILER',2),(25,'ESCRITURA',2),(26,'FIANZA',2),(27,'SEGURO DE VIAJE',2),(28,'Daños Hurto Incendio y Responsabilidad Civil',3),(29,'Daños  Hurto  Incendio y Responsabilidad Civil con Deducible Incrementado',3),(30,'Hurto Incendio y Responsabilidad Civil',3),(31,'Hurto',3),(32,'Incendio y Responsabilidad Civil con Agentes Externos',3),(33,'Responsabilidad Civil',3),(34,'Responsabilidad Civil Limitada',3);
/*!40000 ALTER TABLE `coberturas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:27:48
