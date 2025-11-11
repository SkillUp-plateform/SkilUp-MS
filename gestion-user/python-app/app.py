import os
import time
import psycopg2
import psycopg2.extras
from flask import Flask, request, jsonify
from flask_cors import CORS
from keycloak import KeycloakAdmin, KeycloakOpenID
from keycloak.exceptions import KeycloakError
import logging
import py_eureka_client.eureka_client as eureka_client

# --- Configuration ---
# (This part is unchanged)
FLASK_PORT = 8089
KEYCLOAK_SERVER_URL = os.environ.get("KEYCLOAK_URL", "http://keycloak:8080/")
KEYCLOAK_REALM_NAME = os.environ.get("KEYCLOAK_REALM", "my-app-realm")
KEYCLOAK_CLIENT_ID = os.environ.get("KEYCLOAK_CLIENT_ID", "admin-cli")
KEYCLOAK_ADMIN_USER = os.environ.get("KEYCLOAK_ADMIN_USER", "admin")
KEYCLOAK_ADMIN_PASSWORD = os.environ.get("KEYCLOAK_ADMIN_PASSWORD", "admin")
POSTGRES_DB = os.environ.get("POSTGRES_DB", "keycloak_db")
POSTGRES_USER = os.environ.get("POSTGRES_USER", "keycloak")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "password")
POSTGRES_HOST = os.environ.get("POSTGRES_HOST", "postgres")

# Eureka Configuration
EUREKA_SERVER_URL = os.environ.get("EUREKA_SERVER_URL", "http://localhost:8761/eureka/")
APP_NAME = "user-management-service"
INSTANCE_HOST = os.environ.get("INSTANCE_HOST", "localhost")
INSTANCE_PORT = FLASK_PORT

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Initialization ---
# (This part is unchanged)
app = Flask(__name__)

# Enable CORS for Angular frontend - allow all methods including OPTIONS
CORS(app, 
     resources={
         r"/api/*": {
             "origins": ["http://localhost:4200"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"]
         },
         r"/users*": {
             "origins": ["http://localhost:4200"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"]
         }
     },
     supports_credentials=True)

def initialize_keycloak_admin():
    """Initializes the Keycloak Admin client with retry logic for startup."""
    for i in range(10):
        try:
            logger.info(f"Attempting to connect to Keycloak at {KEYCLOAK_SERVER_URL}")
            admin = KeycloakAdmin(
                server_url=KEYCLOAK_SERVER_URL,
                username=KEYCLOAK_ADMIN_USER,
                password=KEYCLOAK_ADMIN_PASSWORD,
                realm_name="master",
                client_id=KEYCLOAK_CLIENT_ID,
                verify=True
            )
            logger.info("Successfully connected to Keycloak Admin.")
            return admin
        except Exception as e:
            logger.error(f"Waiting for Keycloak... attempt {i+1}. Error: {e}")
            time.sleep(5)
    raise Exception("Could not connect to Keycloak after multiple retries.")

keycloak_admin = initialize_keycloak_admin()

def setup_keycloak_realm():
    """Sets up the Keycloak realm and roles if they don't exist."""
    try:
        logger.info(f"Setting up Keycloak realm: {KEYCLOAK_REALM_NAME}")
        
        # Check if realm exists
        try:
            keycloak_admin.get_realm(KEYCLOAK_REALM_NAME)
            logger.info(f"Realm {KEYCLOAK_REALM_NAME} already exists")
        except:
            # Create realm
            realm_payload = {
                "realm": KEYCLOAK_REALM_NAME,
                "enabled": True,
                "displayName": "My Application Realm"
            }
            keycloak_admin.create_realm(payload=realm_payload)
            logger.info(f"Created realm: {KEYCLOAK_REALM_NAME}")
        
        # Switch to the new realm for role management
        keycloak_admin.realm_name = KEYCLOAK_REALM_NAME
        
        # Define roles
        roles = ["admin", "user", "formateur"]
        existing_roles = keycloak_admin.get_realm_roles()
        existing_role_names = [role['name'] for role in existing_roles]
        
        for role_name in roles:
            if role_name not in existing_role_names:
                role_payload = {
                    "name": role_name,
                    "description": f"{role_name} role",
                    "composite": False,
                    "clientRole": False,
                    "containerId": KEYCLOAK_REALM_NAME
                }
                keycloak_admin.create_realm_role(payload=role_payload)
                logger.info(f"Created role: {role_name}")
            else:
                logger.info(f"Role {role_name} already exists")
        
        # Switch back to master realm
        keycloak_admin.realm_name = "master"
        logger.info("Keycloak setup completed successfully")
        
    except Exception as e:
        logger.error(f"Failed to setup Keycloak realm: {e}")
        raise

# Setup Keycloak realm and roles
setup_keycloak_realm()

def initialize_eureka_client():
    """Initialize and register with Eureka server."""
    try:
        logger.info(f"Registering with Eureka server at {EUREKA_SERVER_URL}")
        
        # For Docker: Use host.docker.internal or container IP for external access
        # For local: Use localhost
        instance_ip = INSTANCE_HOST
        
        eureka_client.init(
            eureka_server=EUREKA_SERVER_URL,
            app_name=APP_NAME,
            instance_port=INSTANCE_PORT,
            instance_host=instance_ip,
            instance_ip=instance_ip,
            # Health check endpoint - accessible from Eureka server
            health_check_url=f"http://{instance_ip}:{INSTANCE_PORT}/health",
            # Status page
            status_page_url=f"http://{instance_ip}:{INSTANCE_PORT}/health",
            # Home page
            home_page_url=f"http://{instance_ip}:{INSTANCE_PORT}/",
            # Renewal interval (heartbeat) - 30 seconds
            renewal_interval_in_secs=30,
            # Duration to wait before first heartbeat
            duration_in_secs=10
        )
        logger.info(f"Successfully registered '{APP_NAME}' with Eureka server at {instance_ip}:{INSTANCE_PORT}")
    except Exception as e:
        logger.error(f"Failed to register with Eureka: {e}")
        logger.warning("Application will continue without Eureka registration")

# Initialize Eureka client
initialize_eureka_client()

def get_db_connection():
    """Establishes a connection to the PostgreSQL database with retry logic."""
    for i in range(10):
        try:
            conn = psycopg2.connect(
                dbname=POSTGRES_DB, user=POSTGRES_USER, password=POSTGRES_PASSWORD, host=POSTGRES_HOST
            )
            print("Successfully connected to PostgreSQL.")
            return conn
        except psycopg2.OperationalError as e:
            print(f"Waiting for PostgreSQL... attempt {i+1}. Error: {e}")
            time.sleep(5)
    raise Exception("Could not connect to PostgreSQL after multiple retries.")

def init_db():
    """Initializes the database by creating the app_users table if it doesn't exist."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                keycloak_id VARCHAR(255) UNIQUE NOT NULL,
                full_name VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("Database table 'app_users' is ready.")
    except Exception as e:
        print(f"Failed to initialize database table: {e}")

# --- API Endpoints ---

@app.route('/api/admin/keycloak/users', methods=['GET'])
def list_users_by_role():
    """
    Lists all users with a specific realm role.
    Query param: role (e.g., 'user', 'formateur', 'admin')
    """
    if not keycloak_admin:
        return jsonify({"error": "Keycloak admin not initialized"}), 500
    
    role_name = request.args.get('role')
    if not role_name:
        return jsonify({"error": "Missing 'role' query parameter"}), 400
    
    try:
        # Switch to target realm
        keycloak_admin.realm_name = KEYCLOAK_REALM_NAME
        
        # Get users with the specified realm role
        role_members = keycloak_admin.get_realm_role_members(role_name=role_name)
        
        # Map to Angular-expected format
        users = []
        for user in role_members:
            users.append({
                "id": user.get("id"),
                "username": user.get("username"),
                "email": user.get("email"),
                "firstName": user.get("firstName", ""),
                "lastName": user.get("lastName", "")
            })
        
        # Switch back to master realm
        keycloak_admin.realm_name = "master"
        
        logger.info(f"Found {len(users)} users with role '{role_name}'")
        return jsonify(users), 200
        
    except Exception as e:
        keycloak_admin.realm_name = "master"
        logger.error(f"Failed to list users by role '{role_name}': {e}")
        return jsonify({"error": "Failed to list users", "details": str(e)}), 500

@app.route('/api/admin/keycloak/users', methods=['POST'])
def create_user_angular():
    """
    Creates a user in Keycloak with role assignment (Angular format).
    Expected body: {username, email, firstName, lastName, temporaryPassword, role}
    """
    if not keycloak_admin:
        return jsonify({"error": "Keycloak admin not initialized"}), 500
    
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    
    data = request.get_json()
    logger.info(f"Received Angular user creation request: {data}")
    
    # Validate required fields
    if not data.get('username') or not data.get('email') or not data.get('role'):
        return jsonify({"error": "Missing username, email, or role"}), 400
    
    user_id = None
    try:
        # Switch to target realm
        keycloak_admin.realm_name = KEYCLOAK_REALM_NAME
        
        # Create user payload
        new_user_payload = {
            "username": data['username'],
            "email": data['email'],
            "firstName": data.get('firstName', ''),
            "lastName": data.get('lastName', ''),
            "enabled": True,
            "emailVerified": True  # Mark email as verified to avoid account setup issues
        }
        
        # Add password if provided (set as permanent, not temporary)
        if data.get('temporaryPassword'):
            new_user_payload["credentials"] = [{
                "type": "password",
                "value": data['temporaryPassword'],
                "temporary": False  # Changed to False so users can login immediately
            }]
        
        logger.info(f"Creating user in realm: {KEYCLOAK_REALM_NAME}")
        user_id = keycloak_admin.create_user(new_user_payload, exist_ok=False)
        logger.info(f"User created successfully with ID: {user_id}")
        
        # Assign the specified role
        role_name = data['role']
        try:
            available_roles = keycloak_admin.get_realm_roles()
            role_found = next((role for role in available_roles if role['name'] == role_name), None)
            
            if role_found:
                keycloak_admin.assign_realm_roles(user_id=user_id, roles=[role_found])
                logger.info(f"Role '{role_name}' assigned successfully")
            else:
                logger.warning(f"Role '{role_name}' not found in realm {KEYCLOAK_REALM_NAME}")
                
        except Exception as role_error:
            logger.error(f"Error assigning role: {role_error}")
        
        # Switch back to master realm
        keycloak_admin.realm_name = "master"
        
        # Optionally store in local DB
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            full_name = f"{data.get('firstName', '')} {data.get('lastName', '')}".strip()
            cur.execute(
                "INSERT INTO app_users (keycloak_id, full_name) VALUES (%s, %s)",
                (user_id, full_name if full_name else None)
            )
            conn.commit()
            cur.close()
            conn.close()
        except Exception as db_error:
            logger.warning(f"Failed to store user in local DB: {db_error}")
        
        return jsonify({"message": "User created successfully", "id": user_id}), 201
        
    except Exception as e:
        logger.error(f"User creation failed: {type(e).__name__} - {e}")
        
        # Cleanup on failure
        keycloak_admin.realm_name = KEYCLOAK_REALM_NAME
        if user_id:
            try:
                keycloak_admin.delete_user(user_id=user_id)
                logger.info(f"Rolled back user creation for ID: {user_id}")
            except Exception as delete_e:
                logger.error(f"Failed to rollback user: {delete_e}")
        
        keycloak_admin.realm_name = "master"
        
        return jsonify({"error": "User creation failed", "details": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify service status."""
    try:
        # Test Keycloak connection
        keycloak_admin.get_realm(KEYCLOAK_REALM_NAME)
        keycloak_status = "connected"
    except Exception as e:
        keycloak_status = f"error: {str(e)}"
    
    try:
        # Test database connection
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.close()
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return jsonify({
        "status": "healthy" if keycloak_status == "connected" and db_status == "connected" else "unhealthy",
        "keycloak": keycloak_status,
        "database": db_status,
        "realm": KEYCLOAK_REALM_NAME
    }), 200 if keycloak_status == "connected" and db_status == "connected" else 503

@app.route('/users', methods=['POST'])
def create_user():
    """
    Creates a user in Keycloak and the local database.
    Accepts an optional 'roles' list to assign realm roles upon creation.
    """
    if not keycloak_admin:
        logger.error("Keycloak admin not initialized")
        return jsonify({"error": "Keycloak admin not initialized"}), 500
    
    # Check content type
    if not request.is_json:
        logger.error(f"Invalid content type: {request.content_type}")
        return jsonify({"error": "Content-Type must be application/json"}), 415
        
    data = request.get_json()
    logger.info(f"Received user creation request: {data}")
    
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        logger.error(f"Missing required fields in data: {data}")
        return jsonify({"error": "Missing username, password, or email"}), 400

    user_id = None
    try:
        # Switch to the target realm for user creation
        keycloak_admin.realm_name = KEYCLOAK_REALM_NAME
        
        # Create user in the target realm, not master
        new_user_payload = {
            "username": data['username'],
            "email": data['email'],
            "enabled": True,
            "credentials": [{"type": "password", "value": data['password'], "temporary": False}]
        }
        
        logger.info(f"Creating user in realm: {KEYCLOAK_REALM_NAME}")
        user_id = keycloak_admin.create_user(new_user_payload, exist_ok=False)
        logger.info(f"User created successfully with ID: {user_id}")
        
        # Assign roles if provided
        if 'roles' in data and isinstance(data['roles'], list):
            logger.info(f"Assigning roles: {data['roles']}")
            try:
                available_roles = keycloak_admin.get_realm_roles()
                roles_to_assign = []
                
                for role_name in data['roles']:
                    role_found = next((role for role in available_roles if role['name'] == role_name), None)
                    if role_found:
                        roles_to_assign.append(role_found)
                    else:
                        logger.warning(f"Role '{role_name}' not found in realm {KEYCLOAK_REALM_NAME}")
                
                if roles_to_assign:
                    keycloak_admin.assign_realm_roles(user_id=user_id, roles=roles_to_assign)
                    logger.info(f"Roles assigned successfully: {[r['name'] for r in roles_to_assign]}")
                
            except Exception as role_error:
                logger.error(f"Error assigning roles: {role_error}")
                # Continue with user creation even if role assignment fails

        # Switch back to master realm for admin operations
        keycloak_admin.realm_name = "master"
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO app_users (keycloak_id, full_name) VALUES (%s, %s)",
            (user_id, data.get('full_name'))
        )
        conn.commit()
        cur.close()
        conn.close()

    except Exception as e:
        logger.error(f"User creation failed: {type(e).__name__} - {e}")
        
        # Ensure we're in the correct realm for cleanup
        keycloak_admin.realm_name = KEYCLOAK_REALM_NAME
        
        # Rollback user creation if it was partially successful
        if user_id:
            try:
                keycloak_admin.delete_user(user_id=user_id)
                logger.info(f"Successfully rolled back Keycloak user creation for ID: {user_id}")
            except KeycloakError as delete_e:
                logger.error(f"CRITICAL: Failed to roll back user creation for {user_id}: {delete_e}")
        
        # Switch back to master realm
        keycloak_admin.realm_name = "master"
        
        error_message = str(e)
        if isinstance(e, KeycloakError):
            error_message = f"Keycloak error: {e.error_message}"

        return jsonify({"error": "User creation failed", "details": error_message}), 500

    return jsonify({"message": "User created successfully with roles", "keycloak_id": user_id}), 201

# --- (The other endpoints: get_user, update_user, delete_user are unchanged) ---
@app.route('/users/<keycloak_id>', methods=['GET'])
def get_user(keycloak_id):
    if not keycloak_admin:
        return jsonify({"error": "Keycloak admin not initialized"}), 500
    try:
        user_info = keycloak_admin.get_user(user_id=keycloak_id)
    except KeycloakError:
        return jsonify({"error": "User not found in Keycloak"}), 404
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT * FROM app_users WHERE keycloak_id = %s", (keycloak_id,))
        db_user = cur.fetchone()
        cur.close()
        conn.close()
    except psycopg2.Error as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
    response = {"keycloak_info": user_info, "database_info": dict(db_user) if db_user else None}
    return jsonify(response)

@app.route('/users/<keycloak_id>', methods=['PUT'])
def update_user(keycloak_id):
    if not keycloak_admin:
        return jsonify({"error": "Keycloak admin not initialized"}), 500
    data = request.get_json()
    try:
        user_info = keycloak_admin.get_user(user_id=keycloak_id)
        update_payload = {"email": data.get('email', user_info.get('email')), "firstName": data.get('firstName', user_info.get('firstName')), "lastName": data.get('lastName', user_info.get('lastName')),}
        keycloak_admin.update_user(user_id=keycloak_id, payload=update_payload)
    except KeycloakError:
        return jsonify({"error": "User not found in Keycloak"}), 404
    if 'full_name' in data:
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("UPDATE app_users SET full_name = %s WHERE keycloak_id = %s", (data['full_name'], keycloak_id))
            conn.commit()
            cur.close()
            conn.close()
        except psycopg2.Error as e:
            return jsonify({"error": "Database error", "details": str(e)}), 500
    return jsonify({"message": "User updated successfully"})

@app.route('/users/<keycloak_id>', methods=['DELETE'])
def delete_user(keycloak_id):
    if not keycloak_admin:
        return jsonify({"error": "Keycloak admin not initialized"}), 500
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM app_users WHERE keycloak_id = %s", (keycloak_id,))
        conn.commit()
        cur.close()
        conn.close()
    except psycopg2.Error as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
    try:
        keycloak_admin.delete_user(user_id=keycloak_id)
    except KeycloakError:
        return jsonify({"error": "User not found in Keycloak, but was deleted from local DB"}), 404
    return jsonify({"message": "User deleted successfully from both systems"}), 200

# --- Main Execution ---
if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=True)