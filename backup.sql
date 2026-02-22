-- MySQL dump 10.13  Distrib 9.6.0, for Linux (x86_64)
--
-- Host: localhost    Database: sevicesystem
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '798ba210-0c9c-11f1-b5e7-024264a6e162:1-315';

--
-- Table structure for table `CommissionRecord`
--

DROP TABLE IF EXISTS `CommissionRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommissionRecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `saleLogId` int DEFAULT NULL,
  `paymentId` int NOT NULL,
  `stage` enum('CHANCE','CALL','TOUCH','DEAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `baseAmount` decimal(10,2) NOT NULL,
  `rate` decimal(5,4) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `quarter` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `CommissionRecord_userId_fkey` (`userId`),
  KEY `CommissionRecord_saleLogId_fkey` (`saleLogId`),
  KEY `CommissionRecord_paymentId_fkey` (`paymentId`),
  CONSTRAINT `CommissionRecord_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CommissionRecord_saleLogId_fkey` FOREIGN KEY (`saleLogId`) REFERENCES `SaleLog` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CommissionRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CommissionRecord`
--

LOCK TABLES `CommissionRecord` WRITE;
/*!40000 ALTER TABLE `CommissionRecord` DISABLE KEYS */;
INSERT INTO `CommissionRecord` VALUES (6,1,4,2,'CHANCE',11000.00,0.0100,110.00,'2026-Q1','PENDING','2026-02-20 08:13:53.405','2026-02-20 08:13:53.405',NULL),(7,1,6,2,'DEAL',11000.00,0.0100,110.00,'2026-Q1','PENDING','2026-02-20 08:13:53.422','2026-02-20 08:13:53.422',NULL),(8,24,10,3,'CHANCE',11000.00,0.0100,110.00,'2026-Q1','CONFIRMED','2026-02-21 03:39:12.894','2026-02-21 03:53:25.732',NULL),(9,24,11,3,'CALL',11000.00,0.0200,220.00,'2026-Q1','CONFIRMED','2026-02-21 03:39:12.907','2026-02-21 03:53:25.732',NULL),(10,24,12,3,'TOUCH',11000.00,0.0200,220.00,'2026-Q1','CONFIRMED','2026-02-21 03:39:12.929','2026-02-21 03:53:25.732',NULL),(11,24,13,3,'DEAL',11000.00,0.0200,220.00,'2026-Q1','APPROVED','2026-02-21 03:39:12.947','2026-02-21 04:30:19.928',NULL);
/*!40000 ALTER TABLE `CommissionRecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contract`
--

DROP TABLE IF EXISTS `Contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contract` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `signedAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Contract_customerId_fkey` (`customerId`),
  CONSTRAINT `Contract_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contract`
--

LOCK TABLES `Contract` WRITE;
/*!40000 ALTER TABLE `Contract` DISABLE KEYS */;
INSERT INTO `Contract` VALUES (1,1,100000.00,'2026-02-18 11:08:51.687','2026-02-18 11:08:51.688','2026-02-18 11:08:51.688'),(2,3,10000.00,'2026-02-20 08:06:50.121','2026-02-20 08:06:50.122','2026-02-20 08:06:50.122'),(3,3,11000.00,'2026-02-20 08:13:53.360','2026-02-20 08:13:53.362','2026-02-20 08:13:53.362'),(4,2,11000.00,'2026-02-21 03:39:12.856','2026-02-21 03:39:12.857','2026-02-21 03:39:12.857');
/*!40000 ALTER TABLE `Contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customer`
--

DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('LEAD','CHANCE','CALL','TOUCH','PENDING','DEAL','CHURNED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'LEAD',
  `sourceId` int NOT NULL,
  `ownerId` int DEFAULT NULL,
  `isInPool` tinyint(1) NOT NULL DEFAULT '0',
  `poolReason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastContactAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `dealAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Customer_phone_key` (`phone`),
  KEY `Customer_sourceId_fkey` (`sourceId`),
  KEY `Customer_ownerId_fkey` (`ownerId`),
  CONSTRAINT `Customer_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Customer_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `LeadSource` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customer`
--

LOCK TABLES `Customer` WRITE;
/*!40000 ALTER TABLE `Customer` DISABLE KEYS */;
INSERT INTO `Customer` VALUES (1,'张三科技','13600000003','张三科技有限公司','CHANCE',1,46,0,NULL,'2026-02-18 10:58:28.981',NULL,'2026-02-18 10:58:28.981','2026-02-21 04:42:42.173'),(2,'李四','13500132001',NULL,'DEAL',3,24,0,NULL,'2026-02-21 03:39:12.972','2026-02-21 03:39:12.959','2026-02-20 07:24:32.973','2026-02-21 03:39:12.974'),(3,'陈思','13500121201',NULL,'TOUCH',3,1,0,NULL,'2026-02-20 08:19:39.695','2026-02-20 08:13:53.441','2026-02-20 07:59:44.383','2026-02-20 08:19:39.696');
/*!40000 ALTER TABLE `Customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Department`
--

DROP TABLE IF EXISTS `Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentId` int DEFAULT NULL,
  `managerId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Department_parentId_fkey` (`parentId`),
  KEY `Department_managerId_fkey` (`managerId`),
  CONSTRAINT `Department_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Department_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Department`
--

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;
INSERT INTO `Department` VALUES (1,'总公司',NULL,NULL,'2026-02-18 10:58:20.556','2026-02-18 10:58:20.556'),(4,'财务部',NULL,NULL,'2026-02-18 10:58:20.556','2026-02-20 03:33:55.921'),(5,'人事部',NULL,NULL,'2026-02-18 10:58:20.556','2026-02-20 03:33:55.946'),(6,'市场营销部',NULL,NULL,'2026-02-20 01:23:06.922','2026-02-20 01:23:06.922'),(7,'网络运营部',NULL,NULL,'2026-02-20 01:23:15.233','2026-02-20 01:23:15.233'),(8,'总公司',NULL,NULL,'2026-02-21 03:04:49.181','2026-02-21 03:04:49.181'),(11,'财务部',8,NULL,'2026-02-21 03:04:49.181','2026-02-21 03:04:49.181'),(12,'人事部',8,NULL,'2026-02-21 03:04:49.181','2026-02-21 03:04:49.181'),(15,'财务部',1,NULL,'2026-02-21 03:06:32.117','2026-02-21 03:06:32.117'),(16,'人事部',1,NULL,'2026-02-21 03:06:32.133','2026-02-21 03:06:32.133');
/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LeadSource`
--

DROP TABLE IF EXISTS `LeadSource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LeadSource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('COMPANY','INDIVIDUAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `points` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LeadSource`
--

LOCK TABLES `LeadSource` WRITE;
/*!40000 ALTER TABLE `LeadSource` DISABLE KEYS */;
INSERT INTO `LeadSource` VALUES (1,'公司官网','COMPANY',1,'2026-02-18 10:58:28.946','2026-02-18 10:58:28.946',0.00,0.00),(3,'91','COMPANY',1,'2026-02-20 03:27:49.097','2026-02-20 03:27:49.097',0.00,15.00),(4,'公司官网','COMPANY',1,'2026-02-21 03:04:49.322','2026-02-21 03:04:49.322',0.00,0.00),(5,'个人陌拜','INDIVIDUAL',1,'2026-02-21 03:04:49.346','2026-02-21 03:04:49.346',0.00,0.00);
/*!40000 ALTER TABLE `LeadSource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contractId` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paidAt` datetime(3) NOT NULL,
  `recorderId` int NOT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `approvedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Payment_contractId_fkey` (`contractId`),
  KEY `Payment_recorderId_fkey` (`recorderId`),
  CONSTRAINT `Payment_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Payment_recorderId_fkey` FOREIGN KEY (`recorderId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
INSERT INTO `Payment` VALUES (1,1,50000.00,'2026-02-18 11:08:51.701',1,1,'2026-02-18 11:08:51.728','2026-02-18 11:08:51.703','2026-02-20 07:07:25.261'),(2,3,11000.00,'2026-02-20 08:13:53.374',1,1,NULL,'2026-02-20 08:13:53.376','2026-02-20 08:13:53.376'),(3,4,11000.00,'2026-02-21 03:39:12.872',24,1,'2026-02-21 03:53:25.704','2026-02-21 03:39:12.873','2026-02-21 03:53:25.705');
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SaleLog`
--

DROP TABLE IF EXISTS `SaleLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SaleLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `actorId` int NOT NULL,
  `stage` enum('CHANCE','CALL','TOUCH','DEAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `occurredAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `isEffective` tinyint(1) NOT NULL DEFAULT '1',
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `SaleLog_customerId_fkey` (`customerId`),
  KEY `SaleLog_actorId_fkey` (`actorId`),
  CONSTRAINT `SaleLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `SaleLog_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SaleLog`
--

LOCK TABLES `SaleLog` WRITE;
/*!40000 ALTER TABLE `SaleLog` DISABLE KEYS */;
INSERT INTO `SaleLog` VALUES (3,2,1,'CHANCE','2026-02-20 07:24:32.973',1,'Lead Created','2026-02-20 07:24:32.973'),(4,3,1,'CHANCE','2026-02-20 07:59:44.383',1,'Lead Created','2026-02-20 07:59:44.383'),(5,3,1,'DEAL','2026-02-20 08:06:50.099',1,'客户非常有兴趣，当天签约','2026-02-20 08:06:50.099'),(6,3,1,'DEAL','2026-02-20 08:13:53.329',1,'客户很有兴趣\n','2026-02-20 08:13:53.329'),(7,3,1,'CHANCE','2026-02-20 08:19:28.576',1,'‘十分乐观 的过分分','2026-02-20 08:19:28.576'),(8,3,1,'CALL','2026-02-20 08:19:34.664',1,'地方怪怪的我二人','2026-02-20 08:19:34.664'),(9,3,1,'TOUCH','2026-02-20 08:19:39.655',1,'啊阿道夫全额二二','2026-02-20 08:19:39.655'),(10,2,24,'CHANCE','2026-02-21 03:38:40.667',1,'客户兴趣一般，还不错','2026-02-21 03:38:40.667'),(11,2,24,'CALL','2026-02-21 03:38:51.315',1,'同意接触','2026-02-21 03:38:51.315'),(12,2,24,'TOUCH','2026-02-21 03:39:01.427',1,'完成接待，客户也灭有什么问题','2026-02-21 03:39:01.427'),(13,2,24,'DEAL','2026-02-21 03:39:12.829',1,'中型超视距','2026-02-21 03:39:12.829');
/*!40000 ALTER TABLE `SaleLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SalesTarget`
--

DROP TABLE IF EXISTS `SalesTarget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SalesTarget` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `month` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SalesTarget_userId_month_key` (`userId`,`month`),
  CONSTRAINT `SalesTarget_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SalesTarget`
--

LOCK TABLES `SalesTarget` WRITE;
/*!40000 ALTER TABLE `SalesTarget` DISABLE KEYS */;
INSERT INTO `SalesTarget` VALUES (1,4,'2026-03',100000.00,'2026-02-20 07:52:47.146','2026-02-20 07:52:47.146'),(2,4,'2026-01',100000.00,'2026-02-20 07:52:47.145','2026-02-20 07:52:47.145'),(3,4,'2026-02',100000.00,'2026-02-20 07:52:47.145','2026-02-20 07:52:47.145'),(4,24,'2026-01',100000.00,'2026-02-20 07:52:56.507','2026-02-20 07:52:56.507'),(5,24,'2026-02',100000.00,'2026-02-20 07:52:56.513','2026-02-20 07:52:56.513'),(6,24,'2026-03',100000.00,'2026-02-20 07:52:56.514','2026-02-20 07:52:56.514'),(7,25,'2026-01',100000.00,'2026-02-20 07:53:01.096','2026-02-20 07:53:01.096'),(8,25,'2026-02',100000.00,'2026-02-20 07:53:01.096','2026-02-20 07:53:01.096'),(9,25,'2026-03',100000.00,'2026-02-20 07:53:01.098','2026-02-20 07:53:01.098'),(10,26,'2026-01',50000.00,'2026-02-20 07:53:10.105','2026-02-20 07:53:10.105'),(11,26,'2026-02',50000.00,'2026-02-20 07:53:10.105','2026-02-20 07:53:10.105'),(12,26,'2026-03',50000.00,'2026-02-20 07:53:10.106','2026-02-20 07:53:10.106'),(13,27,'2026-01',30000.00,'2026-02-20 07:53:18.846','2026-02-20 07:53:18.846'),(14,27,'2026-02',30000.00,'2026-02-20 07:53:18.846','2026-02-20 07:53:18.846'),(15,27,'2026-03',30000.00,'2026-02-20 07:53:18.847','2026-02-20 07:53:18.847'),(16,28,'2026-01',30000.00,'2026-02-20 07:53:23.233','2026-02-20 07:53:23.233'),(17,28,'2026-02',30000.00,'2026-02-20 07:53:23.234','2026-02-20 07:53:23.234'),(18,28,'2026-03',30000.00,'2026-02-20 07:53:23.234','2026-02-20 07:53:23.234');
/*!40000 ALTER TABLE `SalesTarget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','MANAGER','SUPERVISOR','EMPLOYEE','FINANCE','HR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PROBATION','REGULAR','TERMINATED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PROBATION',
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `departmentId` int DEFAULT NULL,
  `supervisorId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_phone_key` (`phone`),
  KEY `User_departmentId_fkey` (`departmentId`),
  KEY `User_supervisorId_fkey` (`supervisorId`),
  CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `User_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'13801979305','123456','邱彤亮','13801979305','ADMIN','REGULAR','2026-02-18 10:58:28.875',1,NULL,'2026-02-18 10:58:28.875','2026-02-21 03:19:02.626'),(4,'13700137000','123456','施琦','13700137000','MANAGER','REGULAR','2026-02-20 03:29:23.913',6,1,'2026-02-20 03:29:23.913','2026-02-21 04:42:41.966'),(24,'13600136000','123456','罗秋雪','13600136000','SUPERVISOR','REGULAR','2026-02-20 07:19:55.019',6,4,'2026-02-20 07:19:55.019','2026-02-21 03:19:02.686'),(25,'13500135000','123456','李旺','13500135000','SUPERVISOR','REGULAR','2026-02-20 07:20:22.234',6,4,'2026-02-20 07:20:22.234','2026-02-21 03:19:02.705'),(26,'13400134000','123456','田静','13400134000','MANAGER','REGULAR','2026-02-20 07:21:06.396',7,1,'2026-02-20 07:21:06.396','2026-02-21 04:42:41.981'),(27,'13100131000','123456','何静雯','13100131000','EMPLOYEE','REGULAR','2026-02-20 07:22:28.420',7,26,'2026-02-20 07:22:28.420','2026-02-21 03:19:02.741'),(28,'13200132000','123456','钱俊杰','13200132000','EMPLOYEE','REGULAR','2026-02-20 07:22:51.118',6,24,'2026-02-20 07:22:51.118','2026-02-21 03:19:02.756'),(29,'13900139000','123456','杨才郎吉','13900139000','HR','REGULAR','2026-02-20 07:23:17.150',5,1,'2026-02-20 07:23:17.150','2026-02-21 03:19:02.772'),(30,'13900139001','123456','顾星月','13900139001','FINANCE','REGULAR','2026-02-20 07:23:49.653',4,1,'2026-02-20 07:23:49.653','2026-02-21 03:19:02.787'),(36,'admin','password123','超级管理员','13800000000','ADMIN','REGULAR','2026-02-21 03:43:09.279',1,NULL,'2026-02-21 03:43:09.279','2026-02-21 03:43:09.279'),(42,'13900139002','password123','市场专员A','13900139002','EMPLOYEE','REGULAR','2026-02-21 04:42:41.998',NULL,4,'2026-02-21 04:42:41.998','2026-02-21 04:42:41.998'),(43,'13900139003','password123','网络专员A','13900139003','EMPLOYEE','REGULAR','2026-02-21 04:42:42.018',NULL,26,'2026-02-21 04:42:42.018','2026-02-21 04:42:42.018'),(44,'manager1','password123','王经理','13900000001','MANAGER','REGULAR','2026-02-21 04:42:42.033',NULL,NULL,'2026-02-21 04:42:42.033','2026-02-21 04:42:42.033'),(45,'supervisor1','password123','赵主管','13500000004','SUPERVISOR','REGULAR','2026-02-21 04:42:42.069',NULL,44,'2026-02-21 04:42:42.069','2026-02-21 04:42:42.069'),(46,'sales1','password123','李销售','13700000002','EMPLOYEE','REGULAR','2026-02-21 04:42:42.095',NULL,45,'2026-02-21 04:42:42.095','2026-02-21 04:42:42.095'),(47,'finance1','password123','钱财务','13400000005','FINANCE','REGULAR','2026-02-21 04:42:42.127',15,NULL,'2026-02-21 04:42:42.127','2026-02-21 04:42:42.127'),(48,'hr1','password123','孙人事','13300000006','HR','REGULAR','2026-02-21 04:42:42.145',16,NULL,'2026-02-21 04:42:42.145','2026-02-21 04:42:42.145');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('02a3e4d4-c596-4f3e-8f74-c308f83bc842','1530f0680874eaefc108d5f075c249ff280404cf41dfa35908ee528dea8e059f','2026-02-18 07:51:19.388','20260218075113_init',NULL,NULL,'2026-02-18 07:51:13.260',1),('0a00a013-0ef3-4d26-9f1b-442589570141','a6ece6a188939d46072b13ca87723abc16eca94405c97a7232bc7deee5b1ba54','2026-02-19 02:02:31.653','20260219020230_add_sales_target',NULL,NULL,'2026-02-19 02:02:30.846',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-22  1:53:22
