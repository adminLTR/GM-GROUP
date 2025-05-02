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
-- Table structure for table `ciudades`
--

DROP TABLE IF EXISTS `ciudades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudades` (
  `id_ciudad` int NOT NULL AUTO_INCREMENT,
  `nombre_ciudad` varchar(50) NOT NULL,
  `id_departamento` int NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  KEY `id_departamento` (`id_departamento`),
  CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudades`
--

LOCK TABLES `ciudades` WRITE;
/*!40000 ALTER TABLE `ciudades` DISABLE KEYS */;
INSERT INTO `ciudades` VALUES (1,'Artigas',1),(2,'Bella Unión',1),(3,'Tomás Gomensoro',1),(4,'Canelones',2),(5,'Las Piedras',2),(6,'Pando',2),(7,'Melo',3),(8,'Rio Branco',3),(9,'Tupambaé',3),(10,'Colonia del Sacramento',4),(11,'Nueva Palmira',4),(12,'Carmelo',4),(13,'Durazno',5),(14,'Sarandí del Yí',5),(15,'La Paloma',5),(16,'Trinidad',6),(17,'Florida',7),(18,'Sarandí Grande',7),(19,'Minas',8),(20,'Solís de Mataojo',8),(21,'Maldonado',9),(22,'Punta del Este',9),(23,'San Carlos',9),(24,'Montevideo',10),(25,'Paysandú',11),(26,'Guichón',11),(27,'Fray Bentos',12),(28,'Young',12),(29,'Rivera',13),(30,'Tranqueras',13),(31,'Rocha',14),(32,'Chuy',14),(33,'La Paloma',14),(34,'Salto',15),(35,'Belén',15),(36,'San Antonio',15),(37,'San José de Mayo',16),(38,'Libertad',16),(39,'Mercedes',17),(40,'Dolores',17),(41,'Tacuarembó',18),(42,'Paso de los Toros',18),(43,'Treinta y Tres',19),(44,'Vergara',19);
/*!40000 ALTER TABLE `ciudades` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:24:42
