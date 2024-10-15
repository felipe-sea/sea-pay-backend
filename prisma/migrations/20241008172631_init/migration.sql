-- CreateTable
CREATE TABLE "tb_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR NOT NULL,
    "account_type" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "registration" VARCHAR(18) NOT NULL,

    CONSTRAINT "tb_users_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_accounts" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "key" VARCHAR(24) NOT NULL,
    "account_number" VARCHAR(4),
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tb_accounts_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_transactions" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" VARCHAR(20) NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL,
    "origin_account_id" INTEGER NOT NULL,
    "origin_user_id" INTEGER NOT NULL,
    "destination_account_id" INTEGER NOT NULL,
    "destination_user_id" INTEGER NOT NULL,

    CONSTRAINT "tb_payments_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_contacts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "contact_id" INTEGER NOT NULL,

    CONSTRAINT "tb_contacts_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_registration_key" ON "tb_users"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "tb_accounts_key_key" ON "tb_accounts"("key");

-- CreateIndex
CREATE UNIQUE INDEX "tb_accounts_account_number_key" ON "tb_accounts"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "tb_accounts_user_id_key" ON "tb_accounts"("user_id");

-- CreateIndex
CREATE INDEX "tb_accounts_user_id_idx" ON "tb_accounts"("user_id");

-- AddForeignKey
ALTER TABLE "tb_accounts" ADD CONSTRAINT "tb_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_transactions" ADD CONSTRAINT "tb_transactions_tb_accounts_fk" FOREIGN KEY ("origin_account_id") REFERENCES "tb_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_transactions" ADD CONSTRAINT "tb_transactions_tb_users_fk" FOREIGN KEY ("origin_user_id") REFERENCES "tb_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_contacts" ADD CONSTRAINT "tb_contacts_tb_users_fk" FOREIGN KEY ("user_id") REFERENCES "tb_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_contacts" ADD CONSTRAINT "tb_contacts_tb_users_fk_1" FOREIGN KEY ("contact_id") REFERENCES "tb_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
