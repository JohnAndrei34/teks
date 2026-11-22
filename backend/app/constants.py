"""Allowed values shared by models, routers and /api/config. Enforced with Literal, not DB enums."""

from typing import Literal, get_args

Genre = Literal["Action", "Adventure", "RPG", "Horror", "Simulation", "Casual", "Strategy"]
Platform = Literal["PC", "Mobile", "PS5", "Xbox", "Switch"]
CollectionSlug = Literal["folklore", "traditional-games", "history", "everyday-life"]
DeveloperType = Literal["student", "indie", "studio"]
Role = Literal["customer", "developer"]
PaymentMethod = Literal["gcash", "maya", "card"]
InquiryType = Literal["general", "developer", "creator", "community", "school"]

GENRES: tuple[str, ...] = get_args(Genre)
PLATFORMS: tuple[str, ...] = get_args(Platform)
ROLES: tuple[str, ...] = get_args(Role)
