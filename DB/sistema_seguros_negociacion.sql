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
-- Table structure for table `negociacion`
--

DROP TABLE IF EXISTS `negociacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `negociacion` (
  `id_negociacion` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `foto_propiedad` longblob,
  `descripcion` text,
  `estado` enum('pendiente','aceptada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
  `fecha_inicio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `monto` decimal(10,2) DEFAULT '0.00',
  `comentarios` text,
  PRIMARY KEY (`id_negociacion`),
  KEY `id_persona` (`id_persona`),
  CONSTRAINT `negociacion_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `negociacion`
--

LOCK TABLES `negociacion` WRITE;
/*!40000 ALTER TABLE `negociacion` DISABLE KEYS */;
INSERT INTO `negociacion` VALUES (1,2,NULL,'toyota','pendiente','2025-02-24 14:31:00','2025-02-24 14:31:00',0.00,NULL),(2,2,NULL,'despues te paso','pendiente','2025-02-25 05:49:58','2025-02-25 05:49:58',0.00,NULL),(3,31,NULL,'hyunday blanco del año 2021','pendiente','2025-04-17 12:47:16','2025-04-17 12:47:16',0.00,NULL),(4,42,NULL,'hyunday blanco del 2021','pendiente','2025-04-17 13:57:25','2025-04-17 13:57:25',0.00,NULL),(5,7,NULL,'volkswagen nuevo virtus del 2025','pendiente','2025-04-29 12:57:08','2025-04-29 12:57:08',0.00,NULL),(6,7,NULL,'VOLKSWAGEN nuevo virtus del 2025','pendiente','2025-04-29 12:58:12','2025-04-29 12:58:12',0.00,NULL),(7,7,NULL,'suzuki rmx 2000','pendiente','2025-04-29 14:16:46','2025-04-29 14:16:46',0.00,NULL),(8,7,NULL,'suzuki rmx 2000','pendiente','2025-04-29 14:18:00','2025-04-29 14:18:00',0.00,NULL),(9,7,NULL,'suzuki rmx 2000','pendiente','2025-04-29 14:19:42','2025-04-29 14:19:42',0.00,NULL),(10,7,NULL,'suzuki rmx 2000','pendiente','2025-04-29 14:22:56','2025-04-29 14:22:56',0.00,NULL),(11,8,NULL,'suzuki rmx 2000','pendiente','2025-04-29 14:59:59','2025-04-29 14:59:59',0.00,NULL),(12,8,NULL,'suzuki rmx 2000','pendiente','2025-04-29 15:01:42','2025-04-29 15:01:42',0.00,NULL),(13,8,NULL,'modelo 3 de tesla del año 2022','pendiente','2025-04-29 15:20:23','2025-04-29 15:20:23',0.00,NULL),(14,8,NULL,'modelo 3 de tesla del año 2022','pendiente','2025-04-29 15:32:47','2025-04-29 15:32:47',0.00,NULL),(15,8,NULL,'modelo 3 de tesla del 2022','pendiente','2025-04-29 15:34:52','2025-04-29 15:34:52',0.00,NULL),(16,8,NULL,'suzuki rmx del 2000','pendiente','2025-04-29 15:35:49','2025-04-29 15:35:49',0.00,NULL),(17,8,NULL,'vento 2011','pendiente','2025-04-29 16:47:27','2025-04-29 16:47:27',0.00,NULL),(18,8,NULL,'vento 2011','pendiente','2025-04-29 16:48:39','2025-04-29 16:48:39',0.00,NULL),(19,8,NULL,'Tesla S / X del 96','pendiente','2025-04-30 13:06:08','2025-04-30 13:06:08',0.00,NULL),(20,8,NULL,'tengo un tesla drac del 93','pendiente','2025-04-30 13:09:10','2025-04-30 13:09:10',0.00,NULL),(21,8,NULL,'tengo el modelo x 90d de tesla del 2017','pendiente','2025-04-30 13:14:36','2025-04-30 13:14:36',0.00,NULL),(22,11,NULL,'tengo el modelo x 90d de tesla del 2017','pendiente','2025-04-30 13:57:44','2025-04-30 13:57:44',0.00,NULL),(23,11,NULL,'tengo el modelo X 90D de TESLA del 2017','pendiente','2025-04-30 13:59:25','2025-04-30 13:59:25',0.00,NULL),(24,11,NULL,'tengo el tesla modelo X 90D del 2017','pendiente','2025-04-30 14:00:57','2025-04-30 14:00:57',0.00,NULL),(25,11,NULL,'tengo el modelo X 90D de TESLA del 2017','pendiente','2025-04-30 14:07:44','2025-04-30 14:07:44',0.00,NULL),(26,11,NULL,'tengo el modelo X 90D de TESLA del 2017','pendiente','2025-04-30 14:14:13','2025-04-30 14:14:13',0.00,NULL),(27,11,NULL,'tengo el modelo X 90D de TESLA del 2017','pendiente','2025-04-30 14:16:46','2025-04-30 14:16:46',0.00,NULL),(28,11,NULL,'tengo el modelo X 90D de TESLA del 2017','pendiente','2025-04-30 14:19:02','2025-04-30 14:19:02',0.00,NULL),(29,11,NULL,'tengo el modelo X 90D de TESLA del 2017','pendiente','2025-04-30 14:22:04','2025-04-30 14:22:04',0.00,NULL),(30,11,NULL,'tengo el modelo X 90D de TESLA del 2017','pendiente','2025-04-30 14:22:58','2025-04-30 14:22:58',0.00,NULL),(31,11,NULL,'tengo el tesla modelo x 90d del 2017','pendiente','2025-04-30 14:38:23','2025-04-30 14:38:23',0.00,NULL),(32,11,NULL,'tengo el tesla modelo x 90d del 2017','pendiente','2025-04-30 14:39:27','2025-04-30 14:39:27',0.00,NULL),(33,14,NULL,'tengo un NEZHA N01 430E 55KW EXTRA FULL','pendiente','2025-04-30 15:18:02','2025-04-30 15:18:02',0.00,NULL),(34,14,NULL,'luxury extra full del 2025','pendiente','2025-05-02 15:06:36','2025-05-02 15:06:36',0.00,NULL),(35,14,NULL,'tengo un jaecoo luxury extra full del 2025','pendiente','2025-05-02 15:08:10','2025-05-02 15:08:10',0.00,NULL);
/*!40000 ALTER TABLE `negociacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:24:22
