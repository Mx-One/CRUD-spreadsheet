CREATE DATABASE spreadsheets;

CREATE TABLE "221 API Avenue" (
    id SERIAL PRIMARY KEY,
    "Slab name" TEXT,
    Finish TEXT,
    Supplier TEXT,
    SF numeric,
    "Slabs q-ty" numeric,
    "Our price" numeric,
    "Selling price" numeric,
    "Our TOTAL" numeric,
    "Client's TOTAL" numeric,
    Notes TEXT
);