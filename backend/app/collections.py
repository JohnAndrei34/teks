"""Pinoy Collections metadata. Static, so no table is needed."""

COLLECTION_SLUGS = ("folklore", "traditional-games", "history", "everyday-life")

COLLECTIONS: dict[str, dict] = {
    "folklore": {
        "slug": "folklore",
        "title": "Folklore",
        "tagline": "Aswang, tikbalang, diwata and the stories we grew up with.",
        "description": (
            "Philippine folklore is full of creatures that live between the village and the "
            "forest: the shape-shifting aswang, the horse-headed tikbalang, and the diwata who "
            "guard mountains and rivers. These tales were passed down by lola and lolo at night, "
            "and they still shape how many Filipinos see the dark."
        ),
        "cover_image": "/images/collections/folklore-cover.webp",
    },
    "traditional-games": {
        "slug": "traditional-games",
        "title": "Traditional Games",
        "tagline": "Laro ng lahi, played with a slipper, a can or a chalk line.",
        "description": (
            "Maiba-taya, tumbang preso and patintero need little more than friends and a street. "
            "Generations of Filipino kids learned teamwork, speed and strategy from these games "
            "long before consoles. These titles bring the neighborhood playground to your screen."
        ),
        "cover_image": "/images/collections/traditional-games-cover.webp",
    },
    "history": {
        "slug": "history",
        "title": "History",
        "tagline": "From the galleon trade to the Katipunan, play the past.",
        "description": (
            "For over 250 years the Manila galleons linked Asia, the Americas and Europe, and "
            "the Katipunan later rose to fight for independence. Games in this collection retell "
            "moments from the Philippines' past through a Filipino lens, inviting players to "
            "explore history as something lived rather than memorized."
        ),
        "cover_image": "/images/collections/history-cover.webp",
    },
    "everyday-life": {
        "slug": "everyday-life",
        "title": "Everyday Life",
        "tagline": "Jeepneys, sari-sari stores, fiestas and family far from home.",
        "description": (
            "Ordinary Filipino life is full of small stories: the sari-sari store on the corner, "
            "the jeepney ride to school, the fiesta that fills the whole barangay. Many families "
            "also keep in touch across oceans through OFW relatives. These games find charm and "
            "meaning in the everyday."
        ),
        "cover_image": "/images/collections/everyday-life-cover.webp",
    },
}
