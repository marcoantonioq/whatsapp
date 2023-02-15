-- CreateEnum
CREATE TYPE "Group" AS ENUM ('SENDING', 'CANCELED', 'CACHE');

-- CreateTable
CREATE TABLE "Contatos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefones" TEXT,
    "grupos" TEXT,
    "aniversario" TEXT,
    "email" TEXT,
    "address" TEXT,
    "notas" TEXT,
    "status" BOOLEAN DEFAULT true,
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
    "to" TEXT NOT NULL,
    "displayName" TEXT,
    "serialized" TEXT,
    "body" TEXT,
    "from" TEXT,
    "group" "Group" DEFAULT 'CACHE',
    "notifyName" TEXT,
    "self" TEXT,
    "caption" TEXT,
    "mimetype" TEXT,
    "type" TEXT,
    "data" TEXT,
    "old" TEXT,
    "info" TEXT,
    "status" BOOLEAN DEFAULT true,
    "hasMedia" BOOLEAN DEFAULT false,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(3),

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);
