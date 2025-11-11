# FormationMS Postman Tests

## 🧪 Test Formation Creation

### Test 1: Create Formation (Through Gateway)

**Method:** `POST`  
**URL:** `http://localhost:9095/FormationMS/formation/add/formateur/c780e2e4-90f3-44fa-9a84-0acc68736a06`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Angular Advanced Course",
  "content": "Learn advanced Angular concepts including RxJS, NgRx, and performance optimization",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "videoLink": "https://youtube.com/watch?v=example",
  "duration": "40 hours",
  "date": "2025-12-01",
  "prix": 299.99
}
```

**Expected Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Angular Advanced Course",
  "content": "Learn advanced Angular concepts including RxJS, NgRx, and performance optimization",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "videoLink": "https://youtube.com/watch?v=example",
  "duration": "40 hours",
  "date": "2025-12-01",
  "prix": 299.99,
  "keycloakFormateurId": "c780e2e4-90f3-44fa-9a84-0acc68736a06"
}
```

---

### Test 2: Create Formation (Direct to Service)

**Method:** `POST`  
**URL:** `http://localhost:8081/formation/add/formateur/c780e2e4-90f3-44fa-9a84-0acc68736a06`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Spring Boot Microservices",
  "content": "Build scalable microservices with Spring Boot and Spring Cloud",
  "meetingLink": "https://zoom.us/j/123456789",
  "videoLink": "https://youtube.com/watch?v=spring",
  "duration": "50 hours",
  "date": "2025-11-20",
  "prix": 399.99
}
```

**Expected Response:** `201 Created`

---

### Test 3: Create Formation with ID=-1 (Frontend Scenario)

**Method:** `POST`  
**URL:** `http://localhost:9095/FormationMS/formation/add/formateur/c780e2e4-90f3-44fa-9a84-0acc68736a06`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id": -1,
  "title": "React Fundamentals",
  "content": "Learn React from scratch",
  "meetingLink": "https://meet.google.com/react-class",
  "videoLink": "https://youtube.com/watch?v=react",
  "duration": "30 hours",
  "date": "2025-11-15",
  "prix": 199.99
}
```

**Expected Response:** `201 Created`  
**Note:** Backend now ignores `id: -1` and creates new entity

---

## 📋 Test Get All Formations

### Test 4: Get All Formations (Through Gateway)

**Method:** `GET`  
**URL:** `http://localhost:9095/FormationMS/formation/all`

**Expected Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Angular Advanced Course",
    "content": "Learn advanced Angular concepts...",
    "keycloakFormateurId": "c780e2e4-90f3-44fa-9a84-0acc68736a06",
    ...
  },
  {
    "id": 2,
    "title": "Spring Boot Microservices",
    ...
  }
]
```

---

### Test 5: Get All Formations (Direct)

**Method:** `GET`  
**URL:** `http://localhost:8081/formation/all`

**Expected Response:** `200 OK`

---

## 🔍 Test Get Formation by ID

### Test 6: Get Formation by ID (Through Gateway)

**Method:** `GET`  
**URL:** `http://localhost:9095/FormationMS/formation/get/1`

**Expected Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Angular Advanced Course",
  "content": "Learn advanced Angular concepts...",
  "keycloakFormateurId": "c780e2e4-90f3-44fa-9a84-0acc68736a06",
  ...
}
```

---

## 🔄 Test Update Formation

### Test 7: Update Formation (Through Gateway)

**Method:** `PUT`  
**URL:** `http://localhost:9095/FormationMS/formation/update/1/formateur/c780e2e4-90f3-44fa-9a84-0acc68736a06`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Angular Advanced Course - Updated",
  "content": "Updated content with new modules",
  "meetingLink": "https://meet.google.com/new-link",
  "videoLink": "https://youtube.com/watch?v=updated",
  "duration": "45 hours",
  "date": "2025-12-15",
  "prix": 349.99
}
```

**Expected Response:** `200 OK`

---

## 🗑️ Test Delete Formation

### Test 8: Delete Formation (Through Gateway)

**Method:** `DELETE`  
**URL:** `http://localhost:9095/FormationMS/formation/delete/1`

**Expected Response:** `200 OK`

---

## 👨‍🏫 Test Get Formations by Formateur

### Test 9: Get Formations by Formateur (Through Gateway)

**Method:** `GET`  
**URL:** `http://localhost:9095/FormationMS/formation/formateur/c780e2e4-90f3-44fa-9a84-0acc68736a06`

**Expected Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Angular Advanced Course",
    "keycloakFormateurId": "c780e2e4-90f3-44fa-9a84-0acc68736a06",
    ...
  }
]
```

---

## 🔧 Troubleshooting Tests

### Test 10: Invalid Keycloak ID

**Method:** `POST`  
**URL:** `http://localhost:9095/FormationMS/formation/add/formateur/invalid-uuid`

**Body:**
```json
{
  "title": "Test Formation",
  "content": "Test content",
  "duration": "10 hours",
  "date": "2025-11-20",
  "prix": 99.99
}
```

**Expected Response:** `201 Created` (lenient validation)  
**Backend Logs:** Warning about unable to verify formateur

---

### Test 11: Missing Required Fields

**Method:** `POST`  
**URL:** `http://localhost:9095/FormationMS/formation/add/formateur/c780e2e4-90f3-44fa-9a84-0acc68736a06`

**Body:**
```json
{
  "title": "Test Formation"
}
```

**Expected Response:** `201 Created` (fields are optional in entity)

---

## 📊 Test Results Checklist

- [ ] Test 1: Create through Gateway - `201 Created`
- [ ] Test 2: Create direct to service - `201 Created`
- [ ] Test 3: Create with id=-1 - `201 Created` (ID ignored)
- [ ] Test 4: Get all through Gateway - `200 OK`
- [ ] Test 5: Get all direct - `200 OK`
- [ ] Test 6: Get by ID - `200 OK`
- [ ] Test 7: Update formation - `200 OK`
- [ ] Test 8: Delete formation - `200 OK`
- [ ] Test 9: Get by formateur - `200 OK`
- [ ] Test 10: Invalid UUID - `201 Created` with warning
- [ ] Test 11: Missing fields - `201 Created`

---

## 🎯 Key Points

1. **Gateway URL:** `http://localhost:9095/FormationMS/...`
2. **Direct URL:** `http://localhost:8081/formation/...`
3. **Keycloak UUID:** `c780e2e4-90f3-44fa-9a84-0acc68736a06`
4. **ID Handling:** Backend ignores `id: -1` from frontend
5. **Validation:** Lenient - logs warnings but allows creation

---

## 🚀 Quick Test Command (cURL)

### Create Formation via Gateway:
```bash
curl -X POST http://localhost:9095/FormationMS/formation/add/formateur/c780e2e4-90f3-44fa-9a84-0acc68736a06 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Formation",
    "content": "Test content",
    "duration": "20 hours",
    "date": "2025-12-01",
    "prix": 199.99
  }'
```

### Get All Formations:
```bash
curl http://localhost:9095/FormationMS/formation/all
```

---

**Use these tests to verify if the issue is in backend or frontend!** 🧪
