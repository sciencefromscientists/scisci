
CREATE TABLE usertype (
"id" SERIAL PRIMARY KEY, 
"name" VARCHAR(25) NOT NULL
);

CREATE TABLE users (
"id" SERIAL PRIMARY KEY, 
"first_name" VARCHAR(150) NOT NULL,
"last_name" VARCHAR(150) NOT NULL,  
"username" VARCHAR(255) NOT NULL, 
"password" VARCHAR(255) DEFAULT '$2a$10$hHqRWK07ePfHgr6xZN526u/g5.ch.YgGJa1DBFF9IkR70DEBhng5e', --The default is Welcome1 encrypted., 
"usertype" INT REFERENCES "usertype" NOT NULL
);

-- The 3 standard user types used in the application.
INSERT INTO usertype (name)
VALUES ('Admin'),('Editor'),('Shopper');

-- This will be the very first admin.
INSERT INTO users (first_name, last_name, username, usertype)
VALUES ('Renee', 'Piersa', 'test@email.com', 1);

CREATE TABLE components (
"id" SERIAL PRIMARY KEY, 
"name" VARCHAR(50), 
"description" VARCHAR(255), 
"vendor_name_primary" VARCHAR(100), 
"vendor_url_primary" VARCHAR(255), 
"vendor_name_secondary" VARCHAR(100), 
"vendor_url_secondary" VARCHAR(255), 
"notes" TEXT, 
"price_per_unit" DECIMAL(5, 2), 
"pieces_per_unit" INT,
"consumable" BOOLEAN, 
"type" VARCHAR(50), 
"general_stock_item" BOOLEAN
);

CREATE TABLE modules (
"id" SERIAL PRIMARY KEY, 
"name" VARCHAR(100), 
"code" VARCHAR(15),  
"version_number" VARCHAR(15), 
"version_date" DATE,
"version_notes" TEXT,   
"estimated_assembly_time" INT, 
"assembly_notes" TEXT, 
"module_drive_link" VARCHAR(255), 
"to_be_printed_link" VARCHAR(255), 
"assembly_video_link" VARCHAR(255),  
"activity_video_link" VARCHAR(255), 
"kit_content_link" VARCHAR(255), 
"kit_content_title" VARCHAR(50),
"other1_link" VARCHAR(255), 
"other1_title" VARCHAR(50),
"other2_link" VARCHAR(255), 
"other2_title" VARCHAR(50)  
);

CREATE TABLE components_modules (
"id" SERIAL PRIMARY KEY, 
"module_id" INT REFERENCES "modules", 
"component_id" INT REFERENCES "components",
"pieces_per_kit" INT
);

CREATE TABLE shoppinglist (
"id" SERIAL PRIMARY KEY, 
"name" VARCHAR(100), 
"date" TIMESTAMP, 
"user_created_by" VARCHAR(50)

);

CREATE TABLE modules_shopping (
"id" SERIAL PRIMARY KEY, 
"quantity" INT, 
"shopping_id" INT REFERENCES "shoppinglist", 
"module_id" INT REFERENCES "modules",
"ordered" BOOLEAN, 
"in_house" BOOLEAN
);

CREATE TABLE app_settings (
"id" SERIAL PRIMARY KEY,
"labor_rate" DECIMAL (5, 2),
"last_changed" VARCHAR(150)
);


INSERT INTO app_settings (labor_rate, last_changed)
VALUES (0, 'Default');