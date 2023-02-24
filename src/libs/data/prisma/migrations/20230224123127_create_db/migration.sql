-- CreateEnum
CREATE TYPE "Group" AS ENUM ('CACHE', 'CANCELED', 'SENDING');

-- CreateTable
CREATE TABLE "Contatos" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "aniversario" TEXT,
    "email" TEXT,
    "grupos" TEXT,
    "nome" TEXT NOT NULL,
    "notas" TEXT,
    "status" BOOLEAN DEFAULT true,
    "telefones" TEXT,
    "modified" TIMESTAMP(3),
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupos" (
    "nome" TEXT NOT NULL,

    CONSTRAINT "Grupos_pkey" PRIMARY KEY ("nome")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "body" TEXT,
    "caption" TEXT,
    "data" TEXT,
    "displayName" TEXT,
    "from" TEXT,
    "group" "Group" DEFAULT 'CACHE',
    "hasMedia" BOOLEAN DEFAULT false,
    "info" TEXT,
    "mimetype" TEXT,
    "notifyName" TEXT,
    "old" TEXT,
    "self" TEXT,
    "serialized" TEXT,
    "status" BOOLEAN DEFAULT true,
    "to" TEXT NOT NULL,
    "type" TEXT,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(3),

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);
