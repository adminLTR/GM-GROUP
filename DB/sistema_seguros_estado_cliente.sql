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
-- Table structure for table `estado_cliente`
--

DROP TABLE IF EXISTS `estado_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_cliente` (
  `id_estado_cliente` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `estado_cliente` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `vista` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_estado_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_cliente`
--

LOCK TABLES `estado_cliente` WRITE;
/*!40000 ALTER TABLE `estado_cliente` DISABLE KEYS */;
INSERT INTO `estado_cliente` VALUES (67,27,'InsuranceQuote','2'),(70,27,'Follow24hs','1'),(71,31,'CoordinationAdvisor','1'),(72,31,'SendingQuote','2'),(133,108,'messageAuto','1'),(134,108,'RegisterProspect','2'),(135,109,'CoordinationAdvisor','1'),(136,109,'Follow48hs','2'),(138,27,'persona','1'),(139,27,'RegisterProspect','2'),(140,28,'messageAuto','1'),(141,28,'RegisterProspect','2'),(142,29,'persona','1'),(143,29,'RegisterProspect','2'),(144,31,'persona','1'),(145,31,'RegisterProspect','2'),(146,32,'persona','1'),(147,32,'RegisterProspect','2'),(148,33,'persona','1'),(149,33,'RegisterProspect','2'),(150,34,'persona','1'),(151,34,'RegisterProspect','2'),(152,37,'persona','1'),(153,37,'RegisterProspect','2'),(154,38,'persona','1'),(155,38,'RegisterProspect','2'),(156,39,'persona','1'),(157,39,'RegisterProspect','2'),(158,40,'persona','1'),(159,40,'RegisterProspect','2'),(160,42,'persona','1'),(161,42,'RegisterProspect','2'),(162,43,'persona','1'),(163,43,'RegisterProspect','2'),(164,44,'persona','1'),(165,44,'RegisterProspect','2'),(166,45,'persona','1'),(167,45,'RegisterProspect','2'),(168,46,'persona','1'),(169,46,'RegisterProspect','2'),(170,47,'persona','1'),(171,47,'RegisterProspect','2'),(172,48,'persona','1'),(173,48,'RegisterProspect','2'),(174,49,'persona','1'),(175,49,'RegisterProspect','2'),(176,53,'persona','1'),(177,53,'RegisterProspect','2'),(178,54,'persona','1'),(179,54,'RegisterProspect','2'),(180,55,'persona','1'),(181,55,'RegisterProspect','2'),(182,56,'persona','1'),(183,56,'RegisterProspect','2'),(184,57,'persona','1'),(185,57,'RegisterProspect','2'),(186,58,'persona','1'),(187,58,'RegisterProspect','2'),(188,59,'persona','1'),(189,59,'RegisterProspect','2'),(190,60,'persona','1'),(191,60,'RegisterProspect','2'),(192,61,'persona','1'),(193,61,'RegisterProspect','2'),(194,62,'persona','1'),(195,62,'RegisterProspect','2'),(196,64,'persona','1'),(197,64,'RegisterProspect','2'),(198,65,'persona','1'),(199,65,'RegisterProspect','2'),(200,66,'persona','1'),(201,66,'RegisterProspect','2'),(202,67,'persona','1'),(203,67,'RegisterProspect','2'),(204,68,'persona','1'),(205,68,'RegisterProspect','2'),(206,69,'persona','1'),(207,69,'RegisterProspect','2'),(208,70,'persona','1'),(209,70,'RegisterProspect','2'),(210,71,'persona','1'),(211,71,'RegisterProspect','2'),(212,72,'persona','1'),(213,72,'RegisterProspect','2'),(214,73,'persona','1'),(215,73,'RegisterProspect','2'),(216,74,'persona','1'),(217,74,'RegisterProspect','2'),(218,75,'persona','1'),(219,75,'RegisterProspect','2'),(220,76,'persona','1'),(221,76,'RegisterProspect','2'),(222,77,'persona','1'),(223,77,'RegisterProspect','2'),(224,78,'persona','1'),(225,78,'RegisterProspect','2'),(226,79,'persona','1'),(227,79,'RegisterProspect','2'),(228,94,'persona','1'),(229,94,'RegisterProspect','2'),(230,105,'messageAuto','1'),(231,105,'InsuranceQuote','2'),(232,106,'persona','1'),(233,106,'InsuranceQuote','2'),(234,107,'persona','1'),(235,107,'RegisterProspect','2'),(236,110,'Follow24hs','1'),(237,110,'InsuranceQuote','2'),(238,111,'CoordinationAdvisor','1'),(239,111,'Follow48hs','2');
/*!40000 ALTER TABLE `estado_cliente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:26:29
