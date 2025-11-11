# Formateur Dropdown Debug Guide

## 🐛 Issues Fixed

### ✅ Issue 1: Redirect to Logout After Creation
**Problem:** `window.location.reload()` was causing the app to reload and lose authentication  
**Solution:** Removed `window.location.reload()` and use `this.loadFormations()` instead

### ✅ Issue 2: Username Not Showing in Dropdown
**Possible Causes:**
1. Keycloak service not returning users
2. User management service not running
3. Username field is empty in Keycloak

---

## 🔍 Debug Steps for Dropdown Issue

### Step 1: Open Browser Console
Press `F12` in your browser and go to the **Console** tab

### Step 2: Check Console Logs
Look for these messages when the page loads:

**Expected (Success):**
```
Loaded formateurs from Keycloak for dropdown: [{...}]
Formateurs available for selection: [{id: "...", username: "...", ...}]
```

**If you see this (Failure):**
```
Failed to load formateurs from Keycloak, falling back to local service: {...}
```

---

## 🧪 Test User Management Service

### Test 1: Check if Service is Running
```bash
curl http://localhost:8089/api/admin/keycloak/users?role=formateur
```

**Expected Response:**
```json
[
  {
    "id": "c780e2e4-90f3-44fa-9a84-0acc68736a06",
    "username": "john_formateur",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
]
```

### Test 2: Check Through Gateway
```bash
curl http://localhost:9095/user-management/api/admin/keycloak/users?role=formateur
```

---

## 🔧 Possible Fixes

### Fix 1: User Management Service Not Running

**Start the service:**
```bash
cd c:\Users\m2l3k\Desktop\gestion-user
docker-compose up -d
```

**Verify it's running:**
```bash
docker ps
curl http://localhost:8089/api/admin/keycloak/users?role=formateur
```

---

### Fix 2: No Users with 'formateur' Role in Keycloak

**Check Keycloak:**
1. Open: `http://localhost:8080` (Keycloak admin)
2. Login with admin credentials
3. Go to: **Users** → Check if users exist
4. Select a user → **Role Mappings** → Ensure 'formateur' role is assigned

**Create a test formateur via API:**
```bash
curl -X POST http://localhost:8089/api/admin/keycloak/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_formateur",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "Formateur",
    "temporaryPassword": "password123",
    "role": "formateur"
  }'
```

---

### Fix 3: CORS Blocking the Request

**Check Network Tab in Browser:**
1. Press `F12` → **Network** tab
2. Reload the page
3. Look for request to `/user-management/api/admin/keycloak/users?role=formateur`
4. Check if it's **200 OK** or **CORS error**

**If CORS error:** Gateway CORS should already be fixed, but verify Gateway is running

---

### Fix 4: Frontend Not Calling the Right URL

**Check the request URL in Network tab:**

**Should be:**
```
http://localhost:9095/user-management/api/admin/keycloak/users?role=formateur
```

**If it's calling localhost:8089 directly:** Check `keycloak-admin.service.ts` configuration

---

## 📋 Checklist

- [ ] User management service is running (docker-compose up)
- [ ] Gateway is running and routing correctly
- [ ] At least one user with 'formateur' role exists in Keycloak
- [ ] Browser console shows formateurs loaded successfully
- [ ] Network tab shows successful API call (200 OK)
- [ ] Dropdown shows usernames

---

## 🎯 Quick Test in Browser Console

Open browser console on the formation page and run:

```javascript
// Check if formateurs array is populated
console.log('Formateurs:', this.formateurs);

// Check selected formateur
console.log('Selected Formateur:', this.selectedFormateur);
```

---

## 📊 Expected vs Actual

### Expected Behavior:
1. Page loads
2. `loadFormateurs()` is called
3. Keycloak service returns users with 'formateur' role
4. Dropdown shows usernames like "john_formateur", "jane_formateur"
5. User selects a formateur
6. Formation is created successfully
7. **No redirect to logout**
8. Modal closes and formations list refreshes

### If Dropdown is Empty:
- Check console for errors
- Verify user management service is running
- Ensure users with 'formateur' role exist
- Check Network tab for failed requests

---

## 🚀 Test After Fixes

### Test 1: Check Dropdown
1. Navigate to: `http://localhost:4200/admin/gestion-formation`
2. Click "Add Formation"
3. Check "Formateur" dropdown
4. **Should show:** List of formateur usernames

### Test 2: Create Formation
1. Select a formateur from dropdown
2. Fill in formation details
3. Click "Submit"
4. **Should:**
   - ✅ Show success message
   - ✅ Close modal
   - ✅ Refresh formations list
   - ✅ **NOT redirect to logout**

---

## 🔍 Debug Output

Add this to your component to see what's happening:

```typescript
loadFormateurs() {
  console.log('🔍 Starting to load formateurs...');
  
  this.keycloakAdminService.listUsersByRole('formateur').subscribe(
    (keycloakUsers: any[]) => {
      console.log('✅ Loaded from Keycloak:', keycloakUsers);
      console.log('📊 Number of formateurs:', keycloakUsers.length);
      
      this.formateurs = keycloakUsers.map((kUser: any) => {
        const mapped = {
          id: kUser.id || '',
          keycloakId: kUser.id || '',
          username: kUser.username || '',
          email: kUser.email || '',
          firstname: kUser.firstName || '',
          lastname: kUser.lastName || '',
          speciality: '',
          password: '',
          address: ''
        };
        console.log('👤 Mapped formateur:', mapped);
        return mapped;
      });
      
      console.log('✅ Final formateurs array:', this.formateurs);
    },
    (error: any) => {
      console.error('❌ Failed to load from Keycloak:', error);
      console.log('🔄 Falling back to local service...');
    }
  );
}
```

---

## ✅ Summary

**Fixed:**
- ✅ Removed `window.location.reload()` from create and update methods
- ✅ Proper form reset after creation
- ✅ No more logout redirect

**To Debug:**
1. Check browser console for errors
2. Verify user management service is running
3. Ensure formateurs exist in Keycloak
4. Check Network tab for API calls

**Next Steps:**
1. Restart frontend: `npm start`
2. Test dropdown shows usernames
3. Test creation doesn't redirect to logout
