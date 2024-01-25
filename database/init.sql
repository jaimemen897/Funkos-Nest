DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS usuarios_id_seq;
CREATE SEQUENCE usuarios_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 5 CACHE 1;

CREATE TABLE "public"."users"
(
    "is_deleted" boolean   DEFAULT false                      NOT NULL,
    "created_at" timestamp DEFAULT now()                      NOT NULL,
    "id"         bigint    DEFAULT nextval('usuarios_id_seq') NOT NULL,
    "updated_at" timestamp DEFAULT now()                      NOT NULL,
    "apellidos"  character varying(255)                       NOT NULL,
    "email"      character varying(255)                       NOT NULL,
    "nombre"     character varying(255)                       NOT NULL,
    "password"   character varying(255)                       NOT NULL,
    "username"   character varying(255)                       NOT NULL,
    CONSTRAINT "usuarios_email_key" UNIQUE ("email"),
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "usuarios_username_key" UNIQUE ("username")
) WITH (oids = false);

INSERT INTO "users" ("is_deleted", "created_at", "id", "updated_at", "apellidos", "email", "nombre", "password",
                     "username")
VALUES ('f', '2023-11-02 11:43:24.724871', 1, '2023-11-02 11:43:24.724871', 'Admin Admin', 'admin@prueba.net', 'Admin',
        '$2a$12$Kr2XsQQTMASxRfsqc8lzC.DGL4wDsQZY2rmYgDB5wtoGf9JgrlERG', 'admin'),
       ('f', '2023-11-02 11:43:24.730431', 2, '2023-11-02 11:43:24.730431', 'User User', 'user@prueba.net', 'User',
        '$2a$12$xxs9QBt2z4LcARkm80FWhOYDsvJemUihG4Xehu61WLgzszsi27V2i', 'user'),
       ('f', '2023-11-02 11:43:24.733552', 3, '2023-11-02 11:43:24.733552', 'Test Test', 'test@prueba.net', 'Test',
        '$2a$12$O1IgSRg8VTGR2nN0kh0T1OIo2ifB4DONwwXvNegkZ.8J8UbCtdFvS', 'test');

DROP TABLE IF EXISTS "user_roles";
DROP SEQUENCE IF EXISTS user_roles_id_seq;
CREATE SEQUENCE user_roles_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 6 CACHE 1;

CREATE TABLE "public"."user_roles"
(
    "user_id" bigint,
    "role"    character varying(50) DEFAULT 'USER'                       NOT NULL,
    "id"      integer               DEFAULT nextval('user_roles_id_seq') NOT NULL,
    CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "user_roles" ("user_id", "role", "id")
VALUES (1, 'USER', 1),
       (1, 'ADMIN', 2),
       (2, 'USER', 3),
       (3, 'USER', 4);