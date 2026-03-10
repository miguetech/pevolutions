#!/usr/bin/env python3
"""
Script de pruebas rápidas para todos los endpoints
Ejecutar: python test_all_endpoints.py
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
TOKEN = None

def print_test(name, status, response=None):
    emoji = "✅" if status == 200 or status == 201 else "❌"
    print(f"{emoji} {name} - Status: {status}")
    if response and status >= 400:
        print(f"   Error: {response}")

def test_health():
    print("\n🔍 1. HEALTH CHECK")
    r = requests.get(f"{BASE_URL}/health")
    print_test("Health", r.status_code, r.json())
    return r.status_code == 200

def test_register():
    print("\n🔍 2. REGISTER")
    data = {
        "name": f"testuser_{datetime.now().timestamp()}",
        "password": "test123",
        "email": f"test_{datetime.now().timestamp()}@test.com"
    }
    r = requests.post(f"{BASE_URL}/api/auth/register", json=data)
    print_test("Register", r.status_code, r.json() if r.status_code >= 400 else None)
    return data if r.status_code == 200 else None

def test_login(username, password):
    print("\n🔍 3. LOGIN")
    global TOKEN
    data = {"name": username, "password": password}
    r = requests.post(f"{BASE_URL}/api/auth/login", json=data)
    print_test("Login", r.status_code)
    if r.status_code == 200:
        TOKEN = r.json()["access_token"]
        print(f"   Token: {TOKEN[:20]}...")
        return True
    return False

def test_get_players():
    print("\n🔍 4. GET MY PLAYERS")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    r = requests.get(f"{BASE_URL}/api/players/", headers=headers)
    print_test("Get Players", r.status_code)
    if r.status_code == 200:
        print(f"   Players: {len(r.json())}")

def test_create_player():
    print("\n🔍 5. CREATE PLAYER")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    data = {"name": f"Player_{datetime.now().timestamp()}", "sex": 0}
    r = requests.post(f"{BASE_URL}/api/players/", json=data, headers=headers)
    print_test("Create Player", r.status_code)
    return r.json()["name"] if r.status_code == 200 else None

def test_get_player(name):
    print("\n🔍 6. GET PLAYER")
    r = requests.get(f"{BASE_URL}/api/players/{name}")
    print_test(f"Get Player {name}", r.status_code)

def test_update_player(name):
    print("\n🔍 7. UPDATE PLAYER")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    data = {"level": 10}
    r = requests.put(f"{BASE_URL}/api/players/{name}", json=data, headers=headers)
    print_test("Update Player", r.status_code)

def test_player_stats(name):
    print("\n🔍 8. PLAYER STATS")
    r = requests.get(f"{BASE_URL}/api/players/{name}/stats")
    print_test("Player Stats", r.status_code)

def test_online_players():
    print("\n🔍 9. ONLINE PLAYERS")
    r = requests.get(f"{BASE_URL}/api/players/online?limit=5")
    print_test("Online Players", r.status_code)
    if r.status_code == 200:
        print(f"   Found: {len(r.json())} players")

def test_account_stats():
    print("\n🔍 10. ACCOUNT STATS")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    r = requests.get(f"{BASE_URL}/api/account/stats", headers=headers)
    print_test("Account Stats", r.status_code)

def test_change_password():
    print("\n🔍 11. CHANGE PASSWORD")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    data = {"current_password": "test123", "new_password": "test456"}
    r = requests.put(f"{BASE_URL}/api/account/password", json=data, headers=headers)
    print_test("Change Password", r.status_code)

def test_events():
    print("\n🔍 12. EVENTS")
    r = requests.get(f"{BASE_URL}/api/events")
    print_test("Events", r.status_code)
    if r.status_code == 200:
        print(f"   Events: {len(r.json())}")

def test_guilds():
    print("\n🔍 13. GUILDS")
    r = requests.get(f"{BASE_URL}/api/guilds")
    print_test("Guilds", r.status_code)
    if r.status_code == 200:
        print(f"   Guilds: {len(r.json())}")

def test_shop_packages():
    print("\n🔍 14. SHOP PACKAGES")
    r = requests.get(f"{BASE_URL}/api/shop/packages")
    print_test("Shop Packages", r.status_code)
    if r.status_code == 200:
        print(f"   Packages: {len(r.json())}")

def test_shop_premium():
    print("\n🔍 15. SHOP PREMIUM")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    r = requests.get(f"{BASE_URL}/api/shop/premium", headers=headers)
    print_test("Shop Premium", r.status_code)

def main():
    print("=" * 60)
    print("🚀 PEVOLUTIONS API - TEST COMPLETO")
    print("=" * 60)
    
    # Tests públicos
    if not test_health():
        print("\n❌ Servidor no disponible")
        return
    
    # Registro y login
    user_data = test_register()
    if not user_data:
        print("\n❌ No se pudo registrar usuario")
        return
    
    if not test_login(user_data["name"], user_data["password"]):
        print("\n❌ No se pudo hacer login")
        return
    
    # Tests con autenticación
    test_get_players()
    player_name = test_create_player()
    
    if player_name:
        test_get_player(player_name)
        test_update_player(player_name)
        test_player_stats(player_name)
    
    test_online_players()
    test_account_stats()
    test_change_password()
    
    # Tests públicos
    test_events()
    test_guilds()
    test_shop_packages()
    test_shop_premium()
    
    print("\n" + "=" * 60)
    print("✅ TESTS COMPLETADOS")
    print("=" * 60)

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: No se puede conectar al servidor")
        print("   Asegúrate de que el servidor esté corriendo en http://localhost:8000")
    except Exception as e:
        print(f"\n❌ Error: {e}")
