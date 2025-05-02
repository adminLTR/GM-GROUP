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
-- Table structure for table `polizas`
--

DROP TABLE IF EXISTS `polizas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `polizas` (
  `id_poliza` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `id_persona` int NOT NULL,
  `id_ramo` int DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `medio_pago` enum('Tarjeta de Crédito','Mercado Pago','Redes de Cobranza') NOT NULL DEFAULT 'Redes de Cobranza',
  `cantidad_cuotas` int NOT NULL DEFAULT '1',
  `estado_vigencia` enum('VIGENTE','NO_VIGENTE') NOT NULL DEFAULT 'VIGENTE',
  `id_compania` int NOT NULL,
  `id_canal` int NOT NULL,
  `id_corredor` int NOT NULL,
  `moneda` enum('$','USD') NOT NULL DEFAULT '$',
  `id_cobertura` int DEFAULT NULL,
  `prima` decimal(10,2) NOT NULL DEFAULT '0.00',
  `referencia` varchar(100) DEFAULT NULL,
  `ano` varchar(4) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_poliza`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_polizas_persona` (`id_persona`),
  KEY `fk_polizas_ramos` (`id_ramo`),
  KEY `fk_polizas_companias` (`id_compania`),
  KEY `fk_polizas_canales` (`id_canal`),
  KEY `fk_polizas_corredor` (`id_corredor`),
  KEY `fk_polizas_cobertura` (`id_cobertura`),
  CONSTRAINT `fk_polizas_canales` FOREIGN KEY (`id_canal`) REFERENCES `canales_comercializacion` (`id_canal`),
  CONSTRAINT `fk_polizas_cobertura` FOREIGN KEY (`id_cobertura`) REFERENCES `coberturas` (`id_cobertura`),
  CONSTRAINT `fk_polizas_companias` FOREIGN KEY (`id_compania`) REFERENCES `companias_seguros` (`id_compania`),
  CONSTRAINT `fk_polizas_corredor` FOREIGN KEY (`id_corredor`) REFERENCES `corredores` (`id_corredor`),
  CONSTRAINT `fk_polizas_persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE,
  CONSTRAINT `fk_polizas_ramos` FOREIGN KEY (`id_ramo`) REFERENCES `ramos` (`id_ramo`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `polizas`
--

LOCK TABLES `polizas` WRITE;
/*!40000 ALTER TABLE `polizas` DISABLE KEYS */;
INSERT INTO `polizas` VALUES (1,'398305',1,1,'2025-01-14','2026-01-14',1600.00,'Redes de Cobranza',1,'VIGENTE',1,1,1,'$',1,737.00,'BFL305','2021','Yumgo','Px110'),(2,'385429',2,1,'2024-11-27','2025-11-27',31819.00,'Redes de Cobranza',10,'VIGENTE',1,2,1,'$',7,19492.00,'BEC6123','2019','VOLKSWAGEN','VENTO 1.4'),(3,'403238',3,1,'2025-02-07','2026-02-07',356.12,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',2,207.73,NULL,'1997','CHEVROLET','CHEVROLET S 10 S 10 DLX TURBO DIESEL 2.5 CAB. EXTENDIDA'),(4,'403714',4,1,'2025-02-11','2026-02-11',322.26,'Redes de Cobranza',10,'VIGENTE',1,3,1,'$',2,187.99,NULL,'2012','FAW','FAW N5 N5 1.0 FULL 4P'),(6,'403851',5,1,'2025-02-13','2026-02-13',6123.00,'Redes de Cobranza',6,'VIGENTE',1,3,1,'$',2,2685.00,NULL,'1991','VOLKSWAGEN','VOLKSWAGEN GOL GOL CLMI 1.6 CD DIR 2P.'),(8,'404390',6,1,'2025-02-25','2026-02-25',8859.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',4,5010.78,'REGERE','2018','RENAULT','KWID'),(9,'404381',7,1,'2025-02-24','2026-02-24',1600.00,'Redes de Cobranza',1,'VIGENTE',1,1,1,'$',1,744.00,NULL,'2024','BACCIO','CLASIC FX 200'),(10,'404192',8,1,'2025-02-20','2026-02-20',29991.00,'Redes de Cobranza',10,'VIGENTE',1,3,1,'$',7,18237.16,NULL,'2019','KIA','MOTORS RIO NUEVO RIO 1.4 EX PLUS EX.FULL.TECHO.LLAN 17.AY.EST'),(12,'404183',9,1,'2025-02-20','2026-02-20',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,744.27,NULL,'2014','YUMBO','MAX MAX 110'),(13,'404507',10,1,'2025-02-26','2026-02-26',6100.00,'Redes de Cobranza',3,'VIGENTE',1,1,1,'$',3,2685.84,NULL,'1991','WOLKSWGEN','KOMBI'),(14,'403930',11,1,'2025-02-14','2026-02-14',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,744.27,NULL,'2025','YAMAHA','YAMAHA XTZ XTZ 125'),(15,'403989',12,1,'2025-02-17','2026-02-17',3300.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',NULL,1997.53,NULL,'2024','VOLKSWAGEN','SAVEIRO SAVEIRO VII 1.6 DC FULL 2ABAG ABS CES ASR DOCK ST AY.EST.'),(16,'404076',13,1,'2025-02-18','2026-02-18',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,744.27,NULL,'2024','ZANELLA','ZB 110'),(17,'404109',14,1,'2025-02-19','2026-02-19',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,744.27,NULL,'1999','HERO','HONDA CD100 SLEEK SLEEK'),(18,'404115',15,1,'2025-02-18','2026-02-18',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,744.27,NULL,'1978','HONDA','CG 125'),(19,'404130',16,1,'2025-02-19','2026-02-19',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,744.27,NULL,'2025','ZANELLA','DUE'),(20,'404140',17,1,'2025-02-19','2026-02-19',33339.00,'Redes de Cobranza',6,'VIGENTE',1,2,1,'$',7,21332.45,NULL,'2015','VOLKSWAGEN','GOL VI 1.6 POWER SEDAN FULL. 2ABAG. ABS 4P.'),(21,'404180',18,1,'2025-02-19','2026-02-19',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,744.27,NULL,'2014','YUMBO','MAX 110'),(22,'404413',19,1,'2025-02-24','2026-02-24',38638.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',7,26919.63,NULL,'2021','PEUGEOT','PEUGEOT 2008 NUEVA 2008 ACTIVE 1.2T 130HP EX.FULL.6ABAG.AY.EST.'),(23,'404144',20,1,'2025-02-18','2026-02-18',30377.00,'Redes de Cobranza',1,'VIGENTE',1,1,1,'$',7,20840.00,NULL,'2016','PEUGEOT','208 208 1.0 VTI LIKE FULL. 4ABAG. ABS 5P.'),(24,'408385',21,1,'2025-03-06','2026-03-06',6372.00,'Redes de Cobranza',10,'VIGENTE',1,3,1,'$',3,2704.32,'HAC4519','2011','RENAULT','SYMBOL SYMBOL EXPRESSION 1.6 FULL. 2ABAG. ABS 4P. (ARG)'),(25,'408347',22,1,'2025-03-05','2026-03-05',6101.00,'Redes de Cobranza',3,'VIGENTE',1,2,1,'$',3,3005.60,'HAQ058','2000','RENAULT','LAGUNA LAGUNA RXE 1.8 FULL ABS. 2ABAG 5P.'),(26,'408404',24,1,'2025-03-06','2026-03-06',6101.00,'Redes de Cobranza',3,'VIGENTE',1,2,1,'$',3,3005.60,'HAA8204','2013','CHEVROLET','SPARK SPARK 800 LITE DIR 5P. (COR)'),(28,'408383',23,1,'2025-03-05','2026-03-05',1601.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,753.60,'HIB6840','2016','SUZUKI','GSX GSX 150 DEAL'),(29,'408503',25,1,'2025-03-07','2026-03-07',4801.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',2,2048.82,'BAA0976','1987','TOYOTA','HILUX HILUX DOBLE CAB. DIESEL'),(30,'405208',26,1,'2025-02-28','2026-02-28',1601.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,744.27,'HAE1390','2015','YUMBO','SHARK SHARK 200 MOTARD'),(31,'408574',27,1,'2025-03-07','2026-03-07',3301.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,2004.78,'HAD533','1970','CHEVROLET','C10/C14/C20 C 10 PICK UP DIESEL'),(32,'408651',28,1,'2025-03-10','2026-03-10',4801.00,'Redes de Cobranza',1,'VIGENTE',1,1,1,'$',1,2048.83,'BEB4897','2004','RENAULT','CLIO CLIO EXPRESSION FULL. 2ABAG 1.6 5P. (BRA)(ARG)'),(33,'409047',29,1,'2025-03-10','2026-03-10',1601.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,753.60,'HIB7994','2021','BACCIO','PX 125 F'),(34,'409049',30,1,'2025-03-10','2026-03-10',1601.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,753.60,'HIA3981','2016','MOTOMEL','S2 125'),(35,'409098',31,1,'2025-03-11','2026-03-11',3301.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,2004.78,'HAN596','1983','FIAT','147'),(36,'409192',32,1,'2025-03-13','2026-03-13',3300.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,2002.90,'HAC4582','1990','CHEVROLET','CHEVROLET'),(37,'409230',33,1,'2025-03-13','2026-03-13',4801.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',2,2048.83,'HAA5810','1998','VOLKSWAGEN','GOL GOL CLMI 1.6 CD DIR 2P.'),(38,'409251',34,1,'2025-03-13','2026-03-13',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,753.60,'E/T','2025','ZANELLA','ZB 110 Z3 ST'),(39,'409280',35,1,'2025-03-13','2026-03-13',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,753.60,'E/T','2025','ZANELLA','SAPUCAI 125'),(40,'409324',36,1,'2025-03-14','2026-03-14',6101.00,'Redes de Cobranza',3,'VIGENTE',1,2,1,'$',3,3005.60,'HAE252','1999','ROVER','416 SI LUX (TL8) FULL CUERO 2ABAG 4P.'),(41,'409365',37,1,'2025-03-17','2026-03-17',3301.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,2002.90,'E/T','2025','CHEVROLET','MONTANA'),(42,'409376',38,1,'2025-03-14','2026-03-14',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,753.60,'409376','2021','YUMBO','YUMBO'),(43,'01-16-00000452',39,4,'2025-03-17','2026-03-17',22933.00,'Redes de Cobranza',1,'VIGENTE',1,1,1,'$',7,17445.12,'alquiler',NULL,NULL,NULL),(44,'409518',40,1,'2025-03-18','2026-03-18',6101.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',3,2999.02,'SAU4811','1998','CITROEN','JUMPER'),(45,'409634',41,1,'2025-03-19','2026-03-19',6101.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',3,2999.02,'E/T','2025','VOLKSWAGEN','SAVEIRO'),(46,'409629',42,1,'2025-03-14','2026-03-14',4801.00,'Redes de Cobranza',1,'VIGENTE',1,1,1,'$',2,2048.83,'BHW609','1994','SAAB','9000 CSE 5 PTS.'),(47,'409654',40,1,'2025-03-18','2026-03-18',6101.00,'Redes de Cobranza',3,'VIGENTE',1,2,1,'$',3,3005.60,'IAB1806','1987','RENAULT','18 TD DIESEL (ARG) (ROU)'),(48,'409670',43,1,'2025-03-19','2026-03-19',6101.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',3,3005.50,'HAB6258','2001','RENAULT','MEGANE 2 RXE TDIESEL 1.9 FULL ABS. CD 4P. (ARG)'),(49,'409198',44,7,'2025-03-13','2026-03-13',1601.00,'Redes de Cobranza',1,'VIGENTE',1,6,5,'$',1,753.60,'E/T','2025','ZANELLA','SAPUCAI 125'),(50,'1988536',45,1,'2025-03-07','2026-03-07',3298.29,'Redes de Cobranza',3,'VIGENTE',2,3,1,'$',18,2203.00,'HIB7473','2019','YAMAHA','MOTOCICLETA DE 070 A 149 CM3 2019'),(51,'1988810',46,1,'2025-03-10','2026-03-10',4085.00,'Redes de Cobranza',6,'VIGENTE',2,3,1,'$',18,2703.00,'E/T','2025','BACCIO','MOTOCICLETA DESDE 071 HASTA 149 CM3'),(53,'409794',47,1,'2025-03-20','2026-03-20',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,754.34,'HIB6648','2021','BACCIO','PX 110'),(54,'409988',48,1,'2025-03-24','2026-03-24',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,751.72,'E/T','2025','YUMBO','MAX'),(55,'410054',49,1,'2025-03-24','2026-03-24',3301.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,944.85,'HAC7469','1976','FIAT','600'),(56,'410030',50,1,'2025-03-24','2026-03-24',3301.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,2004.90,'B140029','1993','DAIHATSU','FEROZA'),(57,'409980',51,1,'2025-03-24','2026-03-24',6101.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',1,3005.60,'HAD8314','1986','TOYOTA','COROLLA DLX'),(58,'409976',52,1,'2025-03-24','2026-03-24',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,751.72,'HIR663','2006','YUMBO','CITY 110'),(59,'410157',53,1,'2025-03-26','2026-03-26',4501.00,'Redes de Cobranza',6,'VIGENTE',1,3,1,'$',4,1599.23,'E/T','2025','VITAL','TWIST'),(60,'410190',54,1,'2025-03-26','2026-03-26',6101.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',3,2999.02,'IAD2653','2013','FIAT','FIORINO 1.3 FURGÓN'),(61,'1993358',55,1,'2025-03-31','2026-03-31',43188.85,'Redes de Cobranza',10,'VIGENTE',2,1,1,'$',13,28163.00,'E/T','2025','OMODA','5 1.5T LUXURY MHEV EXTRA FULL,'),(62,'410212',56,1,'2025-03-27','2026-03-27',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,751.72,'HKK192','2010','YUMBO','CITY'),(63,'410710',57,1,'2025-03-28','2026-03-28',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,751.72,'E/T','2025','BACCIO','PX'),(64,'410850',58,1,'2025-03-31','2026-03-31',5700.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',3,2704.63,'JFC7006','2018','NISSAN','VERSA DRIVE 1.6 FULL. 2ABAG. ABS 4P'),(65,'410886',59,9,'2025-03-31','2026-03-31',37615.00,'Redes de Cobranza',10,'VIGENTE',1,8,3,'$',7,23275.68,'SCH9372','2014','NISSAN','FRONTIER'),(66,'410829',60,1,'2025-03-31','2026-03-31',1600.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,753.60,'HIC6020','2024','BACCIO','F200'),(67,'410742',61,1,'2025-03-28','2026-03-28',1601.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,753.60,'HIC3262','2022','HONDA','CG 110'),(68,'410110',62,8,'2025-03-25','2026-03-25',1600.01,'Redes de Cobranza',1,'VIGENTE',1,7,4,'$',1,751.72,'HIB9859','2021','YUMBO','125CC'),(69,'410067',63,7,'2025-03-25','2026-03-25',1600.00,'Redes de Cobranza',1,'VIGENTE',1,6,5,'$',1,751.72,'E/T','2025','ZANELLA','125 CC'),(70,'410912',64,1,'2025-04-01','2026-04-01',7136.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',4,3777.11,'HAC5742','2022','FIAT',': NUEVA STRADA DOB. CAB. 1.4 FREEDOM FULL. 4ABAG. AB'),(71,'410904',65,1,'2025-03-31','2026-03-31',6101.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',3,3005.60,'EMA9039','2011','FIAT','STRADA PICK UP ADVENTURE 1.6I CAB. EXTENDIDA FULL'),(72,'411488',66,1,'2025-04-01','2026-04-01',6370.00,'Redes de Cobranza',10,'VIGENTE',1,3,1,'$',3,2710.24,'LEA3937','1999','HYUNDAI','ATOS GLS C/ACCESORIOS'),(73,'1993647',67,1,'2025-04-01','2026-04-01',3333.04,'Redes de Cobranza',6,'VIGENTE',2,3,1,'$',18,2315.25,'HKR550','2012','YUMBO','MOTOCICLETA DE 070 A 149 CM3'),(74,'413201',68,1,'2025-04-01','2026-04-01',19304.00,'Redes de Cobranza',10,'VIGENTE',1,3,1,'$',7,11235.27,'OAE6772','2023','VOLKSWAGEN','SAVEIRO VII 1.6 DC FULL 2ABAG ABS CES ASR DOCK ST AY.EST'),(75,'413209',69,1,'2025-04-01','2026-04-01',1601.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,756.30,'ccm798','2005','YUMBO','110 cc'),(76,'410250',70,1,'2025-03-27','2026-03-27',7777.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',4,4233.37,'ABI3363','2022','CITROEN','BERLINGO 1.6 M69 ESSENCE DIR A/A 2ABAG ABS P.LAT(ARG)AD.A RURAL'),(78,'410654',71,1,'2025-03-27','2026-03-27',5700.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',3,2704.63,'NAN5320','2008','CHEVROLET','CORSA 1.6 VID. 5P'),(79,'350024',72,1,'2025-02-18','2026-04-25',4876.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',7,3314.38,'HAE1319','2025','FIAT','NUEVA STRADA DOB. CAB. 1.3 FREEDOM FULL 4ABAG ABS LED'),(80,'413325',73,1,'2025-04-03','2026-04-03',4800.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',2,2058.28,'IAB7581','2001','MITSUBISHI','CLASSIC L 200 DOBLE CABINA DIESEL DIR. A/A'),(81,'413669',74,1,'2025-04-04','2026-04-04',4800.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',2,2058.28,'B133209','2003','FIAT','FIORINO 1.3 FURGÓN'),(83,'413986',75,1,'2025-04-04','2026-04-04',27823.00,'Redes de Cobranza',10,'VIGENTE',1,1,1,'$',7,16844.12,'BEC9446','2018','VOLKSWAGEN','VIRTUS 1.6 CONFORTLINE FULL.4ABAG.ABS.C.EST..AY.ES'),(84,'41366',76,1,'2025-04-04','2026-04-04',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,756.30,'SLF536','2017','BENELLI','150 CC'),(85,'413638',77,7,'2025-04-04','2026-04-04',1600.00,'Redes de Cobranza',1,'VIGENTE',1,6,5,'$',1,756.30,'E/T',NULL,NULL,NULL),(86,'413337',78,1,'2025-04-02','2026-04-02',3300.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,2007.48,'MTR7681','2023','TRAILLER','* Sin Catalogos *'),(88,'414112',79,1,'2025-04-04','2026-04-04',6100.00,'Redes de Cobranza',3,'VIGENTE',1,3,1,'$',2,3015.06,'HAC2552','2016','FIAT','NUEVO UNO WAY L 1.4 FULL. 2ABAG. ABS 5P.'),(89,'414125',80,1,'2025-04-04','2026-04-04',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,756.30,'E/T','2024','ZANELLA','200CC'),(90,'414224',81,1,'2025-04-07','2026-04-07',6100.00,'Redes de Cobranza',3,'VIGENTE',1,2,1,'$',3,3015.06,'HAB9273','2015','GWM','WINGLE 5 DOBLE CABINA 2.2 LUXURY FULL. 2ABAG. ABS'),(91,'414254',82,1,'2025-04-07','2026-04-07',18286.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',7,11983.45,'HDI1215','2017','VOLKSWAGEN','UP MOVE 1.0 FULL. 2ABAG. ABS 5P.'),(92,'414261',82,1,'2025-04-07','2026-04-07',1600.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,756.30,'HLC298','2014','WINNER','110 cc'),(93,'414323',83,1,'2025-04-08','2026-04-08',3300.00,'Redes de Cobranza',1,'VIGENTE',1,2,1,'$',1,2007.48,'HAD7455','1983','FIAT','SPAZIO 1.4 3P. (ARG)'),(94,'414365',84,1,'2025-04-08','2026-04-08',3300.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,2007.48,'BED5642','2019','CHEVROLET','NUEVO PRISMA 1.4 LTZ FULL.2ABAG.ABS.LLAN.FAROS.ESP'),(96,'414406',85,1,'2025-04-09','2026-04-09',3301.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,2007.48,'EBH4644','2001','VOLKSWAGEN','GOL CLMI 1.6 FULL 4P'),(97,'414412',86,1,'2025-04-09','2026-04-09',3100.00,'Redes de Cobranza',1,'VIGENTE',1,3,1,'$',1,1860.28,'B579396','2009','CHEVROLET','NUEVO CORSA SEDÁN GL 1.8I A/A. DIR 4P. (ARG)');
/*!40000 ALTER TABLE `polizas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `actualizar_estado_poliza` BEFORE INSERT ON `polizas` FOR EACH ROW BEGIN
    IF CURRENT_DATE() NOT BETWEEN NEW.fecha_inicio AND NEW.fecha_fin THEN
        SET NEW.estado_vigencia = 'NO VIGENTE';
    ELSE
        SET NEW.estado_vigencia = 'VIGENTE';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `actualizar_es_cliente` AFTER INSERT ON `polizas` FOR EACH ROW BEGIN
    UPDATE persona
    SET es_cliente = 1
    WHERE id_persona = NEW.id_persona;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `actualizar_estado_poliza_update` BEFORE UPDATE ON `polizas` FOR EACH ROW BEGIN
    IF CURRENT_DATE() NOT BETWEEN NEW.fecha_inicio AND NEW.fecha_fin THEN
        SET NEW.estado_vigencia = 'NO VIGENTE';
    ELSE
        SET NEW.estado_vigencia = 'VIGENTE';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 13:26:56
