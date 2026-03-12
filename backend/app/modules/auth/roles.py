from enum import IntEnum

class AccountRole(IntEnum):
    """Account role levels for permissions"""
    PLAYER = 1
    JUNIOR_TUTOR = 2
    SENIOR_TUTOR = 3
    GM = 4
    ADMIN = 5
    OWNER = 6
