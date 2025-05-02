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
-- Table structure for table `ingresosparaadmin`
--

DROP TABLE IF EXISTS `ingresosparaadmin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingresosparaadmin` (
  `id_ingreso` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_proveedor` int NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `nota` text,
  `tipo_recurrencia` enum('recurrente','no_recurrente') NOT NULL DEFAULT 'no_recurrente',
  `importe_proyectado` decimal(10,2) DEFAULT NULL,
  `importe_real` decimal(10,2) DEFAULT NULL,
  `fecha_estimada` date DEFAULT NULL,
  `estado` enum('pendiente_confirmacion','confirmado') NOT NULL DEFAULT 'pendiente_confirmacion',
  `fecha_confirmacion` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ingreso`),
  KEY `fk_ingresos_empresa` (`id_empresa`),
  KEY `fk_ingresos_proveedor` (`id_proveedor`),
  CONSTRAINT `fk_ingresos_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas_brokers` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ingresos_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingresosparaadmin`
--

LOCK TABLES `ingresosparaadmin` WRITE;
/*!40000 ALTER TABLE `ingresosparaadmin` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingresosparaadmin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:28:33
