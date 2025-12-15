{
	"info": {
		"_postman_id": "b5a74932-841c-4c80-9286-9909f257c91e",
		"name": "LNU Diary API",
		"description": "Колекція запитів для тестування веб-застосунку \"Електронний щоденник студента\".\nВключає методи для авторизації, роботи з завданнями та отримання оцінок.",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Auth",
			"item": [
				{
					"name": "Login (Student)",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/x-www-form-urlencoded",
								"type": "text"
							}
						],
						"body": {
							"mode": "urlencoded",
							"urlencoded": [
								{
									"key": "email",
									"value": "Valentyn.Morhulets@lnu.edu.ua",
									"description": "Ваш email з бази даних",
									"type": "text"
								},
								{
									"key": "password",
									"value": "12345",
									"description": "Ваш пароль",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "http://localhost:3001/auth/login",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3001",
							"path": [
								"auth",
								"login"
							]
						},
						"description": "Авторизація користувача. Необхідно виконати цей запит першим, щоб отримати сесійну куку (connect.sid) для наступних запитів."
					},
					"response": []
				}
			]
		},
		{
			"name": "Tasks (AJAX)",
			"item": [
				{
					"name": "Add Task (Success)",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"text\": \"Підготувати звіт до курсової\",\n    \"deadline\": \"2025-12-31T12:00\"\n}"
						},
						"url": {
							"raw": "http://localhost:3001/tasks/add",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3001",
							"path": [
								"tasks",
								"add"
							]
						},
						"description": "Додавання нового завдання. Повертає JSON з даними створеного таска."
					},
					"response": []
				},
				{
					"name": "Add Task (Error - Past Date)",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"text\": \"Завдання з минулого\",\n    \"deadline\": \"2020-01-01T10:00\"\n}"
						},
						"url": {
							"raw": "http://localhost:3001/tasks/add",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3001",
							"path": [
								"tasks",
								"add"
							]
						},
						"description": "Спроба додати завдання з датою у минулому. Очікується помилка 400."
					},
					"response": []
				},
				{
					"name": "Delete Task",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"id\": 1\n}"
						},
						"url": {
							"raw": "http://localhost:3001/tasks/delete",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3001",
							"path": [
								"tasks",
								"delete"
							]
						},
						"description": "Видалення завдання за ID. Замініть ID на існуючий у вашій базі."
					},
					"response": []
				}
			]
		},
		{
			"name": "Grades (API)",
			"item": [
				{
					"name": "Get All Grades (Summary)",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3001/api/grades?subject_id=all",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3001",
							"path": [
								"api",
								"grades"
							],
							"query": [
								{
									"key": "subject_id",
									"value": "all"
								}
							]
						},
						"description": "Отримання зведеної таблиці оцінок по всіх предметах."
					},
					"response": []
				},
				{
					"name": "Get Subject Details",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3001/api/grades?subject_id=1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3001",
							"path": [
								"api",
								"grades"
							],
							"query": [
								{
									"key": "subject_id",
									"value": "1"
								}
							]
						},
						"description": "Отримання детальних оцінок (лабораторні, модулі) для конкретного предмета (наприклад, ID=1)."
					},
					"response": []
				}
			]
		}
	],
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		}
	]
}