-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: student_diary
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `category` enum('lab','module','exam','coursework','zbp') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `score` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=273 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (199,1,1,'lab','Лаб 1',3),(200,1,1,'lab','Лаб 2',3),(201,1,1,'lab','Лаб 3',3),(202,1,1,'lab','Лаб 4',3),(203,1,1,'lab','Лаб 5',3),(204,1,1,'lab','Лаб 6',3),(205,1,1,'lab','Лаб 7',3),(206,1,1,'lab','Лаб 8',3),(207,1,1,'lab','Лаб 9',3),(208,1,1,'lab','Лаб 10',3),(209,1,1,'lab','Лаб 11',3),(210,1,1,'lab','Лаб 12',3),(211,1,1,'module','Модуль 1',12),(212,1,1,'module','Модуль 2',12),(213,1,1,'exam','Екзамен',30),(214,1,2,'lab','Лаб 1',3),(215,1,2,'lab','Лаб 2',3),(216,1,2,'lab','Лаб 3',3),(217,1,2,'lab','Лаб 4',3),(218,1,2,'lab','Лаб 5',3),(219,1,2,'lab','Лаб 6',3),(220,1,2,'lab','Лаб 7',3),(221,1,2,'module','Модуль 1',9),(222,1,2,'module','Модуль 2',10),(223,1,2,'exam','Екзамен',35),(224,1,3,'lab','Лаб 1',4),(225,1,3,'lab','Лаб 2',4),(226,1,3,'lab','Лаб 3',4),(227,1,3,'lab','Лаб 4',4),(228,1,3,'lab','Лаб 5',4),(229,1,3,'lab','Лаб 6',4),(230,1,3,'lab','Лаб 7',4),(231,1,3,'lab','Лаб 8',4),(232,1,3,'lab','Лаб 9',4),(233,1,3,'lab','Лаб 10',4),(234,1,3,'module','Модуль 1',21),(235,1,3,'module','Модуль 2',21),(236,1,4,'lab','Лаб 1',5),(237,1,4,'lab','Лаб 2',5),(238,1,4,'lab','Лаб 3',5),(239,1,4,'lab','Лаб 4',5),(240,1,4,'lab','Лаб 5',5),(241,1,4,'lab','Лаб 6',5),(242,1,4,'module','Модуль 1',17),(243,1,4,'module','Модуль 2',18),(244,1,5,'lab','Лаб 1',2),(245,1,5,'lab','Лаб 2',2),(246,1,5,'lab','Лаб 3',2),(247,1,5,'lab','Лаб 4',2),(248,1,5,'lab','Лаб 5',2),(249,1,5,'lab','Лаб 6',2),(250,1,5,'lab','Лаб 7',2),(251,1,5,'lab','Лаб 8',2),(252,1,5,'lab','Лаб 9',2),(253,1,5,'lab','Лаб 10',2),(254,1,5,'lab','Лаб 11',2),(255,1,5,'lab','Лаб 12',2),(256,1,5,'module','Модуль 1',15),(257,1,5,'module','Модуль 2',16),(258,1,6,'lab','Лаб 1',3),(259,1,6,'lab','Лаб 2',3),(260,1,6,'lab','Лаб 3',3),(261,1,6,'lab','Лаб 4',3),(262,1,6,'lab','Лаб 5',3),(263,1,6,'lab','Лаб 6',3),(264,1,6,'lab','Лаб 7',3),(265,1,6,'lab','Лаб 8',3),(266,1,6,'lab','Лаб 9',3),(267,1,6,'lab','Лаб 10',3),(268,1,6,'module','Модуль 1',10),(269,1,6,'module','Модуль 2',10),(270,1,6,'exam','Екзамен',21),(271,1,7,'coursework','Курсова',0),(272,1,8,'zbp','Залік',0);
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subgroup` int DEFAULT NULL,
  `day_name` varchar(20) DEFAULT NULL,
  `lesson_num` int DEFAULT NULL,
  `time_start` varchar(10) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (45,1,'Понеділок',1,'08:30','Операційні системи (Лаб)','N10/Б'),(46,1,'Понеділок',2,'10:10','Іноземна мова (ПрС)','-'),(47,1,'Понеділок',3,'11:50','Операційні системи (Л)','1/Б'),(48,1,'Вівторок',1,'08:30','Веб програмування на стороні сервера (Лаб)','N11/Б'),(49,1,'Вівторок',2,'10:10','Організація баз даних та знань (Лаб)','№9/Б'),(50,1,'Середа',3,'11:50','Організація баз даних та знань (Л)','1/Б'),(51,1,'Середа',4,'13:30','Іноземна мова (ПрС)','-'),(52,1,'Середа',5,'15:05','Чисельні методи (Л)','1/Б'),(53,1,'Середа',6,'16:40','Фізичне виховання / БЗВП','Спорткомплекс'),(54,1,'Четвер',3,'11:50','Чисельні методи (Лаб)','№5/Б'),(55,1,'Четвер',4,'13:30','Основи оптоелектроніки (Л)','2/Б'),(56,1,'П\'ятниця',1,'08:30','Основи оптоелектроніки (Лаб)','218/Т'),(57,1,'П\'ятниця',2,'10:10','Веб програмування на стороні сервера (Л)','2/Б'),(58,2,'Понеділок',2,'10:10','Іноземна мова (ПрС)','-'),(59,2,'Понеділок',3,'11:50','Операційні системи (Л)','1/Б'),(60,2,'Вівторок',1,'08:30','Організація баз даних та знань (Лаб)','№8/Б'),(61,2,'Вівторок',2,'10:10','Веб програмування на стороні сервера (Лаб)','N11/Б'),(62,2,'Середа',3,'11:50','Організація баз даних та знань (Л)','1/Б'),(63,2,'Середа',4,'13:30','Іноземна мова (ПрС)','-'),(64,2,'Середа',5,'15:05','Чисельні методи (Л)','1/Б'),(65,2,'Середа',6,'16:40','Фізичне виховання / БЗВП','Спорткомплекс'),(66,2,'Четвер',2,'10:10','Чисельні методи (Лаб)','№9/Б'),(67,2,'Четвер',3,'11:50','Основи оптоелектроніки (Лаб)','218/Т'),(68,2,'Четвер',4,'13:30','Основи оптоелектроніки (Л)','2/Б'),(69,2,'П\'ятниця',2,'10:10','Веб програмування на стороні сервера (Л)','2/Б'),(70,2,'П\'ятниця',5,'15:05','Операційні системи (Лаб)','№4/Т');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `has_exam` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'Чисельні методи',1),(2,'Веб програмування на стороні сервера',1),(3,'Основи оптоелектроніки',1),(4,'Основи Web-технологій',1),(5,'Операційні системи',1),(6,'Організація баз даних та знань',1),(7,'Курсова робота',1),(8,'Базова загальна військова підготовка',1);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `text` varchar(255) NOT NULL,
  `deadline` date DEFAULT NULL,
  `is_done` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` enum('student','admin') DEFAULT 'student',
  `subgroup` int DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Valentyn.Morhulets@lnu.edu.ua','12345','Валентин Моргулець','student',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15  1:28:21
