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
-- Table structure for table `debito`
--

DROP TABLE IF EXISTS `debito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `debito` (
  `id_debito` int NOT NULL AUTO_INCREMENT,
  `id_deuda` int NOT NULL,
  `monto_original` decimal(10,2) NOT NULL,
  `expense_admi` decimal(10,2) NOT NULL,
  `iva` decimal(5,2) NOT NULL,
  `comision_empresa` decimal(5,2) NOT NULL,
  `comision_gestor_original` decimal(5,2) NOT NULL,
  `comision_gestor_bonificada` decimal(5,2) NOT NULL,
  `comision_vendedor` decimal(5,2) NOT NULL,
  `monto_total_administrado` decimal(10,2) NOT NULL,
  `monto_total_final` decimal(10,2) NOT NULL,
  `fecha_debito` datetime DEFAULT CURRENT_TIMESTAMP,
  `numero_factura` varchar(50) NOT NULL,
  PRIMARY KEY (`id_debito`),
  KEY `fk_debito_deuda_company` (`id_deuda`),
  CONSTRAINT `fk_debito_deuda_company` FOREIGN KEY (`id_deuda`) REFERENCES `deuda_company` (`id_deuda`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debito`
--

LOCK TABLES `debito` WRITE;
/*!40000 ALTER TABLE `debito` DISABLE KEYS */;
INSERT INTO `debito` VALUES (1,1,10000.00,45.00,22.00,12.00,10.00,5.00,12.00,0.00,0.00,'2025-03-16 04:12:56','4545'),(7,1,1000.00,45.00,22.00,0.00,0.00,0.00,0.00,1045.00,1067.00,'2025-03-16 04:27:08','2121'),(8,1,1000.00,45.00,22.00,0.00,0.00,0.00,0.00,0.00,1549.00,'2025-03-16 05:19:43','5454');
/*!40000 ALTER TABLE `debito` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:29:09
