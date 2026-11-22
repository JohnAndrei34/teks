"""Link a developer account to a catalog studio, so that account (and only that account) sees the
studio's tracker, profit and purchases in the developer dashboard.

Team only (Drei). Run it after checking the claim with the studio, for example by an email from the
address on the studio's official page. Signup alone never links a studio: anyone can type a studio's name.

Run from backend/ with the venv active (needs the owner_user_id column: python -m scripts.migrate):
    python -m scripts.link_studio <email> <developer-slug>            link
    python -m scripts.link_studio --unlink <email> <developer-slug>   remove that link
    python -m scripts.link_studio --list                              show every linked studio
"""

import sys

from sqlmodel import Session, select

from app.database import engine
from app.models import Developer, User

USAGE = __doc__.split("Run from")[1].split("\n", 1)[1]


def fail(msg: str) -> None:
    print("Not changed:", msg)
    sys.exit(1)


def show_links(session: Session) -> None:
    rows = session.exec(select(Developer, User).join(User, User.id == Developer.owner_user_id).order_by(Developer.slug)).all()
    if not rows:
        print("No studios are linked yet.")
    for dev, user in rows:
        print(f"  {dev.slug:28} {dev.name:28} -> {user.email} (account studio: {user.studio!r})")


def main(argv: list[str]) -> None:
    if argv == ["--list"]:
        with Session(engine) as session:
            show_links(session)
        return
    unlink = "--unlink" in argv
    args = [a for a in argv if a != "--unlink"]
    if len(args) != 2 or any(a.startswith("-") for a in args):
        print(USAGE)
        sys.exit(2)
    email, slug = args[0].strip().lower(), args[1].strip()

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        dev = session.exec(select(Developer).where(Developer.slug == slug)).first()
        if user is None:
            fail(f"no account with the email {email}.")
        if dev is None:
            fail(f"no developer with the slug {slug!r} (see backend/data/developers.json).")

        if unlink:
            if dev.owner_user_id != user.id:
                fail(f"{dev.name} is not linked to {email}.")
            dev.owner_user_id = None
            session.add(dev)
            session.commit()
            print(f"Unlinked {dev.name} ({dev.slug}) from {email}.")
            return

        if user.role != "developer":
            fail(f"{email} is a {user.role} account; only developer accounts can be linked.")
        if dev.slug.startswith("tbc-"):
            fail(f"{dev.slug} is a 'Studio to be confirmed' placeholder; add the real studio to developers.json first.")
        if dev.owner_user_id == user.id:
            print(f"{dev.name} is already linked to {email}. Nothing to do.")
            return
        if dev.owner_user_id is not None:
            owner = session.get(User, dev.owner_user_id)
            fail(f"{dev.name} is already linked to {owner.email if owner else 'account #' + str(dev.owner_user_id)}. "
                 f"Unlink it first if the claim is wrong.")
        other = session.exec(select(Developer).where(Developer.owner_user_id == user.id)).first()
        if other is not None:
            fail(f"{email} is already linked to {other.name} ({other.slug}). One account, one studio.")

        if (user.studio or "").strip().lower() != dev.name.strip().lower():
            print(f"Note: the account's studio name is {user.studio!r}, the catalog says {dev.name!r}.")
        dev.owner_user_id = user.id
        session.add(dev)
        session.commit()
        print(f"Linked {dev.name} ({dev.slug}) to {email}. That account now sees the studio's tracker and purchases.")


if __name__ == "__main__":
    main(sys.argv[1:])
