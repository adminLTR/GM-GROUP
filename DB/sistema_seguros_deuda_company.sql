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
-- Table structure for table `deuda_company`
--

DROP TABLE IF EXISTS `deuda_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deuda_company` (
  `id_deuda` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `id_gestor_cobranza` int NOT NULL,
  `id_company_cobranza` int NOT NULL,
  `estado_deuda` varchar(50) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `codigo_referencia` varchar(50) NOT NULL,
  PRIMARY KEY (`id_deuda`),
  KEY `id_persona` (`id_persona`),
  KEY `id_gestor_cobranza` (`id_gestor_cobranza`),
  KEY `id_company_cobranza` (`id_company_cobranza`),
  CONSTRAINT `deuda_company_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),
  CONSTRAINT `deuda_company_ibfk_2` FOREIGN KEY (`id_gestor_cobranza`) REFERENCES `gestores_cobranza` (`id_gestor_cobranza`),
  CONSTRAINT `deuda_company_ibfk_3` FOREIGN KEY (`id_company_cobranza`) REFERENCES `company_cobranza` (`id_company_cobranza`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deuda_company`
--

LOCK TABLES `deuda_company` WRITE;
/*!40000 ALTER TABLE `deuda_company` DISABLE KEYS */;
INSERT INTO `deuda_company` VALUES (1,2,1,1,'nueva',NULL,'2025-03-16 03:49:07','454');
/*!40000 ALTER TABLE `deuda_company` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:26:36
