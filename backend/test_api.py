#!/usr/bin/env python3
"""
Script para probar los endpoints del backend
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_register():
    print("🔍 Testing register endpoint...")
    data = {
        "name": "testuser",
        "password": "testpass123",
        "email": "test@example.com"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    return response.json()

def test_login(name, password):
    print("🔍 Testing login endpoint...")
    data = {
        "name": name,
        "password": password
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    return response.json()

def test_get_players(token):
    print("🔍 Testing get players endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/players/", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_create_player(token):
    print("🔍 Testing create player endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": "TestPlayer",
        "sex": 0
    }
    response = requests.post(f"{BASE_URL}/api/players/", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_change_password(token):
    print("🔍 Testing change password endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "current_password": "testpass123",
        "new_password": "newpass456"
    }
    response = requests.put(f"{BASE_URL}/api/account/password", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_update_settings(token):
    print("🔍 Testing update settings endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "email": "newemail@example.com",
        "flag": "US"
    }
    response = requests.put(f"{BASE_URL}/api/account/settings", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_get_stats(token):
    print("🔍 Testing get stats endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/account/stats", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_online_players():
    print("🔍 Testing online players endpoint...")
    response = requests.get(f"{BASE_URL}/api/players/online?limit=10")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

if __name__ == "__main__":
    print("=" * 50)
    print("PEVOLUTIONS API TEST")
    print("=" * 50 + "\n")
    
    test_health()
    test_online_players()
    
    # Descomentar para probar endpoints protegidos
    # account = test_register()
    # login_result = test_login("testuser", "testpass123")
    # token = login_result.get("access_token")
    # test_get_players(token)
    # test_create_player(token)
    # test_get_stats(token)
    # test_update_settings(token)
    # test_change_password(token)

