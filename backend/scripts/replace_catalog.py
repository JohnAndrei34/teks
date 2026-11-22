"""One-off: remove the 12 sample games and 7 sample developers from Dea's design, plus the test orders
that point at them, so the real catalog in data/*.json can be seeded. Users and sessions are not touched.

Run from backend/ with the venv active:
    python -m scripts.replace_catalog          # dry run: prints what would be deleted, changes nothing
    python -m scripts.replace_catalog --yes    # deletes it, in one transaction
Then: python -m scripts.seed  (runs the migration and loads the new catalog)
"""

import sys

from sqlmodel import Session, col, delete, select

from app.database import engine
from app.models import Developer, Game, Order, OrderItem

OLD_GAMES = [
    "aswang-hours", "tikbalang-crossing", "maiba-taya", "tumbang-preso", "barrio-tindahan", "sigaw-ng-bayan",
    "jeepney-diaries", "kapre-sa-balete", "luksong-tinik", "parol-makers", "balangay-voyage", "bakunawa-eclipse",
]
OLD_DEVELOPERS = [
    "gabi-gabi-games", "lakbay-labs", "pitik-studio", "sari-soft", "sulo-interactive", "lakad-games",
    "dapithapon-digital",
]


def main(apply: bool) -> None:
    # Only the columns needed here are selected, so this works before and after the migration
    # adds new columns to the models.
    with Session(engine) as s:
        games = s.exec(select(Game.id, Game.slug).where(col(Game.slug).in_(OLD_GAMES))).all()
        devs = s.exec(select(Developer.id, Developer.slug).where(col(Developer.slug).in_(OLD_DEVELOPERS))).all()
        game_ids = [g.id for g in games]
        dev_ids = [d.id for d in devs]

        # every order that bought one of the old games, and all items of those orders
        order_ids = sorted(set(s.exec(select(OrderItem.order_id).where(col(OrderItem.game_id).in_(game_ids))).all()))
        orders = s.exec(
            select(Order.id, Order.code, Order.user_id, Order.total, Order.created_at)
            .where(col(Order.id).in_(order_ids)).order_by(Order.id)
        ).all()
        items = s.exec(
            select(OrderItem.id, OrderItem.order_id, OrderItem.game_id, OrderItem.title, OrderItem.price)
            .where(col(OrderItem.order_id).in_(order_ids)).order_by(OrderItem.id)
        ).all()

        # safety checks: nothing outside the old catalog may be swept up
        foreign_items = [i for i in items if i.game_id not in game_ids]
        other_games = s.exec(
            select(Game.id, Game.slug).where(col(Game.developer_id).in_(dev_ids), col(Game.id).not_in(game_ids))
        ).all()

        print(f"{'DELETING' if apply else 'DRY RUN: would delete'}:")
        print(f"  {len(orders)} orders")
        for o in orders:
            print(f"    {o.code}  user_id={o.user_id}  total={o.total}  {o.created_at:%Y-%m-%d %H:%M} UTC")
        print(f"  {len(items)} order_items")
        for i in items:
            print(f"    #{i.id} order {i.order_id}: {i.title} ({i.price})")
        print(f"  {len(games)} games:      {', '.join(sorted(g.slug for g in games))}")
        print(f"  {len(devs)} developers: {', '.join(sorted(d.slug for d in devs))}")
        print("  Not touched: users, sessions, auth_attempts, developer_submissions, contact_messages.")

        if foreign_items or other_games:
            print("STOP: an order also contains games outside the old catalog, or an old developer has other games:")
            for i in foreign_items:
                print(f"    order_item #{i.id}: {i.title}")
            for g in other_games:
                print(f"    game {g.slug}")
            sys.exit(1)

        if not apply:
            print("Nothing changed. Run again with --yes to delete.")
            return

        s.exec(delete(OrderItem).where(col(OrderItem.order_id).in_(order_ids)))
        s.exec(delete(Order).where(col(Order.id).in_(order_ids)))
        s.exec(delete(Game).where(col(Game.id).in_(game_ids)))
        s.exec(delete(Developer).where(col(Developer.id).in_(dev_ids)))
        s.commit()
        print("Done. Now run: python -m scripts.seed")


if __name__ == "__main__":
    main("--yes" in sys.argv[1:])
