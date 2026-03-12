import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_server_info():
    """Test server info endpoint"""
    response = client.get("/api/server/info")
    assert response.status_code == 200
    data = response.json()
    assert "online_count" in data
    assert "status" in data
    assert "uptime" in data
    assert isinstance(data["online_count"], int)
    assert data["status"] in ["online", "offline"]

def test_get_top_players():
    """Test top players endpoint"""
    response = client.get("/api/players/top?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "name" in data[0]
        assert "level" in data[0]
        assert "score" in data[0]

def test_get_top_guilds():
    """Test top guilds endpoint"""
    response = client.get("/api/guilds/top?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "name" in data[0]
        assert "members" in data[0]
        assert "points" in data[0]

def test_get_support_staff():
    """Test support staff endpoint"""
    response = client.get("/api/support/staff")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "name" in data[0]
        assert "role" in data[0]
        assert "availability" in data[0]

def test_get_downloads():
    """Test downloads endpoint"""
    response = client.get("/api/downloads")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "name" in data[0]
        assert "version" in data[0]
        assert "url" in data[0]
