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
-- Table structure for table `campos_ramos`
--

DROP TABLE IF EXISTS `campos_ramos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campos_ramos` (
  `id_campo` int NOT NULL AUTO_INCREMENT,
  `id_ramo` int NOT NULL,
  `nombre_campo` varchar(255) NOT NULL,
  `tipo_dato` enum('texto','número','fecha','booleano') NOT NULL,
  `es_requerido` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_campo`),
  KEY `fk_campos_ramos_ramo` (`id_ramo`),
  CONSTRAINT `campos_ramos_ibfk_1` FOREIGN KEY (`id_ramo`) REFERENCES `ramos` (`id_ramo`) ON DELETE CASCADE,
  CONSTRAINT `fk_campos_ramos_ramo` FOREIGN KEY (`id_ramo`) REFERENCES `ramos` (`id_ramo`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campos_ramos`
--

LOCK TABLES `campos_ramos` WRITE;
/*!40000 ALTER TABLE `campos_ramos` DISABLE KEYS */;
INSERT INTO `campos_ramos` VALUES (1,4,'Domicilio propiedad ','texto',0),(2,4,'Ocupación ','texto',0),(5,5,'Rubro ','texto',0),(7,5,'Valor edificio ','texto',0),(8,5,'Valor contenido ','texto',0),(9,5,'Valor hurto ','texto',0),(10,5,'Tipo construcción. ','texto',0),(12,6,'Ubicación del riesgo ','texto',0),(13,6,'Valor edificio ','texto',0),(14,6,'Valor contenido ','texto',0),(15,6,'Valor hurto ','texto',0),(17,6,'Tipo de construcción ','texto',0),(18,1,'Zona de circulación ','texto',0),(19,7,'Zona de circulacion','texto',0),(20,8,'Zona de circulacion','texto',0),(21,9,'Zona de circulacion','texto',0);
/*!40000 ALTER TABLE `campos_ramos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:27:08
