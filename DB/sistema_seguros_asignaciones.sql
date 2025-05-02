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
-- Table structure for table `asignaciones`
--

DROP TABLE IF EXISTS `asignaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaciones` (
  `id_asignacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_corredor` int DEFAULT NULL,
  `id_empresa` int NOT NULL,
  `fecha_asignacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('activa','inactiva') NOT NULL DEFAULT 'activa',
  PRIMARY KEY (`id_asignacion`),
  KEY `fk_asignacion_corr` (`id_corredor`),
  KEY `fk_asignacion_emp` (`id_empresa`),
  KEY `fk_asignacion_usuario` (`id_usuario`),
  CONSTRAINT `fk_asignacion_corr` FOREIGN KEY (`id_corredor`) REFERENCES `corredores` (`id_corredor`) ON DELETE CASCADE,
  CONSTRAINT `fk_asignacion_emp` FOREIGN KEY (`id_empresa`) REFERENCES `empresas_brokers` (`id_empresa`) ON DELETE CASCADE,
  CONSTRAINT `fk_asignacion_user` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaciones`
--

LOCK TABLES `asignaciones` WRITE;
/*!40000 ALTER TABLE `asignaciones` DISABLE KEYS */;
INSERT INTO `asignaciones` VALUES (1,17,NULL,4,'2025-02-20 14:40:54','activa'),(2,NULL,1,4,'2025-02-20 14:40:54','activa'),(3,18,NULL,4,'2025-02-20 14:59:41','activa'),(4,19,NULL,4,'2025-02-20 14:59:41','activa'),(5,NULL,1,4,'2025-02-20 14:59:41','inactiva'),(6,NULL,2,4,'2025-03-17 15:34:06','activa'),(7,NULL,4,4,'2025-03-18 16:34:59','activa'),(8,NULL,3,4,'2025-03-18 16:35:05','activa'),(9,NULL,5,4,'2025-03-20 15:55:47','activa'),(10,19,NULL,4,'2025-04-02 10:25:36','activa'),(11,NULL,3,4,'2025-04-02 10:25:36','inactiva');
/*!40000 ALTER TABLE `asignaciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:30:03
