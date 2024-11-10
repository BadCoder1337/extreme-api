from datetime import datetime

from sqlalchemy import Column, String, Integer,Boolean, UniqueConstraint, PrimaryKeyConstraint
from sqlalchemy import ForeignKey, Table, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

user_roles = Table('user_roles', Base.metadata,
                   Column('user_id', Integer, ForeignKey('users.id', ondelete="CASCADE")),
                   Column('role_id', Integer, ForeignKey('roles.id', ondelete="CASCADE"))
                   )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    roles = relationship("Role", secondary=user_roles, back_populates="users")

    UniqueConstraint("email", name="uq_user_email")

    PrimaryKeyConstraint("id", name="pk_user_id")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    users = relationship("User", secondary=user_roles, back_populates="roles")
