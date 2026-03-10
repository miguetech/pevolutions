# Backend Testing with pytest

## Test Structure

### Basic Test
```python
# tests/test_users.py
import pytest
from app.models import User
from app.crud import create_user, get_user

def test_create_user(db_session):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    user = create_user(db_session, user_data)
    
    assert user.id is not None
    assert user.username == "testuser"
    assert user.email == "test@example.com"

def test_get_user(db_session):
    # Arrange
    user = User(username="john", email="john@example.com")
    db_session.add(user)
    db_session.commit()
    
    # Act
    retrieved_user = get_user(db_session, user.id)
    
    # Assert
    assert retrieved_user is not None
    assert retrieved_user.username == "john"
```

## Fixtures

### Database Fixture
```python
# tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base

@pytest.fixture(scope="function")
def db_session():
    # Create test database
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(engine)

@pytest.fixture
def sample_user(db_session):
    user = User(username="testuser", email="test@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user
```

### Client Fixture
```python
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def authenticated_client(client, sample_user):
    # Login and get token
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    token = response.json()["access_token"]
    
    # Add token to headers
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    return client
```

## Testing API Endpoints

### GET Requests
```python
def test_get_users(client, sample_user):
    response = client.get("/api/users")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["username"] == "testuser"

def test_get_user_not_found(client):
    response = client.get("/api/users/999")
    assert response.status_code == 404
```

### POST Requests
```python
def test_create_user(client):
    user_data = {
        "username": "newuser",
        "email": "new@example.com",
        "password": "password123"
    }
    response = client.post("/api/users", json=user_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert "password" not in data  # Should not return password

def test_create_user_duplicate_email(client, sample_user):
    user_data = {
        "username": "another",
        "email": "test@example.com",  # Duplicate
        "password": "password123"
    }
    response = client.post("/api/users", json=user_data)
    assert response.status_code == 400
```

### PUT/PATCH Requests
```python
def test_update_user(authenticated_client, sample_user):
    update_data = {"username": "updated_name"}
    response = authenticated_client.put(
        f"/api/users/{sample_user.id}",
        json=update_data
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "updated_name"
```

### DELETE Requests
```python
def test_delete_user(authenticated_client, sample_user):
    response = authenticated_client.delete(f"/api/users/{sample_user.id}")
    assert response.status_code == 204
    
    # Verify deletion
    response = authenticated_client.get(f"/api/users/{sample_user.id}")
    assert response.status_code == 404
```

## Mocking

### Mock External API
```python
from unittest.mock import patch, MagicMock

@patch('app.services.external_api.fetch_data')
def test_fetch_user_data(mock_fetch, client):
    # Setup mock
    mock_fetch.return_value = {"id": 1, "name": "John"}
    
    response = client.get("/api/external/user/1")
    
    assert response.status_code == 200
    assert response.json()["name"] == "John"
    mock_fetch.assert_called_once_with(1)
```

### Mock Database
```python
@patch('app.crud.get_user')
def test_get_user_endpoint(mock_get_user, client):
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.username = "testuser"
    mock_get_user.return_value = mock_user
    
    response = client.get("/api/users/1")
    
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
```

## Parametrized Tests

```python
@pytest.mark.parametrize("username,email,expected_status", [
    ("valid", "valid@example.com", 201),
    ("ab", "valid@example.com", 422),  # Too short
    ("valid", "invalid-email", 422),    # Invalid email
    ("", "valid@example.com", 422),     # Empty username
])
def test_create_user_validation(client, username, email, expected_status):
    response = client.post("/api/users", json={
        "username": username,
        "email": email,
        "password": "password123"
    })
    assert response.status_code == expected_status
```

## Testing Authentication

```python
def test_login_success(client, sample_user):
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    response = client.post("/api/auth/login", json={
        "email": "wrong@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401

def test_protected_route_without_token(client):
    response = client.get("/api/users/me")
    assert response.status_code == 401

def test_protected_route_with_token(authenticated_client):
    response = authenticated_client.get("/api/users/me")
    assert response.status_code == 200
```

## Testing Database Operations

```python
def test_user_cascade_delete(db_session):
    # Create user with posts
    user = User(username="john", email="john@example.com")
    db_session.add(user)
    db_session.commit()
    
    post = Post(title="Test", user_id=user.id)
    db_session.add(post)
    db_session.commit()
    
    # Delete user
    db_session.delete(user)
    db_session.commit()
    
    # Verify posts are deleted
    posts = db_session.query(Post).filter(Post.user_id == user.id).all()
    assert len(posts) == 0
```

## Coverage

### Run with Coverage
```bash
# Install
pip install pytest-cov

# Run tests with coverage
pytest --cov=app --cov-report=html

# View report
open htmlcov/index.html
```

### Coverage Configuration
```ini
# .coveragerc
[run]
omit = 
    */tests/*
    */venv/*
    */__pycache__/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
    if __name__ == .__main__.:
```

## Best Practices

1. **Use fixtures** for reusable test data
2. **Test one thing** per test function
3. **Use descriptive names** - test_should_return_404_when_user_not_found
4. **Follow AAA pattern** - Arrange, Act, Assert
5. **Mock external dependencies** - APIs, databases, file systems
6. **Test edge cases** - empty inputs, null values, boundaries
7. **Test error handling** - invalid inputs, exceptions
8. **Use parametrize** for multiple similar test cases
9. **Aim for >80% coverage** on critical code
10. **Keep tests fast** - use in-memory databases
11. **Clean up after tests** - use fixtures with teardown
12. **Test authentication** and authorization separately
