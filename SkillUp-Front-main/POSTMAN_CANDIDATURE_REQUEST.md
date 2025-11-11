# 📮 Postman Request - Submit Candidature

## ✅ Fixed Issue
Changed `keycloakUserId` → `keycloakFormateurId` to match backend expectation.

---

## 🔧 Postman Configuration

### Method & URL
```
POST http://localhost:9095/recrutementMS/candidatures
```

### Headers
```
Content-Type: multipart/form-data
```
*(Postman will set this automatically when you use form-data)*

### Body (form-data)

| KEY | VALUE | TYPE |
|-----|-------|------|
| `keycloakFormateurId` | `d31c9a0f-73ba-4368-99f9-5b16da5d4fbe` | Text |
| `motivation` | `Je suis très motivé pour rejoindre votre équipe...` | Text |
| `cv` | *[Select PDF file]* | File |

---

## 📋 Step-by-Step in Postman

### 1. Create New Request
- Click **"New"** → **"HTTP Request"**
- Name it: **"Submit Candidature"**

### 2. Set Method & URL
```
POST http://localhost:9095/recrutementMS/candidatures
```

### 3. Configure Body
- Go to **"Body"** tab
- Select **"form-data"**
- Add 3 rows:

#### Row 1:
- **Key:** `keycloakFormateurId`
- **Value:** `d31c9a0f-73ba-4368-99f9-5b16da5d4fbe`
- **Type:** Text

#### Row 2:
- **Key:** `motivation`
- **Value:** `Je suis très motivé pour cette formation`
- **Type:** Text

#### Row 3:
- **Key:** `cv`
- **Value:** *Click "Select Files" and choose a PDF*
- **Type:** File

### 4. Send Request
Click **"Send"** button

---

## ✅ Expected Response

### Success (200 OK)
```json
{
  "id": 1,
  "keycloakFormateurId": "d31c9a0f-73ba-4368-99f9-5b16da5d4fbe",
  "status": "PENDING",
  "motivation": "Je suis très motivé pour cette formation",
  "createdAt": "2025-11-11T20:51:44",
  "updatedAt": "2025-11-11T20:51:44",
  "cvPath": "/uploads/cv_1_20251111.pdf"
}
```

### Error (400 Bad Request)
```json
{
  "timestamp": "2025-11-11T20:51:44",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}
```

---

## 🔍 How to Get Keycloak ID

### Option 1: From API
```
GET http://localhost:8089/api/admin/keycloak/users?role=user
```

Response:
```json
[
  {
    "id": "d31c9a0f-73ba-4368-99f9-5b16da5d4fbe",
    "username": "aymen",
    "email": "aymen@gmail.com",
    "firstName": "aymen",
    "lastName": "aymen"
  }
]
```

### Option 2: From Browser Console
1. Login as user
2. Open console (F12)
3. Go to candidature form
4. Check console logs:
```
✅ Keycloak ID fetched for candidature: d31c9a0f-73ba-4368-99f9-5b16da5d4fbe
```

---

## 📝 cURL Command (Alternative)

```bash
curl --location 'http://localhost:9095/recrutementMS/candidatures' \
--form 'keycloakFormateurId="d31c9a0f-73ba-4368-99f9-5b16da5d4fbe"' \
--form 'motivation="Je suis très motivé pour cette formation"' \
--form 'cv=@"/path/to/your/cv.pdf"'
```

---

## 🎯 Backend Endpoint Details

### Controller Method
```java
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<CandidatureResponse> submitWithCv(
    @RequestParam String keycloakFormateurId,  // ← Required
    @RequestParam(required = false) String motivation,
    @RequestParam(name = "cv", required = false) MultipartFile cv
) {
    Candidature c = service.submitWithCv(keycloakFormateurId, motivation, cv);
    return ResponseEntity.ok(toResponse(c));
}
```

### Parameters
- **keycloakFormateurId** (String, Required): Keycloak UUID
- **motivation** (String, Optional): Motivation text
- **cv** (File, Optional): PDF file

---

## 🧪 Test Scenarios

### Test 1: With CV
```
keycloakFormateurId: d31c9a0f-73ba-4368-99f9-5b16da5d4fbe
motivation: Je suis motivé
cv: cv.pdf
```
**Expected:** 200 OK with candidature details

### Test 2: Without CV
```
keycloakFormateurId: d31c9a0f-73ba-4368-99f9-5b16da5d4fbe
motivation: Je suis motivé
```
**Expected:** 200 OK (CV is optional)

### Test 3: Without Motivation
```
keycloakFormateurId: d31c9a0f-73ba-4368-99f9-5b16da5d4fbe
cv: cv.pdf
```
**Expected:** 200 OK (motivation is optional)

### Test 4: Missing Keycloak ID
```
motivation: Je suis motivé
cv: cv.pdf
```
**Expected:** 400 Bad Request (keycloakFormateurId is required)

---

**Try the request in Postman now!** 🚀
