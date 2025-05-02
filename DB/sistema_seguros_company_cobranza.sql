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
-- Table structure for table `company_cobranza`
--

DROP TABLE IF EXISTS `company_cobranza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_cobranza` (
  `id_company_cobranza` int NOT NULL AUTO_INCREMENT,
  `paises` int NOT NULL,
  `departamentos` int NOT NULL,
  `ciudades` int NOT NULL,
  `calle` varchar(100) NOT NULL,
  `numero_puerta` varchar(10) NOT NULL,
  `company_rubro` int NOT NULL,
  `comercial_company` int NOT NULL,
  `poseedor_legal` varchar(100) NOT NULL,
  `nombre_contacto` varchar(100) NOT NULL,
  `telefono_contacto` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `bank` int NOT NULL,
  `numero_cuenta` varchar(50) NOT NULL,
  `tipo_cuenta` enum('caja_ahorro','cuenta_corriente') NOT NULL,
  `propietario_cuenta` varchar(100) NOT NULL,
  `bcu` varchar(50) DEFAULT NULL,
  `tipo_empresa` enum('extrajudicial','temprana') NOT NULL,
  `comision_empresa` decimal(5,2) NOT NULL,
  `comision_vendedor` decimal(5,2) NOT NULL,
  `comision_gestor_original` decimal(5,2) NOT NULL,
  `comision_gestor_bonificada` decimal(5,2) NOT NULL,
  `expense_admi` decimal(10,2) NOT NULL,
  `IVA` decimal(5,2) NOT NULL,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('activo','inactivo') NOT NULL,
  `ruc` varchar(50) DEFAULT NULL,
  `comapany_nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_company_cobranza`),
  KEY `paises` (`paises`),
  KEY `departamentos` (`departamentos`),
  KEY `ciudades` (`ciudades`),
  KEY `company_rubro` (`company_rubro`),
  KEY `comercial_company` (`comercial_company`),
  KEY `bank` (`bank`),
  CONSTRAINT `company_cobranza_ibfk_1` FOREIGN KEY (`paises`) REFERENCES `paises` (`id_pais`),
  CONSTRAINT `company_cobranza_ibfk_2` FOREIGN KEY (`departamentos`) REFERENCES `departamentos` (`id_departamento`),
  CONSTRAINT `company_cobranza_ibfk_3` FOREIGN KEY (`ciudades`) REFERENCES `ciudades` (`id_ciudad`),
  CONSTRAINT `company_cobranza_ibfk_4` FOREIGN KEY (`company_rubro`) REFERENCES `company_rubro` (`id_rubro`),
  CONSTRAINT `company_cobranza_ibfk_5` FOREIGN KEY (`comercial_company`) REFERENCES `comercial_company` (`id_comercial_company`),
  CONSTRAINT `company_cobranza_ibfk_6` FOREIGN KEY (`bank`) REFERENCES `bank` (`id_bank`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_cobranza`
--

LOCK TABLES `company_cobranza` WRITE;
/*!40000 ALTER TABLE `company_cobranza` DISABLE KEYS */;
INSERT INTO `company_cobranza` VALUES (1,1,1,1,'SAN EUGENIO','1178',1,1,'PRUEBA ','JUAN','454554','sasa@ol.com',2,'45545','caja_ahorro','jUAN','54545','extrajudicial',12.00,12.00,10.00,5.00,45.00,22.00,'2025-03-16 02:03:30','activo','65566','PRUEBA');
/*!40000 ALTER TABLE `company_cobranza` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:28:18
