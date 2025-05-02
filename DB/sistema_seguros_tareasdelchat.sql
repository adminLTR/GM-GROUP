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
-- Table structure for table `tareasdelchat`
--

DROP TABLE IF EXISTS `tareasdelchat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareasdelchat` (
  `id_tarea` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `estado` enum('pendiente','en_proceso','completada','cancelada') NOT NULL DEFAULT 'pendiente',
  `descripcion` text,
  `imagen` longblob,
  `numero_poliza` varchar(50) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tarea`),
  KEY `id_persona` (`id_persona`),
  CONSTRAINT `tareasdelchat_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareasdelchat`
--

LOCK TABLES `tareasdelchat` WRITE;
/*!40000 ALTER TABLE `tareasdelchat` DISABLE KEYS */;
INSERT INTO `tareasdelchat` VALUES (1,2,'pendiente','Mandar la documentación de la póliza elegida por el cliente',NULL,'quien eres?','2025-02-24 05:34:36','2025-02-24 05:34:36'),(2,2,'pendiente','Mandar la documentación de la póliza elegida por el cliente',NULL,'con quien hablo','2025-02-24 14:12:35','2025-02-24 14:12:35'),(3,31,'pendiente','Mandar la documentación de la póliza elegida por el cliente',NULL,'esta poliza: 37760188','2025-04-17 12:56:34','2025-04-17 12:56:34'),(4,46,'pendiente','Cambio de vehículo para la póliza. Foto de la propiedad del nuevo vehículo recibida.',_binary 'data://432432','1988810','2025-04-17 13:00:02','2025-04-17 13:00:02');
/*!40000 ALTER TABLE `tareasdelchat` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:23:41
