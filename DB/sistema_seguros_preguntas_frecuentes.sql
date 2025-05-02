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
-- Table structure for table `preguntas_frecuentes`
--

DROP TABLE IF EXISTS `preguntas_frecuentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas_frecuentes` (
  `id_pregunta_frecuente` int NOT NULL AUTO_INCREMENT,
  `pregunta` varchar(255) NOT NULL,
  `respuesta` text NOT NULL,
  `palabras_clave` varchar(255) DEFAULT NULL,
  `id_asignacion` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `id_empresa` int NOT NULL,
  `id_grupo` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_pregunta_frecuente`),
  KEY `id_asignacion` (`id_asignacion`),
  KEY `fk_preguntas_grupo` (`id_grupo`),
  CONSTRAINT `fk_preguntas_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupos` (`id_grupo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preguntas_frecuentes_ibfk_1` FOREIGN KEY (`id_asignacion`) REFERENCES `asignaciones` (`id_asignacion`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas_frecuentes`
--

LOCK TABLES `preguntas_frecuentes` WRITE;
/*!40000 ALTER TABLE `preguntas_frecuentes` DISABLE KEYS */;
INSERT INTO `preguntas_frecuentes` VALUES (1,'¿Qué es el deducible en un seguro?','El deducible es el monto fijo que debes pagar de tu bolsillo cuando ocurre un siniestro cubierto por tu póliza de seguro. La aseguradora pagará el resto del gasto.\n\nEjemplo:\n\nSi tu póliza tiene un deducible de $500 y tienes un siniestro cuya reparación cuesta $3,000, tú pagarás los primeros $500 y la aseguradora cubrirá los $2,500 restantes.','deducible,siniestro,franquicia,pagar',4,'2025-03-02 03:36:33','2025-03-05 10:06:39',4,6,8),(2,'soy nacional','el mas grande','nacional',3,'2025-03-02 14:03:31','2025-03-05 10:06:39',4,6,8),(3,'HOY','CARLOR','CALOR',NULL,'2025-03-05 10:11:26',NULL,4,6,19),(5,'Que es el deducible','Deducible es la cantidad fija o porcentaje acordado que el asegurado debe pagar por cuenta propia en caso de un siniestro antes de que la aseguradora cubra el resto del monto reclamado. Este monto se establece previamente en la póliza de seguro y su objetivo es compartir el riesgo entre el asegurado y la aseguradora, además de incentivar al asegurado a tomar medidas preventivas para evitar daños.\n\nPor ejemplo, si tienes un seguro de automóvil con un deducible de $500 y sufres un siniestro que causa daños por $3.000, tú deberás pagar primero los $500 y la aseguradora cubrirá los $2.500 restantes.\n\nEn resumen:\n\nEl deducible es la parte del daño que paga siempre el asegurado.\n\nLa aseguradora paga únicamente el monto que supera dicho deducible.\n\nUn deducible más alto suele reducir el costo del seguro (prima), pero aumenta la responsabilidad económica del asegurado en caso de accidente.','deducible, automovil',NULL,'2025-03-25 16:50:54',NULL,4,6,19);
/*!40000 ALTER TABLE `preguntas_frecuentes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:25:09
