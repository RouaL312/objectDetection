                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
CREATE TABLE t_article (
	id_article bigint NOT NULL, 
	designation VARCHAR(10), 
	prix numeric(19,10), 
	code VARCHAR(64), 
	fk_image bigint, 
	date_creation timestamp(6) without time zone, 
	PRIMARY KEY (id_article), 
	UNIQUE (code)
);
CREATE TABLE t_user (
	id_user INTEGER NOT NULL, 
	username VARCHAR(64), 
	email VARCHAR(120), 
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
CREATE TABLE t_imageArticle (
	id_imageArticle bigint NOT NULL, 
	image_path VARCHAR(500), 
	date_creation timestamp(6) without time zone,
	fk_article bigint, 
	PRIMARY KEY (id_imageArticle), 
	FOREIGN KEY(fk_article) REFERENCES t_article (id_article)
)