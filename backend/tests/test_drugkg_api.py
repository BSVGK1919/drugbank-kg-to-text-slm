"""
DrugKG Text AI Platform - Backend API Tests
Tests for: Auth, Chat, Generations, Admin endpoints
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8000")

# Test credentials from test_credentials.md
ADMIN_EMAIL = "drugbankkgtotext@uel.com"
ADMIN_PASSWORD = "drugbank1919"

class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        assert "hf_token_configured" in data
        print(f"Health check passed: {data}")


class TestAuthEndpoints:
    """Authentication endpoint tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["email"] == ADMIN_EMAIL
        assert data["is_admin"] == True
        print(f"Admin login successful: {data['name']}")
        return data["access_token"]
    
    def test_login_invalid_credentials(self):
        """Test login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("Invalid credentials correctly rejected")
    
    def test_get_me_authenticated(self):
        """Test /api/auth/me with valid token"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Get user info
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        print(f"Get me successful: {data}")
    
    def test_get_me_unauthenticated(self):
        """Test /api/auth/me without token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("Unauthenticated request correctly rejected")


class TestChatEndpoint:
    """Chat API endpoint tests - NEW feature"""
    
    def test_chat_endpoint_basic(self):
        """Test POST /api/chat with a simple message"""
        response = requests.post(f"{BASE_URL}/api/chat", json={
            "message": "What is aspirin?",
            "history": []
        }, timeout=30)  # Longer timeout for LLM response
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert len(data["response"]) > 0
        print(f"Chat response received: {data['response'][:100]}...")
    
    def test_chat_endpoint_with_history(self):
        """Test chat with conversation history"""
        response = requests.post(f"{BASE_URL}/api/chat", json={
            "message": "Tell me more about its mechanism",
            "history": [
                {"role": "user", "content": "What is aspirin?"},
                {"role": "assistant", "content": "Aspirin is a common pain reliever."}
            ]
        }, timeout=30)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        print(f"Chat with history response: {data['response'][:100]}...")
    
    def test_chat_endpoint_drug_interaction_query(self):
        """Test chat with drug interaction question"""
        response = requests.post(f"{BASE_URL}/api/chat", json={
            "message": "What are the interactions between warfarin and aspirin?",
            "history": []
        }, timeout=30)
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        print(f"Drug interaction query response: {data['response'][:100]}...")


class TestGenerationsEndpoint:
    """Generations API endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_my_generations_authenticated(self, auth_token):
        """Test GET /api/generations/my returns array for authenticated user"""
        response = requests.get(
            f"{BASE_URL}/api/generations/my",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"My generations count: {len(data)}")
    
    def test_get_my_generations_unauthenticated(self):
        """Test GET /api/generations/my without auth returns 401"""
        response = requests.get(f"{BASE_URL}/api/generations/my")
        assert response.status_code == 401
        print("Unauthenticated generations request correctly rejected")
    
    def test_export_generations(self, auth_token):
        """Test GET /api/generations/export"""
        response = requests.get(
            f"{BASE_URL}/api/generations/export",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "generations" in data
        print(f"Export generations count: {len(data['generations'])}")


class TestAdminEndpoints:
    """Admin API endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_admin_stats(self, admin_token):
        """Test GET /api/admin/stats returns statistics"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_generations" in data
        assert "avg_latency_ms" in data
        assert "generations_today" in data
        assert "generations_this_week" in data
        print(f"Admin stats: {data}")
    
    def test_admin_users_list(self, admin_token):
        """Test GET /api/admin/users returns user list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert isinstance(data["users"], list)
        print(f"Admin users count: {len(data['users'])}")
    
    def test_admin_recent_generations(self, admin_token):
        """Test GET /api/admin/recent-generations"""
        response = requests.get(
            f"{BASE_URL}/api/admin/recent-generations?limit=5",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "generations" in data
        print(f"Recent generations count: {len(data['generations'])}")


class TestGenerateEndpoint:
    """Text generation endpoint tests"""
    
    def test_generate_text(self):
        """Test POST /api/generate with sample triples"""
        sample_triples = """(Aspirin, mechanism_of_action, Cyclooxygenase inhibitor)
(Aspirin, indication, Pain relief)
(Aspirin, category, NSAID)"""
        
        response = requests.post(f"{BASE_URL}/api/generate", json={
            "triples": sample_triples
        }, timeout=60)  # Longer timeout for LLM
        
        # Should return 200 with generated text or 503 if model loading
        assert response.status_code in [200, 503, 504]
        
        if response.status_code == 200:
            data = response.json()
            assert "generated_text" in data
            assert "latency_ms" in data
            assert "input_length" in data
            print(f"Generated text: {data['generated_text'][:100]}...")
        else:
            print(f"Generation returned {response.status_code}: {response.json()}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
