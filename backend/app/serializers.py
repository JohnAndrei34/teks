from app.models import Developer, Game


def developer_brief(dev: Developer) -> dict:
    return {"slug": dev.slug, "name": dev.name, "type": dev.type}


def game_out(game: Game, dev: Developer) -> dict:
    data = game.model_dump()
    data.pop("developer_id", None)
    data["developer"] = developer_brief(dev)
    return data
