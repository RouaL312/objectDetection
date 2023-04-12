                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
CREATE TABLE t_product (
    id INT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
	url_image_prod VARCHAR(200), 
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(30) NOT NULL,
    quantity INT NOT NULL,
    inventoryStatus VARCHAR(20) NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
	UNIQUE (code)
);
CREATE TABLE t_user (
	id_user INTEGER NOT NULL, 
	username VARCHAR(64), 
	email VARCHAR(120), 
	phone VARCHAR(120), 
	password VARCHAR(500), 
	name VARCHAR(64), 
	gender VARCHAR(8), 
	profession VARCHAR(64), 
	is_admin BOOLEAN, 
	address VARCHAR(120), 
	date_creation timestamp(6) without time zone, 
	PRIMARY KEY (id_user), 
	UNIQUE (username), 
	UNIQUE (email), 
	CHECK (is_admin IN (False , True ))
);
CREATE TABLE t_panier (
	id_panier bigint NOT NULL, 
	montant_totale numeric(19,10), 
	date_creation timestamp(6) without time zone, 
	PRIMARY KEY (id_panier)
);
CREATE TABLE t_ligne_panier (
	id_ligne_panier bigint NOT NULL, 
	montant_total numeric(19,10), 
	quantite bigint NOT NULL,
	fk_panier bigint, 
	fk_article bigint, 
	date_creation timestamp(6) without time zone, 
	PRIMARY KEY (id_ligne_panier), 
	FOREIGN KEY(fk_panier) REFERENCES t_panier (id_panier),
	FOREIGN KEY(fk_article) REFERENCES t_article (id_article)
);
CREATE TABLE t_imageproduct (
    id INT PRIMARY KEY,
    filename VARCHAR(50) NOT NULL,
    filetype VARCHAR(20) NOT NULL,
    filesize INT NOT NULL,
    filepath VARCHAR(100) NOT NULL
);
