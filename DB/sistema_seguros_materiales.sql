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
-- Table structure for table `materiales`
--

DROP TABLE IF EXISTS `materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiales` (
  `id_material` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('MANUAL','MATERIAL') NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(500) DEFAULT NULL,
  `id_asignacion` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `id_usuario` int NOT NULL,
  `descripcion` text,
  `id_carpeta` int NOT NULL,
  `id_empresa` int NOT NULL,
  PRIMARY KEY (`id_material`),
  KEY `id_asignacion` (`id_asignacion`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `materiales_ibfk_1` FOREIGN KEY (`id_asignacion`) REFERENCES `asignaciones` (`id_asignacion`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
INSERT INTO `materiales` VALUES (1,'MANUAL','sabado','https://docs.google.com/document/d/1_ytPug_g-EWbLaS4tblc8rBOt091FQf8BE9PLjXzD_Q/edit?pli=1&tab=t.0',4,'2025-03-02 05:12:51','2025-03-02 18:00:12',19,'prueba',1,4),(2,'MANUAL','capo marcerlo','https://docs.google.com/document/d/1_ytPug_g-EWbLaS4tblc8rBOt091FQf8BE9PLjXzD_Q/edit?pli=1&tab=t.0',4,'2025-03-02 05:27:59','2025-03-02 18:00:12',19,'marcelo',2,4),(3,'MANUAL','idolo','https://docs.google.com/document/d/1_ytPug_g-EWbLaS4tblc8rBOt091FQf8BE9PLjXzD_Q/edit?pli=1&tab=t.0',4,'2025-03-02 05:28:25','2025-03-02 18:00:12',19,'marcelo',1,4),(4,'MANUAL','from auto','https://docs.google.com/document/d/1_ytPug_g-EWbLaS4tblc8rBOt091FQf8BE9PLjXzD_Q/edit?pli=1&tab=t.0',4,'2025-03-03 17:24:27',NULL,19,NULL,3,4),(5,'MANUAL','ADMINISTRACION','https://docs.google.com/spreadsheets/d/1ux3P3g5VNsS4ye0jRFZpmlOC3C8CCB2j/edit?usp=drive_link&ouid=109900996265686188764&rtpof=true&sd=true',1,'2025-03-10 14:33:56',NULL,17,NULL,5,4),(6,'MANUAL','CARGA MASICA','https://docs.google.com/spreadsheets/d/1uZLLaJNrp1fT56JfOnuCtIjuFK8puAVeoxtkCmCEJmM/edit?usp=sharing',3,'2025-03-10 14:40:27',NULL,18,NULL,6,4),(7,'MANUAL','PRESENTACION SISTEMA SEGUROS','https://docs.google.com/document/d/1uAlrt8TseSuhw8QwzhMS8R9_npRxFGHVxK6hpD7-UGE/edit?usp=drive_link',1,'2025-03-10 16:09:18',NULL,17,NULL,7,4);
/*!40000 ALTER TABLE `materiales` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:23:50
