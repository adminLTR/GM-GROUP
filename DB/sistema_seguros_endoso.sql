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
-- Table structure for table `endoso`
--

DROP TABLE IF EXISTS `endoso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endoso` (
  `id_endoso` int NOT NULL AUTO_INCREMENT,
  `id_poliza` int NOT NULL,
  `id_persona` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `id_cobertura` int DEFAULT NULL,
  `id_compania` int NOT NULL,
  `id_corredor` int NOT NULL,
  `moneda` enum('$','USD') NOT NULL DEFAULT '$',
  `precio` decimal(10,2) NOT NULL,
  `codigo_poliza` varchar(50) NOT NULL,
  `motivo_endoso` varchar(50) NOT NULL,
  `nueva_referencia` varchar(100) DEFAULT NULL,
  `nuevo_ano` varchar(4) DEFAULT NULL,
  `nueva_marca` varchar(100) DEFAULT NULL,
  `nueva_modelo` varchar(100) DEFAULT NULL,
  `nuevo_precio` decimal(10,2) DEFAULT NULL,
  `nuevo_id_cobertura` int DEFAULT NULL,
  `nuevo_nombre_cobertura` varchar(100) DEFAULT NULL,
  `nuevo_precio_plan` decimal(10,2) DEFAULT NULL,
  `nueva_cantidad_cuotas` int DEFAULT NULL,
  `nueva_ubicacion` varchar(100) DEFAULT NULL,
  `nuevo_precio_ubic` decimal(10,2) DEFAULT NULL,
  `usuario_solicitante` varchar(100) NOT NULL,
  `fecha_endoso` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `referencia` varchar(100) DEFAULT NULL,
  `ano` varchar(4) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `fecha_solicitud` datetime NOT NULL,
  PRIMARY KEY (`id_endoso`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endoso`
--

LOCK TABLES `endoso` WRITE;
/*!40000 ALTER TABLE `endoso` DISABLE KEYS */;
INSERT INTO `endoso` VALUES (1,30,26,'JORGE FERNANDO','MACHADO PERDOMO,','39452076','096124723',1,1,1,'$',1601.00,'405208','cambio_matricula','HAE1390',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'desconocido','2025-04-03 14:18:25','E/T','2015','YUMBO','SHARK SHARK 200 MOTARD','2025-04-03 14:18:25');
/*!40000 ALTER TABLE `endoso` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:26:14
